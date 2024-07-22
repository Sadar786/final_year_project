 
import flowbite from "flowbite-react/tailwind"

export default {
  content: [
    "./index.html",
   './src/**/*.{js,jsx,ts,tsx}',
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fea928',
        secondary: '#ed8900'
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '3rem',
        }
      }},
  },
  plugins: [
    flowbite.plugin(),
    require('tailwind-scrollbar'),

  ],
  rkMode: 'class',
   
   
};