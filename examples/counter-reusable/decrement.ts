import { GlobalCustomElement, customElement } from "~/custom_element";
import { sleep } from "~/helpers/promise";
import { button, fragment } from "~/html_elements";
import { HTMLExtension } from "~/html_extension";
import { signal } from "~/signal";

@customElement()
export class DecrementCounterButton
{
	/**
	 * Attributes
	 */
	static dyn_attributes = ["step"];

	step = signal(1, Number);

	constructor(public customElement: GlobalCustomElement) {}

	#counter = signal(0);

	/**
	 * Methods
	 */

	render(): HTMLExtension
	{
		return fragment(
			button("Décrémenter x", this.step, " (", this.#counter, ")")
				.on("click", this.decrement_step),
			button("Décrémenter ", this.step, "x10", " (", this.#counter, ")")
				.on("click", this.decrement_x),
		);
	}

	/**
	 * Events
	 */

	decrement_step = async (_: MouseEvent, iteration: number = 1) =>
	{
		let step = this.step.valueOf();

		for (let i = 0; i < iteration; i++) {
		let old_counter = this.#counter.valueOf();

		this.#counter.replace((counter) => counter + step);
			let new_counter = this.#counter.valueOf();

			this.customElement.emit(
				"decrement",
				{
					counter: new_counter - old_counter,
				}
			);

			await sleep(16);
		}
	};

	decrement_x = async (evt: MouseEvent) =>
	{
		this.decrement_step(evt, 10);
	};
}
