// -------- //
// Fonction //
// -------- //

/// Remplace tous les premiers caractères majuscules d'une chaîne de caractères
/// |text| par un point de code '-', suivi de la lettre en minuscule, excepté le
/// premier caractère majuscule s'il se trouve au début de la chaîne.
function kebabize(text: string): string
{
	const algo = (ch: string[number] /* char */, idx: number) =>
	{
		if (ch === ch.toUpperCase()) {
			let prefix = idx !== 0 ? "-" : "";
			return `${prefix}${ch.toLowerCase()}`;
		}
		return ch;
	};

	return text.split("").map(algo).join("");
}

// ------ //
// Export //
// ------ //

export { kebabize };
