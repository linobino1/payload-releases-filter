import { defineConfig, presetUno, presetWind } from "unocss";
import presetWebFonts from "@unocss/preset-web-fonts";

export default defineConfig({
  presets: [
    presetUno({
      dark: "media",
    }),
    presetWind(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: {
          name: "Roboto",
          weights: [100, 200, 300, 400, 500, 600, 700],
        },
        // mono: {
        //   name: "JetBrains Mono",
        // },
      },
    }),
  ],
});
