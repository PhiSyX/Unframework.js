import { HTMLExtension } from "~/html_extension";

// -------- //
// Fonction //
// -------- //

function fragment(...extensions: Array<HTMLExtension>): HTMLExtension {
	return HTMLExtension.createFragment(extensions);
}

// ------ //
// Export //
// ------ //

export * from "./flow";
export * from "./interactive";
export * from "./phrasing";
export { fragment };
