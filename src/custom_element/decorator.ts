import { kebabize } from "~/helpers/string";

import { type AttachShadowMode, GlobalCustomElement } from "./global";
import type { CustomElementConstructor, CustomElementInterface } from "./interface";
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
	parser?:
		| (<T>(...args: any[]) => T)
		| StringConstructor
		| NumberConstructor
}

// ---------- //
// Décorateur //
// ---------- //

/**
 * Décorateur `customElement`
 */
function customElement(options?: CustomElementDecoratorOptions)
{
	function Ctor<
		UCE extends CustomElementConstructor<UCEInstance>,
		UCEInstance extends CustomElementInterface,
	>(UserCustomElement: UCE)
	{
		let custom_tag_name = options?.tagName || kebabize(UserCustomElement.name);

		class LocalCustomElement extends GlobalCustomElement
		{
			public static TAG_NAME: string = custom_tag_name;

			static get observedAttributes(): Array<string> {
				return UserCustomElement.dyn_attributes || [];
			}

			public element!: UCEInstance;

			constructor()
			{
				super(options?.mode || "closed");

				this.element = new UserCustomElement(this);
				this.element.customElement = this;
				this.render();
			}

			render()
			{
				let $extension = this.element.render();

				this.root.appendChild($extension.$native_element);
			}

			connectedCallback()
			{
				this.element.mounted?.();
			}

			attributeChangedCallback(
				attribute_name: string,
				attribute_old_value: string | null,
				attribute_new_value: string | null,
			)
			{
				if (UserCustomElement.dyn_attributes?.includes(attribute_name)) {
					let p = (this.element as any)[attribute_name];
					if (p && is_signal(p)) {
						p.replace(attribute_new_value);
					}
				}

				this.element.updated_attribute?.(
					attribute_name,
					attribute_old_value,
					attribute_new_value,
				);
			}

			disconnectedCallback()
			{
				this.element.unmounted?.();
			}
		}

		window.customElements.define(
			custom_tag_name,
			LocalCustomElement,
			{ extends: options?.extends },
		);

		return LocalCustomElement as unknown as UCE;
	}

	return Ctor;
}

/**
 * Décorateur `attr`. Ce décorateur récupère l'attribut HTML automatiquement via
 * la propriété `customElement`. Raccourci.
 */
function attr<T extends CustomElementInterface>(options?: AttrDecoratorOptions)
{
	return function(_: T, property_name: string, descriptor: PropertyDescriptor)
	{
		const orig_getter = descriptor.get;

		descriptor.get = function(this: T)
		{
			let output = options?.parser?.(
				this.customElement?.getAttribute(property_name)
			) || orig_getter?.call(this);
			return output;
		};
	}
}

// ------ //
// Export //
// ------ //

export type { CustomElementDecoratorOptions };
export { attr, customElement };
