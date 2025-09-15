'use client';

import { SortElement, BarsRenderProps } from '@/lib/types';
import { useEffect, useRef } from 'react';

export function BarsRender({
  bars,
  spaceWidth = 0.2,
  backgroundColor = 'lightgray',
  colors = {
    accessed: 'darkgreen',
    sorted: 'lime',
    default: 'gray',
  },
  transitionSpeed = 0.2,
}: BarsRenderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>(0);
  const currentHeightsRef = useRef<number[]>([]);

  // Bar Color
  const getBarColor = (bar: SortElement, index: number) => {
    if (bar.access) return colors.accessed;
    if (index === bar.value - 1) return colors.sorted;
    return colors.default;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Resize canvas to match display size
    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
    };

    // Initialize heights if first run or bars length changed
    if (currentHeightsRef.current.length !== bars.length) {
      currentHeightsRef.current = bars.map(() => 0);
    }

    const draw = () => {
      resizeCanvas();
      const { width, height } = canvas;

      // background
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);

      if (bars.length === 0) return;

      // bar calculations
      const barWidth = (width - (bars.length - 1) * spaceWidth) / bars.length;
      const oneStepSize = height / bars.length;

      // update + draw bars
      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i];
        const targetHeight = oneStepSize * bar.value;

        // Smooth transition using lerp
        const current = currentHeightsRef.current[i] ?? 0;
        const newHeight = current + (targetHeight - current) * transitionSpeed;
        currentHeightsRef.current[i] = newHeight;

        context.fillStyle = getBarColor(bar, i);

        // Pixel snap for sharp edges
        const x = Math.floor(i * (barWidth + spaceWidth));
        const y = Math.floor(height - newHeight);
        const w = Math.floor(barWidth);
        const h = Math.floor(newHeight);

        context.fillRect(x, y, w, h);
      }
    };

    // animation loop
    const loop = () => {
      draw();
      animationRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [bars, spaceWidth, backgroundColor, colors, transitionSpeed]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}
