const config = {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    daisyui: {
        themes: "dark",
    },

    plugins: [
        require("@tailwindcss/typography"),
        require("daisyui"),
        require("prettier-plugin-tailwindcss"),
    ],

    theme: {
        extend: {},
    },
};

module.exports = config;
