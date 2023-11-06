import type { HTMLExtension } from "~/html_extension";
import type { GlobalCustomElement } from "./global";

// --------- //
// Interface //
// --------- //

interface CustomElementConstructor<Instance extends CustomElementInterface>
{
	new (_: GlobalCustomElement): Instance;

	dyn_attributes?: Array<string>;
}

interface CustomElementInterface
{
	customElement?: GlobalCustomElement;

	/**
	 * Lorsque l'élément personnalisé est monté.
	 */
	mounted?: () => void;
	/**
	 * Lorsque l'élément personnalisé est démonté.
	 */
	unmounted?: () => void;

	/**
	 * Lorsque les attributs de l'élément personnalisé changent. Ces attributs
	 * DOIVENT être indiqués dans le tableau static `observedAttributes`.
	 */
	updated_attribute?: (
		attribute_name: string,
		attribute_old_value: string | null,
		attribute_new_value: string | null,
	) => void;

	/**
	 * Rendu de l'élément personnalisé.
	 */
	render(): HTMLExtension;
}

// ------ //
// Export //
// ------ //

export type { CustomElementConstructor, CustomElementInterface };
