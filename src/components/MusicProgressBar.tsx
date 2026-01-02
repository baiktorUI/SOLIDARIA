import React from 'react';
import { MUSIC_NUMBERS } from '../data/musicNumbers';

interface MusicProgressBarProps {
  markedNumbers: number[];
}

export const MusicProgressBar: React.FC<MusicProgressBarProps> = ({ markedNumbers }) => {
  // Comptar quants números amb música s'han marcat
  const musicNumbersArray = Array.from(MUSIC_NUMBERS).sort((a, b) => a - b);
  const totalMusicNumbers = musicNumbersArray.length;
  
  const markedMusicCount = markedNumbers.filter(num => MUSIC_NUMBERS.has(num)).length;
  const percentage = (markedMusicCount / totalMusicNumbers) * 100;

  return (
    <div 
      className="fixed right-6 top-1/2 -translate-y-1/2 w-8 rounded-full overflow-hidden"
      style={{ 
        height: '600px',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        zIndex: 1000
      }}
    >
      {/* Barra de progrés */}
      <div 
        className="w-full bg-gradient-to-t from-green-400 via-green-500 to-green-600 transition-all duration-500 ease-out absolute bottom-0 rounded-full"
        style={{ 
          height: `${percentage}%`,
          boxShadow: percentage > 0 ? '0 0 20px rgba(34, 197, 94, 0.6)' : 'none'
        }}
      >
        {/* Brillantor a la part superior */}
        {percentage > 0 && (
          <div 
            className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent opacity-30"
          />
        )}
      </div>

      {/* Marques opcionals per cada número amb música */}
      <div className="absolute inset-0 flex flex-col justify-between py-2">
        {musicNumbersArray.map((num, index) => {
          const isMarked = markedNumbers.includes(num);
          return (
            <div 
              key={num}
              className="flex-1 border-t border-white border-opacity-10 relative"
            >
              {isMarked && (
                <div 
                  className="absolute inset-0 bg-green-400 opacity-80"
                  style={{ animation: 'pulse 0.5s ease-in-out' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
