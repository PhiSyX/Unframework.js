import { HTMLExtension } from "~/html_extension";

// --------- //
// Interface //
// --------- //

interface CustomElementInterface
{
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
	updated_attribute?: (...args: Array<unknown>) => void;

	/**
	 * Rendu de l'élément personnalisé.
	 */
	render(): HTMLExtension;
}

// ------ //
// Export //
// ------ //

export type { CustomElementInterface };
