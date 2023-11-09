//!
//! Editable list
//!

import {
	GlobalCustomElement,
	attr,
	customElement,
	use,
} from "~/custom_element";
import { button, div, h3, input, label, li, style, ul } from "~/html_elements";
import { HTMLExtension } from "~/html_extension";
import { signal } from "~/signal";

@customElement({ mode: "open", tagName: "editable-ul-list" })
export class EditableUList {
	static dynamic_attributes = ["items"];

	items: Array<string> = [];

	constructor(public customElement: GlobalCustomElement) {}

	render(): HTMLExtension<HTMLDivElement> {
		return div(
			ul(this.items, (item) => {
				return li(
					item,
					button("&ominus;")
						.classes("icon")
						.on("click", () => this.update_item(item))
				);
			})
		).css({
			li: {
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
			},

			".icon": {
				backgroundColor: "#fff",
				border: "none",
				cursor: "pointer",
				float: "right",
				fontSize: "1.8rem",
			},
		});
	}

	update_item = (item: string) => {
		this.customElement.emit("update-list", {
			items: this.items.filter((it) => {
				return it != item;
			}),
		});
	};
}

@customElement({ mode: "open" })
export class EditableList {
	static events = ["update-list"];

	items = signal([] as Array<string>);
	model = signal("");

	constructor(public customElement: GlobalCustomElement) {}

	@attr()
	get title(): string {
		return "Default title";
	}

	@attr()
	get add_item_text(): string {
		return "Add item";
	}

	mounted() {
		Array.from(this.customElement.attributes)
			.filter((attr) => attr.name.includes("list-item"))
			.forEach((attr) => {
				this.items.replace((attrs) => [...attrs, attr.value]);
			});
	}

	render(): HTMLExtension<HTMLDivElement> {
		return div(
			h3(this.title),
			use(EditableUList, { items: this.items }),
			div(
				style({
					".icon": {
						border: "none",
						borderRadius: "8px",
						cursor: "pointer",
						float: "right",
						fontSize: "1.8rem",
					},
				}),
				label(this.add_item_text),
				input({ type: "text" })
					.style({
						flexGrow: "1",
					})
					.model(this.model)
					.on("keydown", (evt) => {
						if (evt.key == "Enter") {
							this.add_list_item(evt);
						}
					})
					.autofocus(),
				button("&oplus;")
					.classes("icon")
					.on("click", this.add_list_item)
			)
		)
			.css({
				"div > div": {
					display: "flex",
					alignItems: "center",
					gap: "10px",
				},
			})
			.classes("editable-list");
	}

	handleUpdateListEvent = (evt: CustomEvent<{ items: Array<string> }>) => {
		this.items.replace(evt.detail.items);
	};

	add_list_item = (_: MouseEvent | KeyboardEvent) => {
		let model = this.model.valueOf().trim();
		if (model.length === 0) {
			return;
		}
		this.items.replace((items) => [...items, model]);
		this.model.replace("");
	};
}
