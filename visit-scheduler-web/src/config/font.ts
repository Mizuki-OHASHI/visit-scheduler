import { Roboto_Mono, Zen_Kaku_Gothic_Antique } from "next/font/google";

export const zenKakuGothicAntique = Zen_Kaku_Gothic_Antique({
  display: "swap",
  weight: ["300", "400", "500", "700"],
  preload: false,
  variable: "--font-zen-kaku-gothic-antique",
});

export const robotoMono = Roboto_Mono({
  display: "swap",
  preload: false,
  variable: "--font-roboto-mono",
});
