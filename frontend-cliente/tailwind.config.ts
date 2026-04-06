import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brf: {
          // Cores-mãe (Paleta Banco Regional de Fomento)
          vermelho: '#A6193C',           // cor-mãe principal — header, botões primários
          'vermelho-escuro': '#7A1228',  // hover de botões primários
          laranja: '#F68B1F',            // cor-mãe secundária — badges, links ativos
          'laranja-escuro': '#C96D0A',   // hover de elementos laranja
          // Cores de apoio
          amarelo: '#FFCB05',            // análoga — avisos, highlights, status PENDENTE
          salmao: '#FFE6CB',             // análoga/neutra — fundos suaves
          cinza: '#646464',              // neutra — textos secundários, bordas
          'cinza-claro': '#F5F5F5',      // fundos de passos pendentes
          // Cores complementares
          verde: '#07A684',              // sucesso, status CONCLUIDO
          azul: '#0996B6',               // informações, links, status EM_ANALISE
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
