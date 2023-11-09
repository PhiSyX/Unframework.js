// -------- //
// Fonction //
// -------- //

function is_dom_element(value: unknown): value is HTMLElement {
	return value instanceof HTMLElement;
}

function is_dom_input<T extends HTMLElement>(
	element: T
): element is T & { value: string } {
	return ["input", "select"].includes(element.localName.toLowerCase());
}

function is_dom_fragment(value: unknown): value is DocumentFragment {
	return value instanceof DocumentFragment;
}

function is_dom_node(value: unknown): value is Node {
	return value instanceof Node;
}

// ------ //
// Export //
// ------ //

export { is_dom_element, is_dom_input, is_dom_fragment, is_dom_node };
