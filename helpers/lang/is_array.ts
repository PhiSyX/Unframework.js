// -------- //
// Fonction //
// -------- //

function is_array<K extends unknown>(value: unknown): value is Array<K> {
	return Array.isArray(value);
}

// ------ //
// Export //
// ------ //

export { is_array };
