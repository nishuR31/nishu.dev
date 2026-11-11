import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: ["blur-sm", "blur-md", "blur-lg", "blur-xl", "blur-2xl", "blur-3xl"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        xs: ["clamp(0.7rem, 1vw, 0.75rem)", { lineHeight: "1rem" }],
        sm: ["clamp(0.8rem, 1.2vw, 0.875rem)", { lineHeight: "1.25rem" }],
        base: ["clamp(0.9rem, 1.5vw, 1rem)", { lineHeight: "1.5rem" }],
        lg: ["clamp(1rem, 2vw, 1.125rem)", { lineHeight: "1.75rem" }],
        xl: ["clamp(1.125rem, 2.5vw, 1.25rem)", { lineHeight: "1.75rem" }],
        "2xl": ["clamp(1.25rem, 3vw, 1.5rem)", { lineHeight: "2rem" }],
        "3xl": ["clamp(1.5rem, 4vw, 1.875rem)", { lineHeight: "2.25rem" }],
        "4xl": ["clamp(1.875rem, 5vw, 2.25rem)", { lineHeight: "2.5rem" }],
        "5xl": ["clamp(2.25rem, 6vw, 3rem)", { lineHeight: "1.2" }],
        "6xl": ["clamp(2.75rem, 7vw, 3.75rem)", { lineHeight: "1.1" }],
        "7xl": ["clamp(3.25rem, 8vw, 4.5rem)", { lineHeight: "1.1" }],
        "8xl": ["clamp(4rem, 10vw, 6rem)", { lineHeight: "1" }],
        "9xl": ["clamp(5rem, 12vw, 8rem)", { lineHeight: "1" }],
      },
      keyframes: {
        shine: {
          from: {
            backgroundPosition: "200% 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
	"spin-rev":{
	   "0%":{ transform:"rotate(0deg)"},
 	   "40%":{transform:"rotate(-50deg)"},
	   "100%":{transform:"rotate(360deg)"},
	},
        fadeOut: {
          "0%": { opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { opacity: "0", visibility: "hidden" },
        },
        nudgeLeft: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-3px)" },
        },
        nudgeRight: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(3px)" },
        },
      },
      animation: {
	"spin-rev":"spin-rev 0.45s  cubic-bezier(0.34, 1.54, 0.64, 1)",
        shine: "shine 8s ease-in-out infinite",
        fadeOut: "fadeOut 3s ease-in-out 1.5s forwards",
        nudgeLeft: "nudgeLeft 1s ease-in-out infinite",
        nudgeRight: "nudgeRight 1s ease-in-out infinite",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
