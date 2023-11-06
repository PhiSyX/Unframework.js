import { HTMLExtension } from "~/html_extension";

// -------- //
// Fonction //
// -------- //

function button(...args: HTMLExtension.Args): HTMLExtension<HTMLButtonElement> {
	return HTMLExtension.createElement("button", args);
}

// ------ //
// Export //
// ------ //

export { button };
