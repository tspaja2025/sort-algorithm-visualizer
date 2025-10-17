export const CONFIG = {
  colors: { accessed: "red", sorted: "green", default: "lightgray" },
  transitions: { speed: 0.2, spaceWidth: 0.1 },
  limits: { minSize: 2, maxSize: 1024, minDelay: 0, maxDelay: 100 },
  delayFactors: [
    { max: 20, factor: 1 / 10, precise: true },
    { max: 30, factor: 1 / 5 },
    { max: 40, factor: 1 / 4 },
    { max: 50, factor: 1 / 3 },
    { max: 60, factor: 1 / 2 },
    { max: 70, factor: 1 },
    { max: 80, factor: 1.5 },
    { max: 90, factor: 3 },
    { max: Infinity, factor: 5 },
  ],
} as const;
