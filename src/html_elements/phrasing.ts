import { HTMLExtension } from "~/html_extension";

// -------- //
// Constant //
// -------- //

const BREAK: HTMLExtension<HTMLBRElement> = br();

// -------- //
// Fonction //
// -------- //

function br(...args: HTMLExtension.Args): HTMLExtension<HTMLBRElement>
{
	return HTMLExtension.createElement("br", args);
}

function p(...args: HTMLExtension.Args): HTMLExtension<HTMLParagraphElement>
{
	return HTMLExtension.createElement("p", args);
}

function strong(...args: HTMLExtension.Args): HTMLExtension<HTMLSpanElement>
{
	return HTMLExtension.createElement("strong", args);
}

// ------ //
// Export //
// ------ //

export { br, BREAK, p, strong };
