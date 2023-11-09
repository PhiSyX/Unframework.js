// -------- //
// Fonction //
// -------- //

function is_primitive<K extends unknown>(value: K): value is K & boolean {
	return (
		is_bigint(value) ||
		is_boolean(value) ||
		is_number(value) ||
		is_string(value)
	);
}

function is_bigint(value: unknown): value is bigint {
	return typeof value === "bigint";
}
function is_boolean(value: unknown): value is boolean {
	return typeof value === "boolean";
}
function is_number(value: unknown): value is number {
	return typeof value === "number";
}
function is_string(value: unknown): value is string {
	return typeof value === "string";
}

// ------ //
// Export //
// ------ //

export { is_primitive, is_bigint, is_boolean, is_number, is_string };
