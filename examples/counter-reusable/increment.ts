import { GlobalCustomElement, customElement } from "~/custom_element";
import { sleep } from "~/helpers/promise";
import { button, fragment } from "~/html_elements";
import { HTMLExtension } from "~/html_extension";
import { signal } from "~/signal";

@customElement()
export class IncrementCounterButton {
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

	render(): HTMLExtension {
		return fragment(
			button("Incrémenter x", this.step, " (", this.#counter, ")").on(
				"click",
				this.increment_step
			),
			button(
				"Incrémenter ",
				this.step,
				"x10",
				" (",
				this.#counter,
				")"
			).on("click", this.increment_x)
		);
	}

	/**
	 * Events
	 */

	increment_step = async (_: MouseEvent, iteration: number = 1) => {
		let step = this.step.valueOf();

		for (let i = 0; i < iteration; i++) {
			let old_counter = this.#counter.valueOf();
			this.#counter.replace((counter) => counter + step);
			let new_counter = this.#counter.valueOf();
			this.customElement.emit("increment", {
				counter: new_counter - old_counter,
			});
			await sleep(16);
		}
	};

	increment_x = (evt: MouseEvent) => {
		this.increment_step(evt, 10);
	};
}
