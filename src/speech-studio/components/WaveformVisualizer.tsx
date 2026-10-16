import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  isRecording?: boolean;
  color?: string;
  height?: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isPlaying,
  isRecording = false,
  color = '#10b981', // emerald-500
  height = 54,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const barsCount = 36;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;

      const barWidth = width / barsCount;
      const active = isPlaying || isRecording;

      for (let i = 0; i < barsCount; i++) {
        const x = i * barWidth;
        let barHeight = 4; // Base idle height

        if (active) {
          // Dynamic wave formula with varying frequencies and phase
          const sinVal1 = Math.sin((i / 4) + phase);
          const sinVal2 = Math.cos((i / 2) - phase * 1.5);
          const factor = Math.abs(sinVal1 * 0.6 + sinVal2 * 0.4);
          barHeight = 6 + factor * (h * 0.75);
        } else {
          // Subtle resting breathing wave
          barHeight = 4 + Math.sin(i / 3 + phase * 0.2) * 2;
        }

        const topY = centerY - barHeight / 2;

        // Gradient for bars
        const grad = ctx.createLinearGradient(0, topY, 0, topY + barHeight);
        if (isRecording) {
          grad.addColorStop(0, '#f43f5e'); // rose-500
          grad.addColorStop(1, '#be123c'); // rose-700
        } else {
          grad.addColorStop(0, '#34d399'); // emerald-400
          grad.addColorStop(0.5, color);
          grad.addColorStop(1, '#047857'); // emerald-700
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        const radius = Math.min(2, barWidth / 2 - 1);
        ctx.roundRect(x + 1.5, topY, Math.max(2, barWidth - 3), barHeight, radius);
        ctx.fill();
      }

      phase += active ? 0.08 : 0.015;
      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isPlaying, isRecording, color]);

  return (
    <div className="w-full flex items-center justify-center bg-slate-950/60 rounded-xl p-2 border border-slate-800/80 shadow-inner overflow-hidden">
      <canvas
        ref={canvasRef}
        width={360}
        height={height}
        className="w-full h-auto max-h-[60px]"
      />
    </div>
  );
};
