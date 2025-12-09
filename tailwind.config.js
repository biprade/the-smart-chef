export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#1a1a1a',
        'beige': {
          light: '#f5f5dc',
          DEFAULT: '#e8e2d5',
          dark: '#d4c5b0',
        },
        'sage': {
          light: '#b8c5a9',
          DEFAULT: '#9ba787',
          dark: '#7e8f6f',
        },
      },
    },
  },
  plugins: [],
}
