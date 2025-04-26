/** @type {import('tailwindcss').Config} */

const withMT = require('@material-tailwind/html/utils/withMT')

module.exports = withMT({
    mode: 'jit',  // Enable Just-in-Time mode for faster builds
    darkMode: 'selector',
    content: [
        "./*.html",  // Only root HTML files
        "./js/**/*.js",  // All JS files in the js folder
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ["Poppins", "cursive"],
            },
        },
    },
    plugins: [],
})
tailwind.config = {
    theme: {
        // screens: {
        //     'sm': '576px',
        //     'md': '768px', 
        //     'lg': '992px',
        //     'xl': '1240px',
        //     '2xl': '1240px'
        // },
        extend: {
            colors: {
                primary: '#000000',
                secondary: '#00000099'
            }
        },
        fontFamily: {
            
        }
    }
  }
