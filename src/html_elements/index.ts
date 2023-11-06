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

export * from "./embedded";
export * from "./flow";
export * from "./form";
export * from "./heading";
export * from "./interactive";
export * from "./phrasing";
export { fragment };
