/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fluidMotion: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        gradientMove: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        bounce: {
          300: "300% 300%",
        },
        "fade-out": {
          "0%": { opacity: 1, transform: "scale(1)" },
          "100%": { opacity: 0, transform: "scale(0.95)" },
        },
        smoke: {
          "0%": { backgroundPosition: "0% 50%", opacity: "0.2" },
          "50%": { backgroundPosition: "100% 50%", opacity: "0.4" },
          "100%": { backgroundPosition: "0% 50%", opacity: "0.2" },
        },
        waveMotion: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
            transform: "scale(1)",
          },
          "50%": {
            backgroundPosition: "100% 50%",
            transform: "scale(1.1)",
          },
        },
        lightFlicker: {
          "0%, 100%": { opacity: 0.2 },
          "25%": { opacity: 0.4 },
          "50%": { opacity: 0.1 },
          "75%": { opacity: 0.3 },
        },
        pingOnce: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "40%": { transform: "scale(1.8)", opacity: "0.5" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.3)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.3)" },
          "70%": { transform: "scale(1)" },
        },
      },
      animation: {
        fuild: "fluidMotion 12s ease-in-out infinite",
        bounce: "bounce 1s infinite",
        "fade-out": "fade-out 0.3s ease-out",
        smoke: "smoke 4s ease-out infinite",
        "audio-wave": "audio-wave 1s infinite",
        gradient: "gradientMove 10s ease infinite",
        waves: "waveMotion 15s ease-in-out infinite",
        lightRain: "lightFlicker 8s ease-in-out infinite",
        "ping-once": "pingOnce 0.6s ease-in-out",
        "spin-slow": "spin 12s linear infinite",
        heartbeat: "heartbeat 1.5s infinite", // 💜 Nuevo
      },
      backgroundSize: {
        300: "300% 300%",
      },
      transform: {
        "rotate-x-10": "rotateX(10deg)",
        "translate-z-10": "translateZ(10px)",
      },
      boxShadow: {
        "3d": "0 10px 20px rgba(0, 0, 0, 0.2)",
        glow: "0 0 10px rgba(168, 157, 177, 0.3)",
        "text-glow": "0 0 6px rgba(168, 157, 177, 0.5)",
      },
      fontFamily: {
        sans: ["Segoe UI", "sans-serif"],
        cormorant: ["'Cormorant Garamond'", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "#000000",
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
          DEFAULT: "#A64D79",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#3B1C32",
          foreground: "#A64D79",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#3B1C32",
          foreground: "#F8FAFC",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "#000000",
        input: "#000000",
        ring: "#6A1E55",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        lapsus: {
          100: "#F4EDD3",
          200: "#A5BFCC",
          300: "#7E99A3",
          400: "#4C585B",
          500: "#F8FAFC",
          600: "#D9EAFD",
          700: "#BCCCDC",
          800: "#9AA6B2",
          900: "#000000",
          1000: "#3B1C32",
          1100: "#A64D79",
          1200: "#6A1E55",
          1250: "#1A1A1D",
          lavender: "#A89DB1",
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide"),
  ],
};
