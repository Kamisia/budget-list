import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpenseRow from "./ExpenseRow";
import type { Item } from "../types/budget";

function createItem(overrides: Partial<Item> = {}): Item {
  return {
    id: "row-1",
    name: "Internet",
    category: "Rachunki",
    price: 100,
    qty: 1,
    bought: false,
    ...overrides,
  };
}

describe("ExpenseRow", () => {
  it("calls onToggleBought when checkbox is clicked", async () => {
    const user = userEvent.setup();
    const onToggleBought = jest.fn();

    render(
      <ul>
        <ExpenseRow
          item={createItem()}
          onToggleBought={onToggleBought}
          onRemove={jest.fn()}
          onUpdateQty={jest.fn()}
        />
      </ul>
    );

    await user.click(screen.getByRole("checkbox"));
    expect(onToggleBought).toHaveBeenCalledWith("row-1");
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();

    render(
      <ul>
        <ExpenseRow
          item={createItem()}
          onToggleBought={jest.fn()}
          onRemove={onRemove}
          onUpdateQty={jest.fn()}
        />
      </ul>
    );

    await user.click(screen.getByRole("button", { name: /Usu/i }));
    expect(onRemove).toHaveBeenCalledWith("row-1");
  });

  it("calls onUpdateQty with clamped value", async () => {
    const user = userEvent.setup();
    const onUpdateQty = jest.fn();

    render(
      <ul>
        <ExpenseRow
          item={createItem()}
          onToggleBought={jest.fn()}
          onRemove={jest.fn()}
          onUpdateQty={onUpdateQty}
        />
      </ul>
    );

    const qtyInput = screen.getByRole("spinbutton");
    await user.clear(qtyInput);
    await user.type(qtyInput, "0");

    expect(onUpdateQty).toHaveBeenCalledWith("row-1", 1);
  });

  it("disables qty input when item is already bought", () => {
    render(
      <ul>
        <ExpenseRow
          item={createItem({ bought: true })}
          onToggleBought={jest.fn()}
          onRemove={jest.fn()}
          onUpdateQty={jest.fn()}
        />
      </ul>
    );

    expect(screen.getByRole("spinbutton")).toBeDisabled();
  });
});
