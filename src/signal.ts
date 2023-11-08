// ---- //
// Type //
// ---- //

type SignalOptions<T> = {
	parser?: (_: unknown) => T;
};

type ComputedWatchFnOptions = {
	immediate?: boolean;
};

type ComputedWatchCallback<R = any, T = any> = (_: T) => R;
type WatchCallback<R = any, T = any> = (oldValue: T, newValue: T) => R;

// -------------- //
// Implémentation //
// -------------- //

class Computed<R = any> {
	constructor(
		public signal: Signal,
		public ret_fn: ComputedWatchCallback<R>
	) {}

	watch(callback: (value: any) => void, options?: ComputedWatchFnOptions) {
		this.signal.watches_callback.push((old_value, new_value) => {
			if (old_value !== new_value) {
				callback(this.ret_fn(new_value));
			}
		});

		if (options?.immediate) {
			callback(this.ret_fn(this.signal.valueOf()));
		}
	}
}

class Signal<T = any> {
	public trigger_elements: Array<HTMLElement | Text> = [];
	public watches_callback: Array<WatchCallback<any, T>> = [];

	private data!: { value: T };
	private options: SignalOptions<T> = {
		parser: (v: unknown) => v as T,
	};

	constructor(value: T, options: SignalOptions<T>) {
		this.data = { value };
		this.options = options;
	}

	computed<R>(fn: (_: T) => R): Computed<R> {
		return new Computed(this, fn);
	}

	replace(new_value: T | ((value: T) => T)) {
		let old_value = this.data.value;
		if (typeof new_value === "function") {
			// @ts-expect-error ?
			this.data.value = new_value(this.valueOf());
		} else {
			this.data.value = this.options.parser?.(new_value) ?? new_value;
		}

		this.trigger_elements.forEach(($trigger) => {
			if ($trigger instanceof Text) {
				$trigger.textContent = this.toString();
			} else {
				// TODO: input type à améliorer
				if (["input", "select"].includes($trigger.localName)) {
					// @ts-expect-error ?
					$trigger.input = this.toString();
				} else {
					$trigger.textContent = this.toString();
				}
			}
		});

		this.watches_callback.forEach((watch_fn) => {
			watch_fn(old_value, this.data.value);
		});
	}

	valueOf(): T {
		return this.options.parser?.(this.data.value) ?? this.data.value;
	}

	toString(): string {
		return (this.valueOf() as { toString(): string }).toString();
	}

	watch<R>(fn: (_: this) => R, options?: ComputedWatchFnOptions) {
		let c = new Computed(this, () => this);
		c.watch(fn, options);
	}
}

// -------- //
// Fonction //
// -------- //

function signal<T extends { toString(): string }>(
	data: T,
	parser?: SignalOptions<T>["parser"]
): Signal<T> {
	return new Signal(data, { parser });
}

function is_signal<S>(value: unknown): value is Signal<S> {
	return value instanceof Signal;
}

function is_computed(value: unknown): value is Computed {
	return value instanceof Computed;
}

// ------ //
// Export //
// ------ //

export { Computed, is_computed, is_signal, Signal, signal };
