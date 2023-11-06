import { HTMLExtension } from "~/html_extension";

// -------- //
// Fonction //
// -------- //

export function abbr(...args: HTMLExtension.Args): HTMLExtension<HTMLElement> {
	return HTMLExtension.createElement("abbr", args);
}

export function br(...args: HTMLExtension.Args): HTMLExtension<HTMLBRElement> {
	return HTMLExtension.createElement("br", args);
}

export function cite(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLSpanElement> {
	return HTMLExtension.createElement("cite", args);
}

export function code(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLSpanElement> {
	return HTMLExtension.createElement("code", args);
}

export function em(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLSpanElement> {
	return HTMLExtension.createElement("em", args);
}

export function kbd(...args: HTMLExtension.Args): HTMLExtension<HTMLElement> {
	return HTMLExtension.createElement("kbd", args);
}

export function p(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLParagraphElement> {
	return HTMLExtension.createElement("p", args);
}

export function ruby(...args: HTMLExtension.Args): HTMLExtension<HTMLElement> {
	return HTMLExtension.createElement("ruby", args);
}

export function q(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLQuoteElement> {
	return HTMLExtension.createElement("q", args);
}

export function slot(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLSlotElement> {
	return HTMLExtension.createElement("slot", args);
}

export function span(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLSpanElement> {
	return HTMLExtension.createElement("span", args);
}

export function strong(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLSpanElement> {
	return HTMLExtension.createElement("strong", args);
}

export function time(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLTimeElement> {
	return HTMLExtension.createElement("time", args);
}
