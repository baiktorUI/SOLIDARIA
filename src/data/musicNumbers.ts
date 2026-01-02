// Llista dels números que tenen música (40 números)
// Números amb arxiu MP3 associat
export const MUSIC_NUMBERS = new Set([
  1, 3, 5, 8, 10, 12, 14, 17, 20, 23,
  24, 27, 29, 32, 34, 36, 38, 41, 43, 46,
  49, 50, 52, 55, 57, 59, 61, 64, 66, 68,
  71, 73, 76, 78, 80, 82, 84, 86, 88, 90
]);

export const hasMusicForNumber = (num: number): boolean => {
  return MUSIC_NUMBERS.has(num);
};
