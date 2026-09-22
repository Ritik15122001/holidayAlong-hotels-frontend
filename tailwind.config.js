export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, i / 100])),
      colors: {
        brand: {
          50: '#eef6ff', 100: '#d9eaff', 200: '#bcdbff', 300: '#8ec4ff',
          400: '#59a4ff', 500: '#2b83f6', 600: '#1466e3', 700: '#0f51c0',
          800: '#12459b', 900: '#143d7b',
        },
        accent: { 50: '#fff5ed', 100: '#ffe7d3', 400: '#ff9145', 500: '#f97316', 600: '#e45c05' },
        ink: { 900: '#0f1b2d', 700: '#2b3c53', 500: '#5b6b81', 400: '#7c8ba1' },
        line: '#e3e9f2',
        surface: '#f5f8fc',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card: '0 1px 2px rgba(15,27,45,0.04), 0 6px 20px -12px rgba(15,27,45,0.18)',
        lift: '0 8px 30px -10px rgba(15,27,45,0.20)',
        panel: '0 10px 40px -12px rgba(15,27,45,0.22)',
      },
    },
  },
  plugins: [],
};
