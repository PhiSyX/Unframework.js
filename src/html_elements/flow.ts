import { HTMLExtension } from "~/html_extension";

// -------- //
// Fonction //
// -------- //

function div(...args: HTMLExtension.Args): HTMLExtension<HTMLDivElement> {
	return HTMLExtension.createElement("div", args);
}

// ------ //
// Export //
// ------ //

export { div };
