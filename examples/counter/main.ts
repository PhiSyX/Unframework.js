//!
//! Exemple de compteur.
//!

import { sleep } from "~/helpers/promise"
import { customElement } from "~/custom_element";
import { BREAK, button, div, p, strong } from "~/html_elements";
import { HTMLExtension } from "~/html_extension";
import { signal } from "~/signal";

@customElement()
export class AppCounter
{
	total = signal(0);

	render(): HTMLExtension<HTMLDivElement>
	{
		return div(
			p("Le compteur total est de ", strong("« ", this.total, " »"), " !"),
			button("Incrémenter x1").on("click", this.increment_once),
			button("Incrémenter x10").on("click", this.increment_x5),
			BREAK,
			button("Décrémenter x1").on("click", this.decrement_once),
			button("Décrémenter x10").on("click", this.decrement_x3),
		);
	}

	decrement_once 	= () => this.total.replace((total) => total - 1);
	decrement_x3 	= async () => {
		for (let i = 0; i < 10; i++) {
			this.total.replace((total) => total - 1);
			await sleep(16);
		}
	};
	increment_once 	= () => this.total.replace((total) => total + 1);
	increment_x5 	= async () => {
		for (let i = 0; i < 10; i++) {
			this.total.replace((total) => total + 1);
			await sleep(16);
		}
	};
}
