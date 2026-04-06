/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cores-mãe (Manual de Identidade Visual BNB)
        'bnb-vermelho': '#A6193C',           // cor-mãe principal
        'bnb-vermelho-escuro': '#7A1228',    // hover botões primários
        'bnb-laranja': '#F68B1F',            // cor-mãe secundária
        'bnb-laranja-escuro': '#C96D0A',     // hover elementos laranja
        // Cores de apoio
        'bnb-amarelo': '#FFCB05',            // avisos, status PENDENTE
        'bnb-salmao': '#FFE6CB',
        'bnb-cinza': '#646464',
        'bnb-cinza-claro': '#F5F5F5',        // fundos neutros
        // Cores complementares
        'bnb-verde': '#07A684',              // status CONCLUIDO
        'bnb-azul': '#0996B6',               // status EM_ANALISE, informações
      },
    },
  },
  plugins: [],
};

export default config;
