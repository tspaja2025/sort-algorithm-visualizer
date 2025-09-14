'use client';

import { SortElement } from '@/lib/types';
import { useEffect, useRef } from 'react';

export function BarsRender({ bars }: { bars: SortElement[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Get actual display size
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if canvas needs resizing
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    const { width, height } = canvas;

    // background
    context.fillStyle = 'lightgray';
    context.fillRect(0, 0, width, height);

    // bar calculations
    const spaceWidth = 0.2;
    const barWidth = (width - (bars.length - 1) * spaceWidth) / bars.length;
    const oneStepSize = height / bars.length;

    // draw bars
    for (let currentBar = 0; currentBar < bars.length; currentBar++) {
      const barSize = oneStepSize * bars[currentBar].value;

      if (bars[currentBar].access) {
        context.fillStyle = 'darkgreen';
      } else if (currentBar === bars[currentBar].value - 1) {
        context.fillStyle = 'lime';
      } else {
        context.fillStyle = 'gray';
      }

      context.fillRect(
        currentBar * (barWidth + spaceWidth),
        height - barSize,
        barWidth,
        barSize
      );
    }
  }, [bars]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}
