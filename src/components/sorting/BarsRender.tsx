"use client";

import { useEffect, useRef } from "react";
import { CONFIG } from "@/lib/config";
import type { BarsRenderProps } from "@/lib/types";

export function BarsRender({
  bars,
  spaceWidth = CONFIG.transitions.spaceWidth,
  backgroundColor = "gray",
  colors = CONFIG.colors,
  transitionSpeed = CONFIG.transitions.speed,
}: BarsRenderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentHeightsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      if (canvas.width !== canvas.clientWidth)
        canvas.width = canvas.clientWidth;
      if (canvas.height !== canvas.clientHeight)
        canvas.height = canvas.clientHeight;
    };

    if (currentHeightsRef.current.length !== bars.length)
      currentHeightsRef.current = bars.map(() => 0);

    let raf: number;
    const draw = () => {
      resize();
      const { width, height } = canvas;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      const barWidth = (width - (bars.length - 1) * spaceWidth) / bars.length;
      const step = height / bars.length;

      bars.forEach((bar, i) => {
        const targetHeight = step * bar.value;
        const current = currentHeightsRef.current[i] ?? 0;
        const newHeight = current + (targetHeight - current) * transitionSpeed;
        currentHeightsRef.current[i] = newHeight;

        ctx.fillStyle = bar.access
          ? colors.accessed
          : i === bar.value - 1
            ? colors.sorted
            : colors.default;

        const x = i * (barWidth + spaceWidth);
        const y = height - newHeight;
        ctx.fillRect(x, y, barWidth, newHeight);
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [bars, spaceWidth, backgroundColor, colors, transitionSpeed]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
