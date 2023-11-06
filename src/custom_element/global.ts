// ---- //
// Type //
// ---- //

type AttachShadowMode = "open" | "closed";

// -------------- //
// Implémentation //
// -------------- //

class GlobalCustomElement extends HTMLElement {
	public root!: ShadowRoot;

	constructor(mode: AttachShadowMode) {
		super();

		this.root = this.attachShadow({ mode });
	}

	public emit(key: string, value: unknown) {
		let new_event = new CustomEvent(key, { detail: value });
		this.dispatchEvent(new_event);
	}
}

// ------ //
// Export //
// ------ //

export type { AttachShadowMode };
export { GlobalCustomElement };
