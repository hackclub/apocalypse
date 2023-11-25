/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"primary-bg": "#401986",
				"secondary-bg": "#80ABF4",
				"accent": "#79E2F0"
			},
			fontFamily: {
				"inter": ["'Inter'", "sans-serif"]
			},
			screens: {
				"xs": "320px"
			}
		},
	},
	plugins: [],
}
