import { resolve } from "node:path";

import { defineConfig } from "vite";

let config = defineConfig({
	resolve: {
		alias: [
			{
				find: "~/helpers",
				replacement: resolve("helpers"),
			},
			{
				find: "~",
				replacement: resolve("src"),
			},
		],
	},
});

export default config;
