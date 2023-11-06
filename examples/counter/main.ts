//!
//! Exemple de compteur.
//!

import { sleep } from "~/helpers/promise";
import { attr, customElement } from "~/custom_element";
import { br, button, div, p, strong } from "~/html_elements";
import { HTMLExtension } from "~/html_extension";
import { signal } from "~/signal";

@customElement()
export class AppCounter
{
	/**
	 * Attributes
	 */
	static dyn_attributes = ["step"];

	step = signal(1, Number);

	@attr({ parser: Number })
	get base(): number
	{
		return 0;
	}

	/**
	 * States
	 */

	total = signal(0);

	/**
	 * Lifecycle
	 */

	mounted()
	{
		this.total.replace(this.base);
	}

	/**
	 * Methods
	 */

	render(): HTMLExtension<HTMLDivElement>
	{
		return div(
			p(
				"Le compteur total est de ",
				strong("« ", this.total, " »"),
				" !"
			),
			button("Incrémenter x", this.step).on("click", this.increment_step),
			button("Incrémenter ", this.step, "x10").on("click", this.increment_x),
			br(),
			button("Décrémenter x", this.step).on("click", this.decrement_step),
			button("Décrémenter ", this.step, "x10").on("click", this.decrement_x)
		);
	}

	/**
	 * Events
	 */

	decrement_step = async (_: MouseEvent, n: number = 1) =>
	{
		let step = this.step.valueOf();
		for (let i = 0; i < n; i++) {
			this.total.replace((total) => total - step);
			await sleep(16);
		}
	};

	decrement_x = async (evt: MouseEvent) =>
	{
		this.decrement_step(evt, 10);
	};

	increment_step = async (_: MouseEvent, n: number = 1) =>
	{
		let step = this.step.valueOf();
		for (let i = 0; i < n; i++) {
			this.total.replace((total) => total + step);
			await sleep(16);
		}
	};

	increment_x = async (evt: MouseEvent) =>
	{
		this.increment_step(evt, 10);
	};
}
