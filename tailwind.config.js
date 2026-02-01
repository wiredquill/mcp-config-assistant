/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mcp: {
          primary: '#0071E3',   // Classic Apple Blue
          success: '#34C759',   // System Green
          warning: '#FF9500',   // System Orange
          accent: '#AF52DE',    // System Purple
          surface: '#F5F5F7',   // Light Gray background
          card: '#FFFFFF',      // Pure White cards
          dark: '#1D1D1F',      // Deep Text
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
        'active-glow': 'radial-gradient(circle at center, rgba(0,113,227,0.15) 0%, transparent 70%)',
      }
    },
  },
  plugins: [],
}