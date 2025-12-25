/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Enterprise Obsidian & Cyan Palette
                base: {
                    950: '#020617', // Deepest Obsidian
                    900: '#0B1121', // Main Background
                    800: '#1e293b', // Surface
                    700: '#334155', // Borders/Division
                },
                primary: {
                    DEFAULT: '#0EA5E9',
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                },
                slate: {
                    200: '#E2E8F0',
                    400: '#94A3B8',
                    500: '#64748b',
                    800: '#1E293B',
                    900: '#0F172A',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'shimmer': {
                    '100%': { transform: 'translateX(100%)' },
                },
                'pulse-soft': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                }
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'fade-in': 'fade-in 0.4s ease-out',
                'shimmer': 'shimmer 2s infinite',
                'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'glow-cyan': '0 0 20px rgba(14, 165, 233, 0.15)',
            },
            backgroundImage: {
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
