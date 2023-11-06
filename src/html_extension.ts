import clsx from "clsx";
import { is_object, is_primitive } from "~/helpers/lang";
import { Computed, Signal, is_signal } from "./signal";
import { kebabize } from "~/helpers/string";

// ---- //
// Type //
// ---- //

namespace HTMLExtension {
	export type Primitive = boolean | number | string;

	export type CSSOM = Partial<{
		[K in keyof HTMLElementTagNameMap]: HTMLStyle;
	}> & {
		[p: string]: HTMLStyle;
	};

	type HTMLClassDictionary = {
		[p: string]: Computed<boolean> | boolean;
	};
	type HTMLClassArray = Array<HTMLClass>;
	export type HTMLClass = HTMLClassDictionary | string | HTMLClassArray;

	export type HTMLStyle = Partial<{
		[P in keyof CSSStyleDeclaration]:
			| CSSStyleDeclaration[P]
			| Computed<string>;
	}> & {
		[p: `--${string}`]: string;
	};

	export type HTMLObject = Partial<{
		class: HTMLClass;
		css: CSSOM;
		style: HTMLStyle;
	}>;

	export type Attr =
		| HTMLExtension
		| HTMLElement
		| HTMLObject
		| Primitive
		| Signal;

	export type Args = Array<Attr>;

	// EXAMPLE: T as "click" => `(evt: MouseEvent): void`
	// EXAMPLE: T as "custom" => `(evt: CustomEvent): void`
	export type ChooseGoodEvent<K> = K extends keyof HTMLElementEventMap
		? (evt: HTMLElementEventMap[K]) => void
		: (evt: CustomEvent) => void;
}

// -------------- //
// Implémentation //
// -------------- //

class HTMLExtension<NativeHTMLElement extends HTMLElement = any> {
	public static createElement<
		TagName extends keyof HTMLElementTagNameMap,
		NativeHTMLElement extends HTMLElementTagNameMap[TagName]
	>(
		tag_name: TagName,
		args: HTMLExtension.Args
	): HTMLExtension<NativeHTMLElement> {
		let $native_html_element = document.createElement(
			tag_name
		) as NativeHTMLElement;
		return new HTMLExtension($native_html_element, args);
	}

	public static createFragment(
		extensions: Array<HTMLExtension>
	): HTMLExtension {
		let $native_fragment =
			document.createDocumentFragment() as unknown as HTMLElement;
		extensions.forEach((extension) => {
			$native_fragment.append(extension.$native_element);
		});
		return new HTMLExtension($native_fragment, []);
	}

	/**
	 * Élément DOM natif
	 */
	public $native_element!: NativeHTMLElement;
	public args: HTMLExtension.Args = [];
	// Children (CE = Custom Element).
	children_CE: Array<HTMLElement> = [];
	events: Array<string> = [];

	constructor($native_element: NativeHTMLElement, args: HTMLExtension.Args) {
		this.$native_element = $native_element;

		for (let arg of args) {
			if (is_signal(arg)) {
				this.handle_signal(arg);
				continue;
			}

			if (is_extension(arg)) {
				this.handle_extension(arg);
				continue;
			}

			if (arg instanceof HTMLElement) {
				this.handle_element(arg);
				continue;
			}

			if (is_object<HTMLExtension.HTMLObject>(arg)) {
				this.handle_object(arg);
				continue;
			}

			if (is_primitive(arg)) {
				this.handle_primitive(arg);
				continue;
			}
		}

		this.args = args;
	}

	handle_element(arg: HTMLElement) {
		this.children_CE.push(arg);
		this.$native_element.append(arg);
	}

	handle_extension(arg: HTMLExtension) {
		this.$native_element.append(arg.$native_element);
	}

	handle_object(arg: HTMLExtension.HTMLObject) {
		let entries = Object.entries(arg);

		for (let entry of entries) {
			switch (entry[0]) {
				case "class":
					{
						this.handle_object_class(entry[1]);
					}
					break;

				case "css":
					{
						this.handle_object_css(entry[1]);
					}
					break;

				case "style":
					{
						this.handle_object_style(entry[1]);
					}
					break;

				default:
					{
						this.$native_element.setAttribute(entry[0], entry[1]);
					}
					break;
			}
		}
	}

	handle_object_class(classNames: HTMLExtension.HTMLClass) {
		if (Array.isArray(classNames)) {
			classNames.forEach((c) => this.handle_object_class(c));
		} else if (typeof classNames === "object") {
			for (let cls of Object.entries(classNames)) {
				if (cls[1] instanceof Computed) {
					let computed = cls[1];
					computed.watch(
						(value) => {
							let outputClsx = clsx({ [cls[0]]: value });
							if (outputClsx.length > 0) {
								this.$native_element.classList.add(outputClsx);
							} else {
								this.$native_element.classList.remove(cls[0]);
							}
						},
						{ immediate: true }
					);
				} else {
					let outputClsx = clsx({ [cls[0]]: cls[1] });
					if (outputClsx.length > 0) {
						this.$native_element.classList.add(outputClsx);
					}
				}
			}
		} else {
			let outputClsx = clsx(classNames);
			if (outputClsx.length > 0) {
				this.$native_element.classList.add(outputClsx);
			}
		}
	}

	handle_object_css(cssom: HTMLExtension.CSSOM) {
		let element = document.createElement("style");
		for (let rulesets of Object.entries(cssom)) {
			let [group_selectors, declaration_block] = rulesets;

			element.textContent += `${group_selectors}{`;

			for (let [property, value] of Object.entries(declaration_block)) {
				element.textContent += `${kebabize(
					property.toString()
				)}:${value};`;
			}

			element.textContent += `}`;
		}

		this.$native_element.append(element);
	}

	handle_object_style(style_obj: HTMLExtension.HTMLStyle) {
		for (let [property, value] of Object.entries(style_obj)) {
			if (value instanceof Computed) {
				value.watch((data) => {
					this.$native_element.style.setProperty(
						property.toString(),
						data.toString()
					);
				});
			} else {
				this.$native_element.style.setProperty(
					property.toString(),
					value!.toString()
				);
			}
		}
	}

	handle_primitive(arg: HTMLExtension.Primitive) {
		let text = arg.toString();
		if (
			text.startsWith("&") &&
			text.endsWith(";") &&
			text.length - 2 === 10
		) {
			let $temp = document.createElement("span");
			$temp.innerHTML = text;
			let first_child = $temp.firstChild!;
			this.$native_element.append(first_child);
		} else {
			this.$native_element.append(text);
		}
	}

	handle_signal(arg: Signal) {
		if (is_primitive(arg.value)) {
			arg.trigger_elements.push(
				document.createTextNode(arg.value.toString())
			);
		}

		this.$native_element.append(
			arg.trigger_elements[arg.trigger_elements.length - 1]
		);
	}

	define_events_for_custom_elements(events: Array<string>) {
		this.events = events;

		this.events.forEach((evt_name) => {
			this.children_CE.forEach((children) => {
				// @ts-expect-error CustomEvent.
				children.addEventListener(evt_name, (evt: CustomEvent) => {
					this.$native_element.dispatchEvent(
						new CustomEvent(evt_name, { detail: evt.detail })
					);
				});
			});
		});
	}

	/* Fluent */

	classes(classNames: HTMLExtension.HTMLClass): this {
		this.handle_object_class(classNames);
		return this;
	}

	css(cssom: HTMLExtension.CSSOM): this {
		this.handle_object_css(cssom);
		return this;
	}

	id(id: NativeHTMLElement["id"]): this {
		this.$native_element.id = id;
		return this;
	}

	off<K extends keyof HTMLElementEventMap>(
		type: K,
		listener: HTMLExtension.ChooseGoodEvent<K>,
		options?: boolean | AddEventListenerOptions
	): this;
	off<K>(
		type: K,
		listener: HTMLExtension.ChooseGoodEvent<K>,
		options?: boolean | AddEventListenerOptions
	): this;
	off(
		type: any,
		listener: HTMLExtension.ChooseGoodEvent<any>,
		options?: boolean | AddEventListenerOptions
	): this {
		this.$native_element.removeEventListener(type, listener, options);
		return this;
	}

	on<K extends keyof HTMLElementEventMap>(
		type: K,
		listener: HTMLExtension.ChooseGoodEvent<K>,
		options?: boolean | AddEventListenerOptions
	): this;
	on<K>(
		type: K,
		listener: HTMLExtension.ChooseGoodEvent<K>,
		options?: boolean | AddEventListenerOptions
	): this;
	on(
		type: any,
		listener: HTMLExtension.ChooseGoodEvent<any>,
		options?: boolean | AddEventListenerOptions
	): this {
		this.$native_element.addEventListener(type, listener, options);
		return this;
	}

	style(style_obj: HTMLExtension.HTMLStyle): this {
		this.handle_object_style(style_obj);
		return this;
	}
}

function is_extension(value: unknown): value is HTMLExtension {
	return value instanceof HTMLExtension;
}

// ------ //
// Export //
// ------ //

export { HTMLExtension };
