import { HTMLExtension } from "~/html_extension";

// -------- //
// Fonction //
// -------- //

export function a(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLAnchorElement> {
	return HTMLExtension.createElement("a", args);
}

export function button(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLButtonElement> {
	return HTMLExtension.createElement("button", args);
}

export function details(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLDetailsElement> {
	return HTMLExtension.createElement("details", args);
}
