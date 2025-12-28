import React, { useState, useEffect, useRef } from 'react';

interface DecibelMeterProps {
  isGloballyActive: boolean;
}

export const DecibelMeter: React.FC<DecibelMeterProps> = ({ isGloballyActive }) => {
  const [decibels, setDecibels] = useState<number>(0);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, []);

  // Activar/desactivar micrófono según el estado global
  useEffect(() => {
    if (isGloballyActive && !isMicActive) {
      startMicrophone();
    } else if (!isGloballyActive && isMicActive) {
      stopMicrophone();
    }
  }, [isGloballyActive]);

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

      // Configuración con MUCHA menos sensibilidad
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.95; // Muy suavizado
      microphoneRef.current.connect(analyserRef.current);

      setIsMicActive(true);
      measureDecibels();
    } catch (error) {
      console.error('Error al acceder al micrófono:', error);
      alert('No se pudo acceder al micrófono. Por favor, permite el acceso en tu navegador.');
    }
  };

  const stopMicrophone = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (microphoneRef.current) {
      const stream = microphoneRef.current.mediaStream;
      stream.getTracks().forEach(track => track.stop());
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setIsMicActive(false);
    setDecibels(0);
  };

  const measureDecibels = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(dataArray);

    // Calcular amplitud con mucha menos sensibilidad
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / dataArray.length);

    // Convertir a decibelios con MUCHA menos sensibilidad
    let db = 20 * Math.log10(rms + 0.001); // +0.001 para evitar log(0)
    
    // Ajustar rango: 50-100 dB (mucho menos sensible)
    db = Math.min(100, Math.max(50, Math.round(db + 115)));
    
    setDecibels(db);

    animationFrameRef.current = requestAnimationFrame(measureDecibels);
  };

  const getDecibelColor = (db: number): string => {
    if (db < 65) {
      return '#22c55e'; // Verde
    } else if (db < 80) {
      return '#eab308'; // Amarillo
    } else if (db < 92) {
      return '#f97316'; // Naranja
    } else {
      return '#ef4444'; // Rojo
    }
  };

  if (!isGloballyActive || !isMicActive) {
    return null;
  }

  // Calcular altura de barras (50-100 dB mapeado a 0-100%)
  const barHeight = ((decibels - 50) / 50) * 100;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl z-10 p-8">
      <div className="flex items-center justify-center gap-6 w-full h-full">
        {/* Gráfica vertical */}
        <div className="flex items-end gap-1 h-full max-h-[350px]">
          {[...Array(20)].map((_, index) => {
            const barThreshold = ((index + 1) / 20) * 100;
            const isActive = barHeight >= barThreshold;
            
            let barColor = '#22c55e';
            if (index >= 16) barColor = '#ef4444'; // Rojo (80-100%)
            else if (index >= 12) barColor = '#f97316'; // Naranja (60-80%)
            else if (index >= 6) barColor = '#eab308'; // Amarillo (30-60%)
            
            return (
              <div
                key={index}
                className="w-4 rounded-t transition-all duration-150"
                style={{
                  height: '100%',
                  backgroundColor: isActive ? barColor : 'rgba(255, 255, 255, 0.15)',
                  opacity: isActive ? 1 : 0.4,
                }}
              />
            );
          })}
        </div>

        {/* Número */}
        <div className="text-center flex-shrink-0">
          <div 
            className="font-bold leading-none"
            style={{ 
              color: getDecibelColor(decibels),
              fontSize: '120px'
            }}
          >
            {decibels}
          </div>
          <div 
            className="text-4xl font-semibold mt-2"
            style={{ color: getDecibelColor(decibels) }}
          >
            dB
          </div>
        </div>
      </div>
    </div>
  );
};
