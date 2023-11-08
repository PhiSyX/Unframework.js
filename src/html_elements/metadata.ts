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

export function template_content(id: `#${string}`): Node {
	let element = document.getElementById(
		id.slice(1)
	) as HTMLTemplateElement | null;
	if (!element) {
		throw new Error(`L'élément avec l'ID « ${id} » n'existe pas.`);
	}
	return element.content.cloneNode(true);
}
