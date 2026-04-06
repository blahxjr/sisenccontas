import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bnb: {
          // Cores-mãe (Manual de Identidade Visual BNB)
          vermelho: '#A6193C',     // cor-mãe principal — header, botões primários
          laranja: '#F68B1F',      // cor-mãe secundária — badges, links ativos
          // Cores de apoio
          amarelo: '#FFCB05',      // análoga — avisos, highlights
          salmao: '#FFE6CB',       // análoga/neutra — fundos suaves
          cinza: '#646464',        // neutra — textos secundários, bordas
          // Cores complementares
          verde: '#07A684',        // sucesso, status concluído
          'azul-info': '#0996B6',  // informações, links
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [forms],
};

export default config;
