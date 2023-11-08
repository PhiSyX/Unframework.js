import type {
	CustomElementConstructor,
	CustomElementInterface,
} from "./custom_element/interface";
import { Computed, is_computed } from "./signal";

// -------- //
// Fonction //
// -------- //

function use<
	UCE extends CustomElementConstructor<UCEInstance>,
	UCEInstance extends CustomElementInterface
>(
	UserCustomElement: UCE,
	props?: Computed | Record<string, unknown>
): HTMLElement {
	let ce = document.createElement(UserCustomElement.TAG_NAME!);

	if (props) {
		let entries = Object.entries(props);
		for (let [k, v] of entries) {
			if (is_computed(v)) {
				v.watch(
					(p) => {
						ce.setAttribute(k, JSON.stringify(p));
					},
					{ immediate: true }
				);
			} else {
				ce.setAttribute(k, JSON.stringify(v));
			}
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
