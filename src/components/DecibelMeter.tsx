import React, { useState, useEffect, useRef } from 'react';

interface DecibelMeterProps {
  isGloballyActive: boolean;
}

export const DecibelMeter: React.FC<DecibelMeterProps> = ({ isGloballyActive }) => {
  const [decibels, setDecibels] = useState<number>(50);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const updateIntervalRef = useRef<number | null>(null);

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
      analyserRef.current.fftSize = 1048;
      analyserRef.current.smoothingTimeConstant = 1.90;
      microphoneRef.current.connect(analyserRef.current);

      setIsMicActive(true);

      // Actualizar cada 1 segundos
      updateIntervalRef.current = window.setInterval(() => {
        measureDecibels();
      }, 500);

      // Primera medición inmediata
      measureDecibels();
    } catch (error) {
      console.error('Error al acceder al micrófono:', error);
      alert('No se pudo acceder al micrófono. Por favor, permite el acceso en tu navegador.');
    }
  };

  const stopMicrophone = () => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
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
    setDecibels(50);
  };

  const measureDecibels = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(dataArray);

    // Calcular amplitud
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / dataArray.length);

    // Convertir a decibelios con poca sensibilidad
    let db = 20 * Math.log10(rms + 0.001);

    // Ajustar rango: 50-100 dB
    db = Math.min(100, Math.max(50, Math.round(db + 120)));

    setDecibels(db);
  };

  const getDecibelColor = (db: number): string => {
    // Interpolación de verde a rojo
    const normalized = (db - 50) / 50; // 0 a 1

    if (normalized < 0.33) {
      // Verde a Amarillo
      const r = Math.round(34 + (234 - 34) * (normalized / 0.33));
      const g = Math.round(197 + (171 - 197) * (normalized / 0.33));
      const b = Math.round(94 + (8 - 94) * (normalized / 0.33));
      return `rgb(${r}, ${g}, ${b})`;
    } else if (normalized < 0.66) {
      // Amarillo a Naranja
      const localNorm = (normalized - 0.33) / 0.33;
      const r = Math.round(234 + (249 - 234) * localNorm);
      const g = Math.round(171 + (115 - 171) * localNorm);
      const b = Math.round(8 + (22 - 8) * localNorm);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Naranja a Rojo
      const localNorm = (normalized - 0.66) / 0.34;
      const r = Math.round(249 + (239 - 249) * localNorm);
      const g = Math.round(115 + (68 - 115) * localNorm);
      const b = Math.round(22 + (68 - 22) * localNorm);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  if (!isGloballyActive || !isMicActive) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl z-10">
      <div className="text-center">
        <div
          className="font-bold leading-none transition-colors duration-500"
          style={{
            color: getDecibelColor(decibels),
            fontSize: '140px'
          }}
        >
          {decibels}
        </div>
        <div
          className="text-4xl font-semibold mt-2 transition-colors duration-500"
          style={{ color: getDecibelColor(decibels) }}
        >
          dB
        </div>
      </div>
    </div>
  );
};
