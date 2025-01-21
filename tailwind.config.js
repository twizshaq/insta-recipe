// tailwind.config.js
module.exports = {
    content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
        screens: {
            // add a custom screen
            'custom': '1000px', 
            'mobile': '600px',
            'mobile2': '495px',
            'whenwrap': '1420px',
            'whenwrap2': '1161px',
        }
        }
    },
    plugins: [
    require('tailwind-scrollbar-hide')
    ]
  // ...
};