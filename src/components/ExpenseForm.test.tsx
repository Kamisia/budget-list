import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpenseForm from "./ExpenseForm";
import { CATEGORIES } from "../types/budget";

describe("ExpenseForm", () => {
  it("does not submit when name is empty", async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();

    render(<ExpenseForm categories={CATEGORIES} onAdd={onAdd} />);

    await user.type(screen.getByPlaceholderText(/Kwota/i), "100");
    await user.click(screen.getByRole("button", { name: /Dodaj/i }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it("does not submit when price is invalid", async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();

    render(<ExpenseForm categories={CATEGORIES} onAdd={onAdd} />);

    await user.type(screen.getByPlaceholderText(/Nazwa/i), "Gaz");
    await user.type(screen.getByPlaceholderText(/Kwota/i), "0");
    await user.click(screen.getByRole("button", { name: /Dodaj/i }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it("submits trimmed name, rounded price and resets fields", async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();

    render(<ExpenseForm categories={CATEGORIES} onAdd={onAdd} />);

    const nameInput = screen.getByPlaceholderText(/Nazwa/i);
    const priceInput = screen.getByPlaceholderText(/Kwota/i);
    const categorySelect = screen.getByRole("combobox");
    const qtyInput = document.querySelector('input[min="1"]') as HTMLInputElement;

    await user.type(nameInput, "  Chleb  ");
    await user.selectOptions(categorySelect, "Inne");
    await user.type(priceInput, "12.345");
    fireEvent.change(qtyInput, { target: { value: "2" } });
    await user.click(screen.getByRole("button", { name: /Dodaj/i }));

    expect(onAdd).toHaveBeenCalledWith({
      name: "Chleb",
      category: "Inne",
      price: 12.35,
      qty: 2,
    });

    expect(nameInput).toHaveValue("");
    expect(priceInput).toHaveValue(null);
    expect(qtyInput).toHaveValue(1);
  });

  it("clamps qty to minimum 1", async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();

    render(<ExpenseForm categories={CATEGORIES} onAdd={onAdd} />);

    const qtyInput = document.querySelector('input[min="1"]') as HTMLInputElement;
    fireEvent.change(qtyInput, { target: { value: "0" } });

    expect(qtyInput).toHaveValue(1);
  });
});
