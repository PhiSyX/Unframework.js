import { HTMLExtension } from "~/html_extension";

// -------- //
// Fonction //
// -------- //

export function img(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLDivElement> {
	return HTMLExtension.createElement("img", args);
}

export function picture(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLPictureElement> {
	return HTMLExtension.createElement("picture", args);
}

export function video(
	...args: HTMLExtension.Args
): HTMLExtension<HTMLVideoElement> {
	return HTMLExtension.createElement("video", args);
}
