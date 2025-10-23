"use client";

import { CONFIG } from "@/lib/sort-utils";
import { BarsRenderProps } from "@/lib/types";
import { useEffect, useRef } from "react";

export function BarsRender({
  bars,
  spaceWidth = CONFIG.transitions.spaceWidth,
  transitionSpeed = CONFIG.transitions.speed,
}: BarsRenderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentHeightsRef = useRef<number[]>([]);
  const prevAccessedRef = useRef<Set<number>>(new Set());

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

    const isDark = document.documentElement.classList.contains("dark");
    const colors = isDark
      ? {
          accessed: "#f43f5e",
          sorted: "#10b981",
          default: "#1e293b",
          grid: "#374151",
        }
      : {
          accessed: "#f87171",
          sorted: "#34d399",
          default: "#cbd5e1",
          grid: "#e5e7eb",
        };

    if (currentHeightsRef.current.length !== bars.length)
      currentHeightsRef.current = bars.map(() => 0);

    let raf: number;
    const draw = () => {
      resize();
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Dynamic scaling parameters
      const count = bars.length;
      const normalizedCount = Math.min(Math.max(count, 10), 1024);
      const density = normalizedCount / 1024; // 0 → small array, 1 → large array
      const gridLines = Math.round(10 + 10 * density); // denser grid for large arrays
      const colorSaturation = 80 - density * 30; // more muted for large arrays
      const colorLightness = 55 - density * 10;
      const baseShadowBlur = 10 - density * 6;

      // Grid background
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < gridLines; i++) {
        const y = (i / gridLines) * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Adjust bar spacing and width based on density
      const adjustedSpace = spaceWidth * (1 + density * 2);
      const barWidth = Math.max(
        (width - (count - 1) * adjustedSpace) / count,
        1.5,
      );
      const step = height / count;
      const newAccessed = new Set<number>();

      bars.forEach((bar, i) => {
        const targetHeight = step * bar.value;
        const current = currentHeightsRef.current[i] ?? 0;

        // Smooth easing (ease-out)
        const easedT = 1 - Math.pow(1 - transitionSpeed, 3);
        const newHeight = current + (targetHeight - current) * easedT;
        currentHeightsRef.current[i] = newHeight;

        // Pulse effect for accessed bars
        const pulse =
          bar.access || prevAccessedRef.current.has(i)
            ? 1.05 - Math.random() * 0.02
            : 1.0;

        // Dynamic gradient hue
        const hue = (bar.value / bars.length) * 240;
        const gradient = ctx.createLinearGradient(
          0,
          height - newHeight,
          0,
          height,
        );
        gradient.addColorStop(
          0,
          `hsl(${hue}, ${colorSaturation}%, ${colorLightness + 10}%)`,
        );
        gradient.addColorStop(
          1,
          `hsl(${hue}, ${colorSaturation}%, ${colorLightness - 5}%)`,
        );

        // Choose color
        ctx.fillStyle = bar.access
          ? colors.accessed
          : i === bar.value - 1
            ? colors.sorted
            : gradient;

        // Shadow/glow for accessed bars
        if (bar.access) {
          ctx.shadowColor = "rgba(255, 75, 75, 0.6)";
          ctx.shadowBlur = baseShadowBlur + 5;
          newAccessed.add(i);
        } else {
          ctx.shadowBlur = 0;
        }

        const x = i * (barWidth + adjustedSpace);
        const y = height - newHeight * pulse;

        // Rounded bars
        const radius = Math.max(1, barWidth * 0.3);
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, newHeight * pulse, radius);
        ctx.fill();
      });

      prevAccessedRef.current = newAccessed;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [bars, spaceWidth, transitionSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg bg-transparent select-none"
    />
  );
}
