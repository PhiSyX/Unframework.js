import { HTMLExtension } from "~/html_extension";

// -------- //
// Fonction //
// -------- //

// TODO: Gérer les types signaux
export function ul<T>(
	list: Array<T>,
	render_item_fn: (item: T, idx: number) => HTMLExtension,
	...args: HTMLExtension.Args
): HTMLExtension {
	let items = list.map(render_item_fn);
	return HTMLExtension.createElement("ul", [...args, ...items]);
}

export function li(...args: HTMLExtension.Args): HTMLExtension<HTMLLIElement> {
	return HTMLExtension.createElement("li", args);
}
