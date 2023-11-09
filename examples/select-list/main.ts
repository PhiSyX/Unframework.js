//!
//! Select list
//!

import {
	GlobalCustomElement,
	attr,
	customElement,
	use,
} from "~/custom_element";
import { select } from "~/html_elements";
import { HTMLExtension } from "~/html_extension";
import { signal } from "~/signal";

@customElement({ mode: "open" })
export class SelectList {
	items = [] as Array<Partial<{ value: number; text: string }>>;
	model = signal("");

	constructor(public customElement: GlobalCustomElement) {}

	mounted() {
		Array.from(this.customElement.attributes)
			.filter((attr) => attr.name.includes("list-item"))
			.forEach((attr, idx) => {
				if (idx && idx % 4 === 0) {
					this.items.push({});
				}
				this.items.push({
					text: attr.value,
					value: idx,
				});
			});
	}

	render(): HTMLExtension<HTMLSelectElement> {
		return select(this.items).on("change", (evt) => {
			console.log(evt.target.value);
		});
	}
}
