// -------- //
// Fonction //
// -------- //

function is_object<O extends unknown>(value: unknown): value is object & O {
	return typeof value === "object";
}

// ------ //
// Export //
// ------ //

export { is_object };
