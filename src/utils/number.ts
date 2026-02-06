export function clampMin(n: number, min: number): number {
  return n < min ? min : n;
}