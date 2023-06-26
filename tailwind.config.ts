import type { Config } from "tailwindcss";

export default {

  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'pathway-extreme': ['Pathway Extreme' , 'sans-serif'],
      },
     
    },
  },
  plugins: [require("daisyui")],
} satisfies Config;
