// -------------- //
// Implémentation //
// -------------- //

class Signal<T extends { toString(): string } = any>
{
	public trigger_elements: Array<HTMLElement | Text> = [];

	private data!: { value: T };

	constructor(value: T)
	{
		this.data = { value };
	}

	get value(): T
	{
		return this.data.value;
	}

	replace(new_value: (value: T) => T | T)
	{
		if (typeof new_value === "function") {
			this.data.value = new_value(this.data.value);
		} else {
			this.data.value = new_value;
		}

		this.trigger_elements.forEach(($el) => {
			$el.textContent = this.data.value.toString();
		});
	}

	toString(): string
	{
		return this.data.value.toString();
	}
}

// -------- //
// Fonction //
// -------- //

function signal<T extends { toString(): string }>(data: T): Signal<T> {
	return new Signal(data);
}

function is_signal(value: unknown): value is Signal
{
	return value instanceof Signal;
}

// ------ //
// Export //
// ------ //

export { is_signal, Signal, signal };
