/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path according to where your template files are located
    ],
    theme: {
      extend: {
        // You can extend the default theme here
        // For example: colors, spacing, typography, etc.
      },
    },
    plugins: [
      // You can add plugins here
      // For example: require('@tailwindcss/forms')
    ],
  };