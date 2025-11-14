import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: '#DFD3B7',
        secondary: '#080809',
        fondo: '#FFFFFF',
        grisTexto: '#4B5563',
        grisFondo: '#F3F4F6'
      }
    }
  },
  plugins: []
};

export default config;
