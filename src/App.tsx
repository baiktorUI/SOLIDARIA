import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './components/Logo';
import { BingoBoard } from './components/BingoBoard';
import { MediaPanel } from './components/MediaPanel';
import { launchFireworks, launchSchoolPride, stopConfetti } from './utils/confetti';
import { useNumberStore } from './utils/numberGenerator';
import './index.css';

const App: React.FC = () => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [previousNumbers, setPreviousNumbers] = useState<number[]>([]);
  const [showLiniaCantada, setShowLiniaCantada] = useState(false);
  const [showQuinaMessage, setShowQuinaMessage] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [enterEnabled, setEnterEnabled] = useState(true);

  const numberStore = useNumberStore();
  const fireworksIntervalRef = useRef<number | null>(null);
  const schoolPrideAnimationRef = useRef<number | null>(null);
  const liniaCantadaFireworksRef = useRef<number | null>(null);

  useEffect(() => {
    numberStore.initialize();
  }, []);

  const generateRandomNumber = () => {
    if (!enterEnabled) return;
    
    const nextNumber = numberStore.getNextNumber();
    if (nextNumber === null) {
      numberStore.reset();
      setCurrentNumber(null);
      setPreviousNumbers([]);
      return;
    }

    setCurrentNumber(nextNumber);
    setPreviousNumbers(prev => [nextNumber, ...prev]);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && enterEnabled) {
        generateRandomNumber();
      }
      if (event.key.toLowerCase() === 'l') {
        setShowLiniaCantada(prev => !prev);
      }
      if (event.key.toLowerCase() === 'q') {
        setShowQuinaMessage(prev => !prev);
        setEnterEnabled(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enterEnabled]);

  useEffect(() => {
    if (showLiniaCantada) {
      launchFireworks(liniaCantadaFireworksRef);
    } else {
      stopConfetti(liniaCantadaFireworksRef, { current: null });
    }
  }, [showLiniaCantada]);

  useEffect(() => {
    if (showQuinaMessage) {
      launchFireworks(fireworksIntervalRef);
      launchSchoolPride(schoolPrideAnimationRef);
    } else {
      stopConfetti(fireworksIntervalRef, schoolPrideAnimationRef);
    }
  }, [showQuinaMessage]);

  return (
    <div className="app-container">
      <div className="current-number-box">
        {showQuinaMessage ? (
          <span className="han-cantat-quina">HAN CANTAT QUINA! 🎉🎉🎉</span>
        ) : (
          <div className={`current-number ${animate ? 'animate-flash' : ''}`}>
            {currentNumber?.toString().padStart(2, '0') ?? '?'}
          </div>
        )}
      </div>

      <div className="side-box">
        <div className="side-content">
          {showQuinaMessage ? (
            <span className="han-cantat-quinabox">HAN CANTAT QUINA! 🎉🎉🎉</span>
          ) : (
            previousNumbers
              .filter(num => num !== currentNumber)
              .slice(0, 5)
              .map((num, index) => (
                <span key={index} className={`previous-number opacity-${index}`}>
                  {num.toString().padStart(2, '0')}
                </span>
              ))
          )}
        </div>
      </div>

      <div className="additional-box">
        <Logo />
      </div>

      <MediaPanel
        currentNumber={currentNumber}
        showQuinaMessage={showQuinaMessage}
      />

      <div className={`large-box ${showQuinaMessage ? 'highlight' : ''}`}>
        <BingoBoard
          markedNumbers={previousNumbers}
          showQuinaMessage={showQuinaMessage}
        />
      </div>

      <div className="small-box">
        {showQuinaMessage ? (
          <span className="han-cantat-quina">HAN CANTAT QUINA! 🎉🎉🎉</span>
        ) : (
          showLiniaCantada && (
            <span className={`linia-cantada ${showLiniaCantada ? 'show' : ''}`}>
              LÍNIA CANTADA!! 🎉🎉
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default App;