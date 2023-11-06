// ---- //
// Type //
// ---- //

type SignalOptions<T> = {
	parser?: (_: unknown) => T;
};

// -------------- //
// Implémentation //
// -------------- //

class Signal<T extends { toString(): string } = any>
{
	public trigger_elements: Array<HTMLElement | Text> = [];

	private data!: { value: T };
	private options: SignalOptions<T> = {
		parser: (v: unknown) => v as T,
	};

	constructor(value: T, options: SignalOptions<T>)
	{
		this.data = { value };
		this.options = options;
	}

	get value(): T
	{
		return this.valueOf();
	}

	replace(new_value: T | ((value: T) => T))
	{
		if (typeof new_value === "function") {
			this.data.value = new_value(this.valueOf());
		} else {
			this.data.value = this.options.parser?.(new_value) ?? new_value;
		}

		this.trigger_elements.forEach(($el) => {
			$el.textContent = this.toString();
		});
	}

	valueOf(): T
	{
		return this.options.parser?.(this.data.value) ?? this.data.value;
	}

	toString(): string
	{
		return this.valueOf().toString();
	}
}

// -------- //
// Fonction //
// -------- //

function signal<T extends { toString(): string }>(
	data: T,
	parser?: SignalOptions<T>["parser"],
): Signal<T> {
	return new Signal(data, { parser });
}

function is_signal(value: unknown): value is Signal
{
	return value instanceof Signal;
}

// ------ //
// Export //
// ------ //

export { is_signal, Signal, signal };
