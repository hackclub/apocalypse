const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "primary-bg": "#401986",
        "secondary-bg": "#6B5FFE",
        "dark-bg": "#2B1B50",
        "light-bg": "#EDDAF8",
        dark: "#A183B2",
        accent: "#79E2F0",
        accent2: "#FF5DA9",
      },
      fontFamily: {
        sans: ["Geist", ...defaultTheme.fontFamily.sans],
        main: ["NeueBit-Bold", ...defaultTheme.fontFamily.mono],
      },
      screens: {
        xs: "320px",
        "3xl": "1792px",
      },
      backgroundSize: {
        "75%": "75%",
      },
    },
  },
};
