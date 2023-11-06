// ---- //
// Type //
// ---- //

type Options = {
	/// Remplace tout le reste d'une chaîne de caractères en minuscule.
	to_lower?: boolean;
	/// Inclure les séparateurs dans le résultat?
	includes_separators?: boolean;
	/// Exclure le premier caractère?
	excludes_first_chars?: boolean;
};

// -------- //
// Constant //
// -------- //

const INCLUDE_SEPARATOR: RegExp = /([\s-_]+)/;
const EXCLUDE_SEPARATOR: RegExp = /[\s-_]+/;

const Default: Options = {
	to_lower: true,
	includes_separators: true,
	excludes_first_chars: false,
};

// -------- //
// Fonction //
// -------- //

/// Remplace tous les premiers caractères des mots d'une chaîne de caractères
/// |text| par une majuscule.
function capitalize(text: string, user_options: Options = Default): string {
	let options: Options = { ...Default, ...user_options };

	const algo = (word: string) => {
		if (word.length === 0) {
			return word;
		}

		// SAFETY: la condition ci-haut nous garantie que la chaîne de
		// caractères comporte au moins 1 caractère, qui nous permet d'accéder à
		// l'index 0 de la chaîne en toute sécurité.
		let first_ch: string[number] /* char */;
		if (options.excludes_first_chars) {
			first_ch = word[0];
		} else {
			first_ch = word[0].toUpperCase();
		}

		// NOTE(phisyx): le résultat d'une [String.prototype.slice(1)] lorsque
		// la chaîne est vide, renvoie une chaîne vide.
		let rest_of_str: string = word.slice(1);

		if (options.to_lower) {
			return first_ch + rest_of_str.toLowerCase();
		} else {
			return first_ch + rest_of_str;
		}
	};

	if (!INCLUDE_SEPARATOR.test(text)) {
		return algo(text);
	}

	if (options.includes_separators === true) {
		return text.split(INCLUDE_SEPARATOR).map(algo).join("");
	}

	return text.split(EXCLUDE_SEPARATOR).map(algo).join("");
}

// ------ //
// Export //
// ------ //

export { capitalize };
