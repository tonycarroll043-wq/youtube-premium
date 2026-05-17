/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'yt-bg': '#0f0f0f',
        'yt-surface': '#212121',
        'yt-hover': '#3d3d3d',
        'yt-text': '#f1f1f1',
        'yt-muted': '#aaaaaa',
        'yt-red': '#ff0000',
        'yt-border': '#303030',
        'yt-blue': '#3ea6ff',
        'yt-premium': '#ffd600',
        'yt-chip': '#272727',
        'yt-chip-active': '#f1f1f1',
      },
      fontFamily: {
        yt: ['"YouTube Sans"', '"Roboto"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
