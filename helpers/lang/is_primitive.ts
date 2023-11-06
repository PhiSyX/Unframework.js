// -------- //
// Fonction //
// -------- //

function is_primitive<K extends unknown>(value: K): value is K
{
	return (
		typeof value === "string" ||
		typeof value === "boolean" ||
		typeof value === "number" ||
		typeof value === "bigint"
	);
}

// ------ //
// Export //
// ------ //

export { is_primitive };
