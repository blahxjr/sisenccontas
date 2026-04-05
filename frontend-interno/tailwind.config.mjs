/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bnb-azul': '#003087',
        'bnb-azul-claro': '#0055B8',
        'bnb-amarelo': '#F5A800',
      },
    },
  },
  plugins: [],
};

export default config;
