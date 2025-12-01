/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 PALETA PRINCIPAL (Brand) – Calmaria, confiança e cuidado
        primary: {
          DEFAULT: '#1E88E5',  // Azul Clínico Primário
          dark: '#1565C0',     // Azul Profissional
          light: '#BBDEFB',    // Azul Pastel
          lighter: '#E3F2FD',  // Azul Muito Claro
        },
        success: {
          DEFAULT: '#43A047',  // Verde Saúde
          light: '#66BB6A',    // Verde Suave
          lighter: '#C8E6C9',  // Verde Pastel
          dark: '#2E7D32',     // Sucesso forte
        },
        info: {
          DEFAULT: '#0288D1',  // Info forte
          light: '#81D4FA',    // Info suave
          cyan: '#26C6DA',     // Ciano Clínico
        },
        warning: {
          DEFAULT: '#F9A825',  // Atenção
          light: '#FFEB3B',    // Alerta suave
        },
        danger: {
          DEFAULT: '#C62828',  // Erro crítico
          light: '#FFCDD2',    // Erro suave
        },
        neutral: {
          black: '#1A1A1A',    // Preto Médico
          dark: '#424242',     // Cinza Escuro
          medium: '#9E9E9E',   // Cinza Médio
          light: '#E0E0E0',    // Cinza Claro
          white: '#FFFFFF',    // Branco
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'medical': '0 2px 8px rgba(30, 136, 229, 0.1)',
        'medical-lg': '0 4px 16px rgba(30, 136, 229, 0.15)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}
