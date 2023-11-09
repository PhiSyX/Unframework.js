import clsx from "clsx";
import {
	is_array,
	is_boolean,
	is_dom_element,
	is_dom_fragment,
	is_dom_input,
	is_dom_node,
	is_object,
	is_primitive,
} from "~/helpers/lang";
import { kebabize, simple_uuid } from "~/helpers/string";
import { Computed, Signal, is_computed, is_signal } from "./signal";

// ---- //
// Type //
// ---- //

namespace HTMLExtension {
	export type Primitive = bigint | boolean | number | string;

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
		key: string;
		class: HTMLClass;
		css: CSSOM;
		style: HTMLStyle;
	}> & {
		[p: string]: string | boolean;
	};

	export type NodeExtension = Node & { extension?: HTMLExtension };

	export type Attr =
		| HTMLExtension
		| HTMLElement
		| HTMLObject
		| DocumentFragment
		| NodeExtension
		| Primitive
		| Signal;

	export type Args = Array<Attr>;

	// EXAMPLE: T as "click" => `(evt: MouseEvent): void`
	// EXAMPLE: T as "custom" => `(evt: CustomEvent): void`
	export type ChooseGoodEvent<K> = K extends keyof HTMLElementEventMap
		? (this: HTMLExtension, evt: HTMLElementEventMap[K]) => void
		: (this: HTMLExtension, evt: CustomEvent) => void;
}

// -------------- //
// Implémentation //
// -------------- //

class HTMLExtension<
	NativeHTMLElement extends HTMLElement & {
		extension?: HTMLExtension;
	} = any
> {
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
		children: Array<HTMLExtension | DocumentFragment | Node>
	): HTMLExtension {
		let $native_fragment =
			document.createDocumentFragment() as unknown as HTMLElement;
		for (let child of children) {
			if (is_dom_fragment(child)) {
				$native_fragment.append(child);
			} else if (is_dom_node(child)) {
				$native_fragment.append(child);
			} else {
				$native_fragment.append(child.node());
			}
		}
		return new HTMLExtension($native_fragment, []);
	}

	/**
	 * Élément DOM natif
	 */
	#native_element!: NativeHTMLElement;
	#args: HTMLExtension.Args = [];
	#children_EX: Array<HTMLExtension> = [];
	#children_CE: Array<HTMLElement> = [];

	parent?: HTMLExtension;
	events: Array<string> = [];
	key!: string;

	constructor($native_element: NativeHTMLElement, args: HTMLExtension.Args) {
		this.#native_element = $native_element;
		this.#args = args;
		this.key = simple_uuid();

		let observer = new MutationObserver(this.observer);

		observer.observe(this.#native_element, {
			childList: true,
		});

		this.handle();
		this.#native_element.extension = this;
	}

	observer = (records: Array<MutationRecord>) => {
		let added_nodes = (node: HTMLExtension.NodeExtension) => {
			let extension = node.extension;

			this.#native_element.dispatchEvent(
				new CustomEvent("added:children", {
					detail: extension || node,
				})
			);

			if (extension == null) {
				return;
			}

			extension.parent = this;
			// this.children_EX.push(extension);
		};

		let removed_nodes = (node: HTMLExtension.NodeExtension) => {
			let extension = node.extension;

			this.#native_element.dispatchEvent(
				new CustomEvent("deleted:children", {
					detail: extension || node,
				})
			);

			if (extension == null) {
				return;
			}

			// this.children_CE = this.children_CE.filter((e) => {
			// 	return e.key != extension!.key;
			// });
			// this.children_EX = this.children_EX.filter((e) => {
			// 	return e.key != extension!.key;
			// });
		};

		for (let record of records) {
			record.addedNodes.forEach(added_nodes);
			record.removedNodes.forEach(removed_nodes);
		}
	};

	handle() {
		for (let arg of this.#args) {
			if (is_signal(arg)) {
				this.handle_signal(arg);
				continue;
			}

			if (is_extension(arg)) {
				this.handle_extension(arg);
				continue;
			}

			if (is_dom_element(arg)) {
				this.handle_custom_element(arg);
				continue;
			}

			if (is_dom_node(arg)) {
				this.handle_node(arg);
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
	}

	handle_custom_element(arg: HTMLElement) {
		this.#children_CE.push(arg);
		this.#native_element.append(arg);
	}

	handle_node(arg: Node) {
		this.#native_element.append(arg);
	}

	handle_extension(arg: HTMLExtension) {
		this.#children_EX.push(this);
		this.#native_element.append(arg.#native_element);
	}

	handle_object(arg: HTMLExtension.HTMLObject) {
		let entries = Object.entries(arg);

		for (let [k, p] of entries) {
			switch (k) {
				case "key":
					{
						this.key = p.toString();
					}
					break;
				case "class":
					{
						// @ts-expect-error -- TS pète les plombs.
						this.handle_object_class(p);
					}
					break;

				case "css":
					{
						// @ts-expect-error -- TS pète les plombs.
						this.handle_object_css(p);
					}
					break;

				case "style":
					{
						// @ts-expect-error -- TS pète les plombs.
						this.handle_object_style(p);
					}
					break;

				default:
					{
						if (is_boolean(p)) {
							if (p === true) {
								this.#native_element.setAttribute(k, k);
							} else {
								this.#native_element.removeAttribute(k);
							}
						} else {
							this.#native_element.setAttribute(k, p);
						}
					}
					break;
			}
		}
	}

	handle_object_class(classNames: HTMLExtension.HTMLClass) {
		if (is_array(classNames)) {
			for (let cls of classNames) this.handle_object_class(cls);
			return;
		}

		if (is_object(classNames)) {
			for (let [key, value] of Object.entries(classNames)) {
				if (is_computed(value)) {
					let toggle_class = (b: boolean) => {
						let output_cls = clsx({ [key]: b });
						if (output_cls.length > 0) {
							this.#native_element.classList.add(output_cls);
						} else {
							this.#native_element.classList.remove(key);
						}
					};
					value.watch(toggle_class, { immediate: true });
					return;
				}

				let output_cls = clsx({ [key]: value });
				if (output_cls.length > 0) {
					this.#native_element.classList.add(output_cls);
				}
			}

			return;
		}

		let output_cls = clsx(classNames);
		if (output_cls.length > 0) {
			this.#native_element.classList.add(output_cls);
		}
	}

	handle_object_css(cssom: HTMLExtension.CSSOM) {
		let element = document.createElement("style");
		if (this.#native_element.localName === element.localName) {
			element = this.#native_element as unknown as HTMLStyleElement;
		}

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

		if (this.#native_element.localName !== element.localName) {
			this.#native_element.append(element);
		}
	}

	handle_object_style(style_obj: HTMLExtension.HTMLStyle) {
		for (let [property, value] of Object.entries(style_obj)) {
			let property_k = kebabize(property.toString());
			if (is_computed(value)) {
				let set_property_fn = (data: ToString) => {
					this.#native_element.style.setProperty(
						property_k,
						data.toString()
					);
				};
				value.watch(set_property_fn, { immediate: true });
			} else {
				this.#native_element.style.setProperty(
					property_k,
					value!.toString()
				);
			}
		}
	}

	handle_primitive(arg: HTMLExtension.Primitive) {
		let text = arg.toString();

		if (is_dom_input(this.#native_element)) {
			this.#native_element.value += text;
			return;
		}

		if (
			text.startsWith("&") &&
			text.endsWith(";") &&
			text.length - 2 <= 10
		) {
			let $temp = document.createElement("span");
			$temp.innerHTML = text;
			let first_child = $temp.firstChild!;
			this.#native_element.append(first_child);
		} else {
			this.#native_element.append(text);
		}
	}

	handle_signal(arg: Signal) {
		if (is_dom_input(this.#native_element)) {
			this.#native_element.value = arg.toString();
			return;
		}

		let value = arg.valueOf();

		if (is_primitive(value)) {
			arg.trigger_elements.push(
				document.createTextNode(value.toString())
			);
		}

		this.#native_element.append(
			arg.trigger_elements[arg.trigger_elements.length - 1]
		);
	}

	define_events_for_custom_elements(events: Array<string>) {
		this.events = events;

		this.events.forEach((evt_name) => {
			this.#children_CE.forEach((children) => {
				// @ts-expect-error CustomEvent.
				children.addEventListener(evt_name, (evt: CustomEvent) => {
					this.#native_element.dispatchEvent(
						new CustomEvent(evt_name, { detail: evt.detail })
					);
				});
			});
		});
	}

	append(w: HTMLExtension) {
		this.#native_element.append(w.node());
	}

	node(): NativeHTMLElement {
		return this.#native_element;
	}

	remove() {
		this.#native_element.remove();
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

	autofocus(): this {
		setTimeout(() => {
			this.#native_element.focus();
		});
		return this;
	}

	id(id: NativeHTMLElement["id"]): this {
		this.#native_element.id = id;
		return this;
	}

	model<M extends HTMLExtension.Primitive>(model: Signal<M>): this {
		model.watch((m) => this.handle_signal(m), { immediate: true });

		this.on("input", (evt) => {
			// @ts-expect-error On sait que l'événement input n'est déclenché
			// que sur les éléments de formulaire, et qu'ils ont la propriété
			// dans leur objet.
			model.replace(evt.target.value);
		});

		return this;
	}

	/**
	 * À n'utiliser que sur les éléments d'objets dont la propriété .value
	 * existe.
	 */
	input(): string | null {
		// @ts-expect-error On sait que l'événement input n'est déclenché
		// que sur les éléments de formulaire, et qu'ils ont la propriété
		// dans leur objet.
		return this.#native_element.value;
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
		this.#native_element.removeEventListener(
			type,
			listener.bind(this),
			options
		);
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
		this.#native_element.addEventListener(
			type,
			listener.bind(this),
			options
		);
		return this;
	}

	style(style_obj: HTMLExtension.HTMLStyle): this {
		this.handle_object_style(style_obj);
		return this;
	}

	text(s: HTMLExtension.Primitive): this {
		this.handle_primitive(s);
		return this;
	}

	when(
		sig: Signal,
		b: unknown,
		cb: (
			this: HTMLExtension<NativeHTMLElement>,
			el: HTMLExtension<NativeHTMLElement>
		) => void
	): this {
		sig.watches_callback.push((_, new_value) => {
			setTimeout(() => {
				if (new_value === b) {
					cb.call(this, this);
				}
			}, 16);
		});
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
