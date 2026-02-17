import { moneyPLN } from "./money";

describe("moneyPLN", () => {
  it("formats number using pl-PL locale and PLN currency", () => {
    const formatMock = jest.fn().mockReturnValue("mocked-value");
    const numberFormatSpy = jest
      .spyOn(Intl, "NumberFormat")
      .mockImplementation(
        () =>
          ({
            format: formatMock,
          } as unknown as Intl.NumberFormat)
      );

    const result = moneyPLN(123.45);

    expect(result).toBe("mocked-value");
    expect(numberFormatSpy).toHaveBeenCalledWith("pl-PL", {
      style: "currency",
      currency: "PLN",
    });
    expect(formatMock).toHaveBeenCalledWith(123.45);

    numberFormatSpy.mockRestore();
  });
});
