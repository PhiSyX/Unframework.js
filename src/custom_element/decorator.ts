import { kebabize } from "~/helpers/string";

import { type AttachShadowMode, GlobalCustomElement } from "./global";
import { type CustomElementInterface } from "./interface";

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

// ---------- //
// Décorateur //
// ---------- //

/**
 * Décorateur `customElement`
 */
function customElement(options?: CustomElementDecoratorOptions)
{
	function Ctor<
		UCE extends { new (_: GlobalCustomElement): UCEInstance },
		UCEInstance extends CustomElementInterface,
	>(UserCustomElement: UCE)
	{
		let custom_tag_name = options?.tagName || kebabize(UserCustomElement.name);

		class LocalCustomElement extends GlobalCustomElement
		{
			public static TAG_NAME: string = custom_tag_name;

			public element!: UCEInstance;

			constructor()
			{
				super(options?.mode || "closed");

				this.element = new UserCustomElement(this);
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

			attributeChangedCallback(...args: unknown[])
			{
				this.element.updated_attribute?.(...args);
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

// ------ //
// Export //
// ------ //

export type { CustomElementDecoratorOptions };
export { customElement };
