import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    // Override default radius — traditional design uses sharp corners
    borderRadius: {
      none: "0",
      DEFAULT: "0",
      sm: "0",
      md: "0",
      lg: "0",
      full: "9999px",
    },
    extend: {
      colors: {
        // Parchment / cream — paper-like backgrounds
        parchment: {
          50: "#FBF8F1",
          100: "#F4ECD8",
          200: "#E9DDB9",
          300: "#DECB99",
          400: "#C9B07B",
          500: "#B69862",
          600: "#9A7E4B",
          700: "#7A6238",
          800: "#574627",
          900: "#382C18",
        },
        // Deep alpine forest — primary
        forest: {
          50: "#EEF2EE",
          100: "#D4DED4",
          200: "#A4B7A4",
          300: "#728E73",
          400: "#4E6E50",
          500: "#365137",
          600: "#2A3F2C",
          700: "#1F3023",
          800: "#15211A",
          900: "#0D1611",
        },
        // Aged oak — warm wood
        oak: {
          50: "#F6EFE5",
          100: "#E9D9BD",
          200: "#D4B98C",
          300: "#B8975F",
          400: "#967641",
          500: "#765B30",
          600: "#5C4624",
          700: "#42321A",
          800: "#2C2112",
          900: "#1A140B",
        },
        // Ink — charcoal text
        ink: {
          50: "#F5F4F1",
          100: "#E0DED9",
          200: "#B8B4AB",
          300: "#878276",
          400: "#5C5749",
          500: "#3D392E",
          600: "#2C2A22",
          700: "#1F1E18",
          800: "#14130F",
          900: "#0A0907",
        },
        // Swiss red — used like a wax seal, sparingly
        seal: {
          DEFAULT: "#A82A1F",
          light: "#C04138",
          dark: "#8B1C13",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        // Editorial type scale, tightened ~10% from the first pass
        "display-xl": ["clamp(3rem, 6vw, 5rem)", { lineHeight: "0.97", letterSpacing: "-0.02em", fontWeight: "400" }],
        "display-lg": ["clamp(2.4rem, 4.4vw, 3.75rem)", { lineHeight: "1.04", letterSpacing: "-0.015em", fontWeight: "400" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.12", letterSpacing: "-0.01em", fontWeight: "400" }],
        "display-sm": ["1.45rem", { lineHeight: "1.22", letterSpacing: "-0.005em", fontWeight: "400" }],
      },
      letterSpacing: {
        "wide-xs": "0.08em",
        "wide-sm": "0.12em",
        "wide-md": "0.18em",
        "wide-lg": "0.28em",
      },
      maxWidth: {
        prose: "62ch",
        editorial: "76ch",
      },
      backgroundImage: {
        // Subtle paper grain — overlaid via CSS in globals
        "grain": "url('/textures/grain.svg')",
      },
      animation: {
        "ink-fade": "inkFade 0.6s ease-out both",
      },
      keyframes: {
        inkFade: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
