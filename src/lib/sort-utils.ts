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

export const generateArray = (size: number) =>
  Array.from({ length: size }, (_, i) => i + 1);

export const shuffle = <T>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const slugify = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-");

export const computeRealDelay = (delay: number) => {
  const match = CONFIG.delayFactors.find((f) => delay <= f.max);
  if (!match) return delay;
  const { factor } = match;
  const precise = (match as any).precise ?? false;
  return precise
    ? Math.round(delay * factor * 10) / 10
    : Math.round(delay * factor);
};
