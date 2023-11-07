//!
//! Edit Word
//!

import { GlobalCustomElement, customElement } from "~/custom_element";
import {
	div,
	form,
	fragment,
	input,
	span,
	style,
	template_content,
} from "~/html_elements";
import { HTMLExtension } from "~/html_extension";
import { signal } from "~/signal";

@customElement({ mode: "open" })
export class EditWord {
	model = signal("");
	editable = signal(false);
	span_width = signal(40);

	constructor(public customElement: GlobalCustomElement) {}

	mounted() {
		let text = this.customElement.textContent!;
		this.model.replace(text);
	}

	render(): HTMLExtension {
		return div(
			style({
				span: {
					backgroundColor: "#eef",
					padding: "0 2px",
				},
			}),
			form(
				input(this.model, {
					required: true,
				})
					.style({
						width: this.span_width.computed((w) => {
							return `${w}px`;
						}),
					})
					.when(this.editable, true, ($el) => {
						$el.node().focus();
						$el.node().setSelectionRange(
							0,
							this.model.valueOf().length
						);
					})
					.when(this.editable, false, ($el) => {
						this.model.replace($el.value());
					})
					.on("blur", this.update_display)
			).style({
				display: this.editable.computed((editable) => {
					return editable ? "inline-block" : "none";
				}),
			}),
			span(this.model)
				.when(this.editable, false, ($el) => {
					this.span_width.replace($el.node().clientWidth);
				})
				.style({
					display: this.editable.computed((editable) => {
						return editable ? "none" : "inline-block";
					}),
				})
		)
			.style({
				display: "inline-block",
			})
			.on("click", this.focus_input);
	}

	focus_input = () => {
		this.editable.replace(true);
	};

	update_display = () => {
		this.editable.replace(false);
	};
}

@customElement({ mode: "open" })
export class PersonDetails {
	get template(): DocumentFragment {
		const template = document.querySelector("") as HTMLTemplateElement;
		const templateContent = template.content;
		return templateContent;
	}

	render(): any {
		return fragment(
			style({
				div: {
					padding: "10px",
					border: "1px solid gray",
					width: "200px",
					margin: "10px",
				},
				h2: { margin: "0 0 10px" },
				ul: { margin: "0" },
				p: { margin: "10px 0" },
			}),
			template_content("#person-template")
		);
	}
}
