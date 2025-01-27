import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {}
  },

  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: ["light", "dark", "retro", "cupcake", "pastel", "nord"]
  },
  darkMode: ["selector", '[data-theme="dark"]']
} satisfies Config;
