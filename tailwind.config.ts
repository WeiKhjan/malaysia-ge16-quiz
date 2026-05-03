import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0e27",
        bgalt: "#13183a",
        ink: "#f5f5f5",
        muted: "#8b91b8",
        ph: "#E2231A",
        bn: "#0a2472",
        bngold: "#FFD700",
        pn: "#1A4D2E",
        pixyellow: "#FFE066",
        pixpink: "#FF6B9D",
        pixcyan: "#5BE9E9",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        mono: ['"VT323"', "monospace"],
      },
      boxShadow: {
        pixel: "4px 4px 0 0 #000",
        pixelsm: "2px 2px 0 0 #000",
        pixellg: "6px 6px 0 0 #000",
      },
    },
  },
  plugins: [],
};
export default config;
