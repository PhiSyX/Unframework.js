// ---- //
// Type //
// ---- //

type AttachShadowMode = "open" | "closed";

// -------------- //
// Implémentation //
// -------------- //

class GlobalCustomElement extends HTMLElement
{
	public root!: ShadowRoot;

	constructor(mode: AttachShadowMode)
	{
		super();

		this.root = this.attachShadow({ mode });
	}
}

// ------ //
// Export //
// ------ //

export type { AttachShadowMode };
export { GlobalCustomElement };
