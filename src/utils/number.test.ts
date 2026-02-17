import { clampMin } from "./number";

describe("clampMin", () => {
  it("returns min when value is lower than min", () => {
    expect(clampMin(-5, 0)).toBe(0);
    expect(clampMin(2, 3)).toBe(3);
  });

  it("returns value when value is equal or greater than min", () => {
    expect(clampMin(3, 3)).toBe(3);
    expect(clampMin(10, 3)).toBe(10);
  });
});
