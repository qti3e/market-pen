const production = !process.env.ROLLUP_WATCH;
const colors = require('tailwindcss/colors')

module.exports = {
    purge: {
        enabled: production,
        content: [
            './src/**/*.html',
            './src/**/*.svelte',
        ],
        options: {
            safelist: [
              'bg-primary-800',
              'cursor-default',
              'hover:bg-primary-800',
              'text-yellow-300'
            ],
        }
    },
    darkMode: 'class', // 'media' / 'class' / 'false'
    theme: {
        colors: {
            ...colors,
            primary: colors.gray,
            secondary: colors.blue,
            fg: {
                primary: colors.white,
                secondary: colors.white
            }
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
