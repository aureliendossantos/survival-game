/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme"

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        unbounded: ["Unbounded", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        bg: {
          950: "#1c1817",
          900: "#2B1F1C",
          800: "#352a28",
          700: "#593233",
          600: "#794B2B",
          500: "#B47141",
          400: "#DDA15E",
        },
        main: {
          100: "#606C38",
          200: "#283618",
        },
      },
    },
  },
  plugins: [],
}
