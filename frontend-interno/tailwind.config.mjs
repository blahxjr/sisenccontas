/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cores-mãe (Manual de Identidade Visual BNB)
        'bnb-vermelho': '#A6193C',     // cor-mãe principal
        'bnb-laranja': '#F68B1F',      // cor-mãe secundária
        // Cores de apoio
        'bnb-amarelo': '#FFCB05',
        'bnb-salmao': '#FFE6CB',
        'bnb-cinza': '#646464',
        // Cores complementares
        'bnb-verde': '#07A684',
        'bnb-azul-info': '#0996B6',
      },
    },
  },
  plugins: [],
};

export default config;
