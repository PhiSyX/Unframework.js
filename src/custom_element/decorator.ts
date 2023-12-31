import { capitalize, kebabize } from "~/helpers/string";

import { type AttachShadowMode, GlobalCustomElement } from "./global";
import type {
	CustomElementConstructor,
	CustomElementInterface,
} from "./interface";
import { is_signal } from "~/signal";

// ---- //
// Type //
// ---- //

type CustomElementDecoratorOptions = {
	/**
	 * Nom du custom-element
	 */
	tagName?: `${string}-${string}`;

	/**
	 * Nom d'un élément HTML natif à étendre.
	 */
	extends?: keyof HTMLElementTagNameMap;

	/**
	 * Mode d'encapsulation de l'arbre du Shadow DOM.
	 */
	mode?: AttachShadowMode;
};

type AttrDecoratorOptions = {
	parser?: (<T>(...args: any[]) => T) | StringConstructor | NumberConstructor;
};

// ---------- //
// Décorateur //
// ---------- //

/**
 * Décorateur `customElement`
 */
function customElement(options?: CustomElementDecoratorOptions) {
	function Ctor<
		UCE extends CustomElementConstructor<UCEInstance>,
		UCEInstance extends CustomElementInterface
	>(UserCustomElement: UCE) {
		let custom_tag_name =
			options?.tagName || kebabize(UserCustomElement.name);

		function custom_event_name(name: string): `handle${string}Event` {
			let capitalized = capitalize(name, {
				includes_separators: false,
			});
			return `handle${capitalized}Event`;
		}

		class LocalCustomElement extends GlobalCustomElement {
			public static TAG_NAME: string = custom_tag_name;

			static get observedAttributes(): Array<string> {
				return UserCustomElement.dynamic_attributes || [];
			}

			public element!: UCEInstance;

			constructor() {
				super(options?.mode || "closed");

				this.element = new UserCustomElement(this);
				this.element.customElement = this;
			}

			render() {
				let $extension = this.element.render();

				this.root.appendChild($extension.node());

				return $extension;
			}

			update() {
				super.update();
				if (this.root.firstChild) {
					this.root.removeChild(this.root.firstChild);
					this.connectedCallback();
				}
			}

			connectedCallback() {
				this.element.mounted?.();
				let $extension = this.render();

				let events = UserCustomElement.events || [];
				$extension.define_events_for_custom_elements(events);

				for (let evt_name of events) {
					let method_name = custom_event_name(evt_name);

					// @ts-expect-error : TODO
					if (!this.element[method_name]) {
						console.error(
							"La méthode «",
							method_name,
							"»",
							"n'existe pas sur «",
							this,
							"»"
						);
						break;
					}

					$extension.on(evt_name, (evt) => {
						// @ts-expect-error : TODO
						this.element[method_name].call(this.element, evt);
					});
				}
			}

			attributeChangedCallback(
				attribute_name: string,
				attribute_old_value: string | null,
				attribute_new_value: string | null
			) {
				if (
					UserCustomElement.dynamic_attributes?.includes(attribute_name)
				) {
					let p = (this.element as any)[attribute_name];

					if (!p) return;

					if (is_signal(p)) {
						p.replace(attribute_new_value);
					} else {
						// FIXME: améliorer cette partie.
						(this.element as any)[attribute_name] = JSON.parse(
							attribute_new_value!
						);
						this.update();
					}
				}

				this.element.updated_attribute?.(
					attribute_name,
					attribute_old_value,
					attribute_new_value
				);
			}

			disconnectedCallback() {
				this.element.unmounted?.();
			}
		}

		window.customElements.define(custom_tag_name, LocalCustomElement, {
			extends: options?.extends,
		});

		return LocalCustomElement as unknown as UCE;
	}

	return Ctor;
}

/**
 * Décorateur `attr`. Ce décorateur récupère l'attribut HTML automatiquement via
 * la propriété `customElement`. Raccourci.
 */
function attr<T extends CustomElementInterface>(
	options?: AttrDecoratorOptions
) {
	let parser = options?.parser || String;

	return function (
		_: T,
		property_name: string,
		descriptor: PropertyDescriptor
	) {
		let property_name_kb = kebabize(property_name);
		const orig_getter = descriptor.get;

		descriptor.get = function (this: T) {
			let output = parser(
				this.customElement?.getAttribute(property_name_kb) ||
					orig_getter?.call(this)
			);
			return output;
		};
	};
}

// ------ //
// Export //
// ------ //

export type { CustomElementDecoratorOptions };
export { attr, customElement };
