import { is_primitive } from "~/helpers/lang";
import { Signal, is_signal } from "./signal";

// ---- //
// Type //
// ---- //

namespace HTMLExtension
{
	export type Primitive = boolean | number | string;

	export type Attr = Primitive | Signal | HTMLExtension;

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

class HTMLExtension<NativeHTMLElement extends HTMLElement = any>
{
	public static createElement<
		TagName extends keyof HTMLElementTagNameMap,
		NativeHTMLElement extends HTMLElementTagNameMap[TagName],
	>(
		tag_name: TagName,
		args: HTMLExtension.Args
	): HTMLExtension<NativeHTMLElement>
	{
		let $native_html_element = document.createElement(tag_name) as NativeHTMLElement;
		return new HTMLExtension($native_html_element, args);
	}

	/**
	 * Élément DOM natif
	 */
	public $native_element!: NativeHTMLElement;
	public args: HTMLExtension.Args = [];

	constructor($native_html_element: NativeHTMLElement, args: HTMLExtension.Args)
	{
		this.$native_element = $native_html_element;

		for (let arg of args) {
			if (is_signal(arg)) {
				this.handle_signal(arg);
				continue;
			}

			if (is_extension(arg)) {
				this.handle_extension(arg);
				continue;
			}

			if (is_primitive(arg)) {
				this.handle_primitive(arg);
				continue;
			}
		}

		this.args = args;
	}

	handle_extension(arg: HTMLExtension) {
		this.$native_element.append(arg.$native_element);
	}

	handle_primitive(arg: HTMLExtension.Primitive)
	{
		let text = arg.toString();
		if (text.startsWith("&") && text.endsWith(";") && text.length - 2 === 10) {
			let $temp = document.createElement("span");
			$temp.innerHTML = text;
			let first_child = $temp.firstChild!;
			this.$native_element.append(first_child);
		} else {
			this.$native_element.append(text);
		}
	}

	handle_signal(arg: Signal)
	{
		if (is_primitive(arg.value)) {
			arg.trigger_elements.push(
				document.createTextNode(arg.value.toString()),
			);
		}

		this.$native_element.append(
			arg.trigger_elements[arg.trigger_elements.length - 1]
		);
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
}

function is_extension(value: unknown): value is HTMLExtension
{
	return value instanceof HTMLExtension;
}

// ------ //
// Export //
// ------ //

export { HTMLExtension };
