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
                'border-blue-300',
                'border-orange-500',
                'border-pink-100',
                'border-pink-900',
                'dark',
                'from-blue-500',
                'from-blue-700',
                'from-yellow-200',
                'text-pink-100',
                'text-pink-900',
                'to-blue-800',
                'to-pink-300',
                'to-purple-800',
                'to-yellow-500'
            ],
        }
    },
    darkMode: 'class', // 'media' / 'class' / 'false'
    theme: {
        colors: {
            ...colors,
            primary: colors.pink,
            secondary: colors.indigo,
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
