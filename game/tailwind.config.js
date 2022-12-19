/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        terminal: "#16ee4e",
        purplz: "#a24cc2",
        dbg: "#080D58",
        pinkz: "#CB47F2",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
