import type {
	CustomElementConstructor,
	CustomElementInterface,
} from "./custom_element/interface";

// -------- //
// Fonction //
// -------- //

function use<
	UCE extends CustomElementConstructor<UCEInstance>,
	UCEInstance extends CustomElementInterface,
>(
	UserCustomElement: UCE,
	props?: Record<string, { toString(): string }>
): HTMLElement
{
	let ce = document.createElement(UserCustomElement.TAG_NAME!);

	if (props) {
		let entries = Object.entries(props);
		for (let [k, v] of entries) {
			ce.setAttribute(k, v.toString());
		}
	}

	return ce;
}

// ------ //
// Export //
// ------ //

export * from "./custom_element/decorator";
export * from "./custom_element/global";
export { use };
