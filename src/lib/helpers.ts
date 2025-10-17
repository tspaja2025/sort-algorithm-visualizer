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
