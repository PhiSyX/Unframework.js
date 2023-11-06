import { HTMLExtension } from "~/html_extension";

// -------- //
// Fonction //
// -------- //

export function h1(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLHeadingElement> {
	return HTMLExtension.createElement("h1", args);
}

export function h2(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLHeadingElement> {
	return HTMLExtension.createElement("h2", args);
}

export function h3(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLHeadingElement> {
	return HTMLExtension.createElement("h3", args);
}

export function h4(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLHeadingElement> {
	return HTMLExtension.createElement("h4", args);
}

export function h5(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLHeadingElement> {
	return HTMLExtension.createElement("h5", args);
}

export function h6(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLHeadingElement> {
	return HTMLExtension.createElement("h6", args);
}

export function hgroup(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLElement> {
	return HTMLExtension.createElement("hgroup", args);
}
