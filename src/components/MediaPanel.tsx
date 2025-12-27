import React, { useEffect, useState, useRef } from 'react';
import { bingoContent } from '../data/bingoContent';
import type { BingoNumber } from '../data/types';

interface MediaPanelProps {
  currentNumber: number | null;
  showQuinaMessage: boolean;
}

export const MediaPanel: React.FC<MediaPanelProps> = ({ currentNumber, showQuinaMessage }) => {
  const [content, setContent] = useState<BingoNumber | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup function to stop audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (currentNumber) {
      // Stop previous audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      setIsLoading(true);
      setContent(bingoContent[currentNumber]);
      setProgress(0);
      setDuration(0);

      // Create new audio element
      const audio = new Audio(bingoContent[currentNumber].song);
      audio.volume = 0.5;
      audioRef.current = audio;

      // Set up event listeners
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      audio.addEventListener('timeupdate', () => {
        setProgress(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        setProgress(0);
      });

      // Play audio
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }, [currentNumber]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (showQuinaMessage) {
    return (
      <div className="video-box">
        <span className="han-cantat-quina">HAN CANTAT QUINA! 🎉🎉🎉</span>
      </div>
    );
  }

  return (
    <div className="video-box">
      {currentNumber && content ? (
        <>
          <img
            src={content.image}
            alt={`Número ${currentNumber}`}
            className="w-full h-full object-cover rounded-2xl"
            onLoad={() => setIsLoading(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
            <div className="flex items-center gap-2">
              <div className="text-xs text-white font-medium">
                {formatTime(progress)}
              </div>
              <div className="flex-1 h-2 bg-white bg-opacity-20 rounded">
                <div 
                  className="h-full bg-white rounded transition-all duration-100"
                  style={{ 
                    width: `${(progress / duration) * 100}%`,
                    transition: 'width 0.1s linear'
                  }}
                />
              </div>
              <div className="text-xs text-white font-medium">
                {formatTime(duration)}
              </div>
            </div>
          </div>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default MediaPanel;