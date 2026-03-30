const shilpSutra = require('@devalok/shilp-sutra/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [shilpSutra],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      maxWidth: {
        'article': '720px',
        'page': '1200px',
      },
    },
  },
  plugins: [],
};
