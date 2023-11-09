import { HTMLExtension } from "~/html_extension";

// -------- //
// Fonction //
// -------- //

export function fieldset(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLFieldSetElement> {
	return HTMLExtension.createElement("fieldset", args);
}

export function label(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLLabelElement> {
	return HTMLExtension.createElement("label", args);
}

export function form(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLFormElement> {
	return HTMLExtension.createElement("form", args);
}

export function input(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLInputElement> {
	return HTMLExtension.createElement("input", args);
}

export function output(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLOutputElement> {
	return HTMLExtension.createElement("output", args);
}

export function progress(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLProgressElement> {
	return HTMLExtension.createElement("progress", args);
}

export function textarea(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLTextAreaElement> {
	return HTMLExtension.createElement("textarea", args);
}
