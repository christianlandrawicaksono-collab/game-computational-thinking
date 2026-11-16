/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#080B12',
          surface: '#0e1424',
          panel: '#111827',
          cyan: '#00E5FF',
          green: '#39FF88',
          magenta: '#FF3D9A',
          amber: '#FFB300',
        }
      },
      fontFamily: {
        cyber: ['Orbitron', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        ui: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
