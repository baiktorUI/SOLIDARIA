import React, { useState, useEffect, useRef } from 'react';

export const DecibelMeter: React.FC = () => {
  const [decibels, setDecibels] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup cuando el componente se desmonta
      stopMicrophone();
    };
  }, []);

  const startMicrophone = async () => {
    try {
      // Solicitar acceso al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);

      // Crear contexto de audio
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

      // Configurar el analizador con mejor sensibilidad
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;
      microphoneRef.current.connect(analyserRef.current);

      setIsActive(true);
      measureDecibels();
    } catch (error) {
      console.error('Error al acceder al micrófono:', error);
      setHasPermission(false);
      alert('No se pudo acceder al micrófono. Por favor, permite el acceso en tu navegador.');
    }
  };

  const stopMicrophone = () => {
    // Cancelar el loop de medición
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Desconectar y cerrar todo
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setIsActive(false);
    setDecibels(0);
  };

  const measureDecibels = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(dataArray);

    // Calcular el nivel de amplitud
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / dataArray.length);

    // Convertir a decibelios (escala más sensible)
    // Usamos una escala logarítmica para mejor sensibilidad
    let db = 20 * Math.log10(rms);
    
    // Ajustar el rango para que sea más visible (30-100 dB)
    db = Math.min(100, Math.max(30, Math.round(db + 90)));
    
    setDecibels(db);

    // Continuar midiendo
    animationFrameRef.current = requestAnimationFrame(measureDecibels);
  };

  const toggleMicrophone = () => {
    if (isActive) {
      stopMicrophone();
    } else {
      startMicrophone();
    }
  };

  // Función para obtener el color según los decibelios
  const getDecibelColor = (db: number): string => {
    // Verde: 30-50 dB
    // Amarillo: 50-70 dB
    // Naranja: 70-85 dB
    // Rojo: 85-100 dB
    if (db < 50) {
      return '#22c55e'; // Verde
    } else if (db < 70) {
      return '#eab308'; // Amarillo
    } else if (db < 85) {
      return '#f97316'; // Naranja
    } else {
      return '#ef4444'; // Rojo
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Activar/desactivar con la tecla 'M'
      if (event.key.toLowerCase() === 'm') {
        toggleMicrophone();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl z-10">
      <div className="text-white text-center">
        <div 
          className="text-[180px] font-bold leading-none"
          style={{ color: getDecibelColor(decibels) }}
        >
          {decibels}
        </div>
        <div 
          className="text-5xl mt-4 font-semibold"
          style={{ color: getDecibelColor(decibels) }}
        >
          dB
        </div>
      </div>
    </div>
  );
};
