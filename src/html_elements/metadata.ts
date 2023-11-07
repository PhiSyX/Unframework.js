import { HTMLExtension } from "~/html_extension";

// -------- //
// Fonction //
// -------- //

export function link(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLLinkElement> {
	return HTMLExtension.createElement("link", args);
}

export function meta(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLMetaElement> {
	return HTMLExtension.createElement("meta", args);
}

export function script(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLScriptElement> {
	return HTMLExtension.createElement("script", args);
}

export function style(
	arg: HTMLExtension.CSSOM
): HTMLExtension<HTMLStyleElement> {
	// @ts-expect-error ?
	return HTMLExtension.createElement("style", [{ css: arg }]);
}

export function template(
	...args: Array<HTMLExtension | DocumentFragment>
): HTMLExtension<HTMLTemplateElement> {
	return HTMLExtension.createElement("template", args);
}

export function template_content(id: string): DocumentFragment {
	let element = document.querySelector(id) as HTMLTemplateElement;
	return element.content;
}
