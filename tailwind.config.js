/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7fb',
          100: '#e6edf5',
          200: '#c7d6e8',
          300: '#9ab3d1',
          400: '#6989b3',
          500: '#436898',
          600: '#2f4f7c',
          700: '#263f64',
          800: '#1e3a5f',
          900: '#162a45',
          950: '#0d1a2d',
        },
        success: {
          50: '#edf7ef',
          100: '#d7eedc',
          500: '#2d8f4e',
          600: '#1f7a3f',
          700: '#145c2f',
        },
        danger: {
          500: '#c14b3c',
          600: '#a23a2e',
        },
        warning: {
          50: '#fdf8ec',
          500: '#d4a540',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};
