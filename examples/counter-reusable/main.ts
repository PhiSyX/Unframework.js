//!
//! Exemple de compteur.
//!

import { IncrementCounterButton } from "./increment";
import { DecrementCounterButton } from "./decrement";

import { attr, customElement, use } from "~/custom_element";
import { br, div, p, strong } from "~/html_elements";
import { HTMLExtension } from "~/html_extension";
import { signal } from "~/signal";

@customElement()
export class AppCounter {
	/**
	 * Events authorized
	 */
	static events = ["increment", "decrement"];

	/**
	 * Attributes
	 */
	static dynamic_attributes = ["step"];

	step = signal(1, { parser: Number });

	@attr({ parser: Number })
	get base(): number {
		return 0;
	}

	/**
	 * States
	 */

	total = signal(0);

	/**
	 * Lifecycle
	 */

	mounted() {
		this.total.replace(this.base);
	}

	/**
	 * Methods
	 */

	render(): HTMLExtension<HTMLDivElement> {
		return div(
			p(
				"Le compteur total est de ",
				strong("« ", this.total, " »"),
				" !"
			),
			use(IncrementCounterButton, {
				step: this.step.valueOf(),
			}),
			br(),
			use(DecrementCounterButton, {
				step: this.step.valueOf(),
			})
		)
			.id("my-best-counter")
			.css({
				".counter-15": {
					backgroundColor: "black",
				},
			})
			.classes({
				"counter-15": this.total.computed((total) => {
					return total >= 15 && total <= 20;
				}),
			})
			.style({
				color: this.total.computed((total) => {
					return total >= 15 && total <= 20 ? "red" : "black";
				}),
			});
	}

	/**
	 * Events
	 */

	handleDecrementEvent = (evt: CustomEvent<{ counter: number }>) => {
		this.total.replace((total) => total - evt.detail.counter);
	};

	handleIncrementEvent = (evt: CustomEvent<{ counter: number }>) => {
		this.total.replace((total) => total + evt.detail.counter);
	};
}
