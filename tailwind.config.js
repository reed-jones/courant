const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    visibility: ['responsive', 'hover', 'group-hover']
  },
  plugins: [],
}
