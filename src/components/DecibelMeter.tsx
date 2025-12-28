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

      // Configurar el analizador
      analyserRef.current.fftSize = 256;
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
    if (!analyserRef.current || !isActive) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calcular el valor RMS (Root Mean Square)
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length);

    // Convertir a decibelios (escala aproximada)
    // La escala va de 0 a 255, convertimos a un rango de 0-100 dB aproximadamente
    const db = Math.min(100, Math.max(0, Math.round((rms / 255) * 100)));
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
        <div className="text-8xl font-bold">{decibels}</div>
        <div className="text-3xl mt-2">dB</div>
      </div>
    </div>
  );
};
