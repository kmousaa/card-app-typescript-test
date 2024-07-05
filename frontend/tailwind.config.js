module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        card: "var(--card)",
        button: "var(--button)",
        buttonHover: "var(--button-hover)",
        buttonHoverDarker: "var(--button-hover-darker)",
        text: "var(--text)",
        insideCard: "var(--inside-card)",
        insideText: "var(--inside-text)",
        delete: "var(--delete)",
        deleteHover: "var(--delete-hover)",
      },
    },
  },
  plugins: [],
};
