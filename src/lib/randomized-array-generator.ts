export function generateArray(size: number): number[] {
  return Array.from({ length: size }, (_value, index) => index + 1);
}

export function shuffle<T>(array: Array<T>): Array<T> {
  const newArray = [...array]; // Create a copy
  for (let i = newArray.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    // Swap elements
    [newArray[i], newArray[randomIndex]] = [newArray[randomIndex], newArray[i]];
  }
  return newArray;
}
