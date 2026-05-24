/** Brand palette — source: design/image.png */
export const PALETTE = {
  black: "#000000",
  red: "#EF0606",
  redSoft: "color-mix(in srgb, #EF0606 78%, #000000)",
  swirl: "#D3CCC7",
  offWhite: "#EFEEE8",
} as const;

export type PaletteColor = keyof typeof PALETTE;
