// ---- //
// Type //
// ---- //

type Options = {
	includes_dash_before_number?: boolean;
	includes_special_char_after_dash?: boolean;
};

// -------- //
// Constant //
// -------- //

const Default: Options = {
	includes_dash_before_number: false,
	includes_special_char_after_dash: false,
};

// -------- //
// Fonction //
// -------- //

/// Remplace tous les premiers caractères majuscules d'une chaîne de caractères
/// |text| par un point de code '-', suivi de la lettre en minuscule, excepté le
/// premier caractère majuscule s'il se trouve au début de la chaîne.
function kebabize(text: string, user_options: Options = Default): string {
	let options: Options = { ...Default, ...user_options };

	const algo = (ch: string[number] /* char */, idx: number) => {
		if (ch === ch.toUpperCase()) {
			let prefix = idx !== 0 ? "-" : "";

			if (options.includes_dash_before_number) {
				if (/\d/.test(ch)) {
					return `${prefix}${ch.toLowerCase()}`;
				}
			}

			if (options.includes_special_char_after_dash) {
				if (!/[a-z]/i.test(ch)) {
					return `${prefix}${ch.toLowerCase()}`;
				}
			}

			if (/[a-z]/i.test(ch)) {
				return `${prefix}${ch.toLowerCase()}`;
			}

			if (/\d/.test(ch)) {
				return ch;
			}

			return prefix;
		}

		return ch;
	};

	return text.split("").map(algo).join("");
}

// ------ //
// Export //
// ------ //

export { kebabize };
