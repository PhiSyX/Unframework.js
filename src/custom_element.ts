import type {
	CustomElementConstructor,
	CustomElementInterface,
} from "./custom_element/interface";
import { type Computed, type Signal, is_computed, is_signal } from "./signal";

// -------- //
// Fonction //
// -------- //

function use<
	UCE extends CustomElementConstructor<UCEInstance>,
	UCEInstance extends CustomElementInterface
>(
	UserCustomElement: UCE,
	props?: Computed | Signal | Record<string, { valueOf(): unknown }>
): HTMLElement {
	let ce = document.createElement(UserCustomElement.TAG_NAME!);

	if (props) {
		let entries = Object.entries(props);

		let set_attribute = (k: string, v: { valueOf(): unknown }) => {
			ce.setAttribute(k, JSON.stringify(v.valueOf()));
		};
		let watch_options = { immediate: true };

		for (let [k, v] of entries) {
			if (is_signal(v) || is_computed(v)) {
				v.watch((p) => set_attribute(k, p), watch_options);
			} else {
				set_attribute(k, v);
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
