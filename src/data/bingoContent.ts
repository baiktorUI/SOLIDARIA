import type { BingoNumber } from './types'; // Asegúrate de que './types' es el camino correcto.

const bingoContent: Record<number, BingoNumber> = {};

// Generar contenido para los números 1-90
for (let i = 1; i <= 90; i++) {
  bingoContent[i] = {
    song: `/assets/audio/number-${i}.mp3`,
    image: `/assets/images/number-${i}.jpg`
  };
}

// Exportar bingoContent
export { bingoContent };
