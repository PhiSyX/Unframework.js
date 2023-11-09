import { HTMLExtension } from "~/html_extension";

// -------- //
// Fonction //
// -------- //

// TODO: Gérer les types signaux
export function ol<T>(
	list: Array<T>,
	render_item_fn: (item: T, idx: number) => HTMLExtension,
	...args: HTMLExtension.Args
): HTMLExtension {
	let items = list.map(render_item_fn);
	return HTMLExtension.createElement("ol", [...items, ...args]);
}

// TODO: Gérer les types signaux
export function ul<T>(
	list: Array<T>,
	render_item_fn: (item: T, idx: number) => HTMLExtension,
	...args: HTMLExtension.Args
): HTMLExtension {
	let items = list.map(render_item_fn);
	return HTMLExtension.createElement("ul", [...items, ...args]);
}

export function select(
	list: Array<
		Partial<{
			value: ToString;
			text: ToString;
		}> & {
			[p: string]: ToString;
		}
	>,
	...args: HTMLExtension.Args
): HTMLExtension<HTMLSelectElement> {
	let items = list.map((item) => {
		let text = item.text?.toString() || "";
		delete item.text;
		if (text && item.value) {
			// @ts-expect-error item
			return option(text, item);
		} else if (text.length === 0) {
			// @ts-expect-error item
			return option(text, { ...item, disabled: true });
		} else {
			// @ts-expect-error item
			return option(text, item);
		}
	});
	return HTMLExtension.createElement("select", [...items, ...args]);
}

export function option(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLOptionElement> {
	return HTMLExtension.createElement("option", args);
}

export function li(...args: HTMLExtension.Args): HTMLExtension<HTMLLIElement> {
	return HTMLExtension.createElement("li", args);
}
