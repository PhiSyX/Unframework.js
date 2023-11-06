import { HTMLExtension } from "~/html_extension";

// -------- //
// Fonction //
// -------- //

export function article(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLElement> {
	return HTMLExtension.createElement("article", args);
}

export function aside(...args: HTMLExtension.Args): HTMLExtension<HTMLElement> {
	return HTMLExtension.createElement("aside", args);
}

export function dialog(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLDialogElement> {
	return HTMLExtension.createElement("dialog", args);
}

export function div(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLDivElement> {
	return HTMLExtension.createElement("div", args);
}

export function figure(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLElement> {
	return HTMLExtension.createElement("figure", args);
}

export function footer(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLElement> {
	return HTMLExtension.createElement("footer", args);
}

export function header(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLElement> {
	return HTMLExtension.createElement("header", args);
}

export function hr(...args: HTMLExtension.Args): HTMLExtension<HTMLHRElement> {
	return HTMLExtension.createElement("hr", args);
}

export function main(...args: HTMLExtension.Args): HTMLExtension<HTMLElement> {
	return HTMLExtension.createElement("main", args);
}

export function menu(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLMenuElement> {
	return HTMLExtension.createElement("menu", args);
}

export function nav(...args: HTMLExtension.Args): HTMLExtension<HTMLElement> {
	return HTMLExtension.createElement("nav", args);
}

export function pre(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLPreElement> {
	return HTMLExtension.createElement("pre", args);
}

export function search(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLElement> {
	return HTMLExtension.createElement("search", args);
}
