/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Safelist all classes so user artifacts' Tailwind classes work at runtime
  safelist: [{ pattern: /.*/ }],
  theme: {
    extend: {},
  },
  plugins: [],
};
