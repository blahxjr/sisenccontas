/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cores-mãe (Paleta Banco Regional de Fomento)
        'brf-vermelho': '#A6193C',           // cor-mãe principal
        'brf-vermelho-escuro': '#7A1228',    // hover botões primários
        'brf-laranja': '#F68B1F',            // cor-mãe secundária
        'brf-laranja-escuro': '#C96D0A',     // hover elementos laranja
        // Cores de apoio
        'brf-amarelo': '#FFCB05',            // avisos, status PENDENTE
        'brf-salmao': '#FFE6CB',
        'brf-cinza': '#646464',
        'brf-cinza-claro': '#F5F5F5',        // fundos neutros
        // Cores complementares
        'brf-verde': '#07A684',              // status CONCLUIDO
        'brf-azul': '#0996B6',               // status EM_ANALISE, informações
      },
    },
  },
  plugins: [],
};

export default config;
