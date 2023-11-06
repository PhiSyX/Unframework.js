// -------- //
// Fonction //
// -------- //

function is_object<K extends unknown>(value: unknown): value is K
{
	return typeof value === "object";
}

// ------ //
// Export //
// ------ //

export { is_object };
