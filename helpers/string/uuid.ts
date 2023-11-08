// -------- //
// Fonction //
// -------- //

/**
 * Génère une chaîne de caractère avec des caractères alphanumériques aléatoires
 * de taille 36
 */
const simple_uuid = (): string =>
	get_random_str("yxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx");

/**
 * Génère une chaîne de caractère aléatoire.
 */
function get_random_str(str: string): string {
	const { floor: f, random: r } = Math;

	let dt = new Date().getTime();
	const replaceXY = (c: string) => {
		const random = (dt + r() * 16) % 16 | 0;
		dt = f(dt / 16);
		return (c === "x" ? random : (random & 0x3) | 0x8).toString(16);
	};

	return str.replace(/[xy]/g, replaceXY).replace(/^\d/g, () => "x");
}

// ------ //
// Export //
// ------ //

export { simple_uuid, get_random_str };
