/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Slack-inspired color palette with human-centered design
        slack: {
          purple: '#4A154B',
          'purple-dark': '#350D36',
          'purple-light': '#611F69',
          green: '#007A5A',
          'green-light': '#00A86B',
          blue: '#1264A3',
          'blue-light': '#1D9BD1',
          yellow: '#FFB800',
          'yellow-light': '#FFD700',
          red: '#E01E5A',
          'red-light': '#FF6B6B',
          gray: {
            50: '#F8F9FA',
            100: '#F1F3F4',
            200: '#E8EAED',
            300: '#DADCE0',
            400: '#BDC1C6',
            500: '#9AA0A6',
            600: '#80868B',
            700: '#5F6368',
            800: '#3C4043',
            900: '#202124',
          }
        },
        // Role-based colors for feedback categories
        role: {
          designer: '#8B5CF6', // Purple - creativity
          reviewer: '#3B82F6', // Blue - quality
          pm: '#10B981', // Green - growth
          developer: '#F59E0B', // Orange - technical
        },
        // Feedback severity colors
        severity: {
          high: '#EF4444', // Red
          medium: '#F59E0B', // Orange
          low: '#10B981', // Green
        },
        // Category colors
        category: {
          accessibility: '#EF4444', // Red
          visualHierarchy: '#8B5CF6', // Purple
          contentCopy: '#3B82F6', // Blue
          uxPatterns: '#10B981', // Green
        }
      },
      fontFamily: {
        'slack': ['Lato', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-gentle': 'bounce 1s ease-in-out infinite',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'wiggle': 'wiggle 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      borderRadius: {
        'slack': '8px',
        'organic': '12px',
      },
      boxShadow: {
        'slack': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'slack-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'organic': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
