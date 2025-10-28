/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
        colors: {
        // Base
        page: "#FFFFFF",
        pageDark: "#3E3B36",

        // Primary palette
        primary: "#894E35",       // Brown text
        primaryPink: "#D25099",   // Pink highlight
        primaryYellow: "#EDB22D",
        primaryMint: "#88CECF",
        primaryBrown: "#894E35",

        // Secondary palette
        secondary: "#FFFFFF",
        secondaryPink: "#F7D2E7",
        secondaryYellow: "#FADD9C",  // Soft yellow background
        secondaryMint: "#C0E5E5",

        // Tertiary
        tertiaryYellow: "#F9ECCC",
      },
      fontFamily: {
        actor: ['"Actor"', "sans-serif"],
        bukhari: ['"Bukhari"', "sans-serif"],

    },
  },
  plugins: [],
}
}