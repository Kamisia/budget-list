import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { STORAGE_KEY } from "./utils/storage";

function getBudgetInput() {
  const label = screen.getByText(/Budżet miesięczny/i).closest("label");
  if (!label) throw new Error("Budget label not found");
  return within(label).getByRole("spinbutton");
}

describe("App integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds expense and updates planned remaining", async () => {
    const user = userEvent.setup();
    render(<App />);

    const budgetInput = getBudgetInput();
    await user.clear(budgetInput);
    await user.type(budgetInput, "1000");

    await user.type(screen.getByPlaceholderText(/Nazwa/i), "Czynsz");
    await user.type(screen.getByPlaceholderText(/Kwota/i), "200");
    await user.click(screen.getByRole("button", { name: /Dodaj/i }));

    expect(screen.getByText("Czynsz")).toBeInTheDocument();

    const plannedCard = screen.getByTestId("planned-card");
    expect(within(plannedCard).getByText(/Zostanie/i)).toBeInTheDocument();
    expect(within(plannedCard).getByText((t) => t.includes("800"))).toBeInTheDocument();
  });

  it("marking expense as paid updates actual remaining", async () => {
    const user = userEvent.setup();
    render(<App />);

    const budgetInput = getBudgetInput();
    await user.clear(budgetInput);
    await user.type(budgetInput, "1000");

    await user.type(screen.getByPlaceholderText(/Nazwa/i), "Netflix");
    await user.type(screen.getByPlaceholderText(/Kwota/i), "50");
    await user.click(screen.getByRole("button", { name: /Dodaj/i }));

    await user.click(screen.getByRole("checkbox", { name: /opłacone/i }));

    const actualCard = screen.getByTestId("actual-card");
    expect(within(actualCard).getByText(/Do dyspozycji/i)).toBeInTheDocument();
    expect(within(actualCard).getByText((t) => t.includes("950"))).toBeInTheDocument();
  });

  it("updates qty and recalculates planned remaining", async () => {
    const user = userEvent.setup();
    render(<App />);

    const budgetInput = getBudgetInput();
    await user.clear(budgetInput);
    await user.type(budgetInput, "1000");

    await user.type(screen.getByPlaceholderText(/Nazwa/i), "Zakupy");
    await user.type(screen.getByPlaceholderText(/Kwota/i), "100");
    await user.click(screen.getByRole("button", { name: /Dodaj/i }));

    const row = screen.getByText("Zakupy").closest("li");
    if (!row) throw new Error("Expense row not found");

    const qtyInput = within(row).getByRole("spinbutton");
    fireEvent.change(qtyInput, { target: { value: "3" } });

    const plannedCard = screen.getByTestId("planned-card");
    expect(within(plannedCard).getByText((t) => t.includes("700"))).toBeInTheDocument();
  });

  it("removes expense from the list", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText(/Nazwa/i), "Internet");
    await user.type(screen.getByPlaceholderText(/Kwota/i), "120");
    await user.click(screen.getByRole("button", { name: /Dodaj/i }));
    expect(screen.getByText("Internet")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Usu/i }));
    expect(screen.queryByText("Internet")).not.toBeInTheDocument();
  });

  it("resets state to defaults", async () => {
    const user = userEvent.setup();
    render(<App />);

    const budgetInput = getBudgetInput();
    await user.clear(budgetInput);
    await user.type(budgetInput, "1500");

    await user.type(screen.getByPlaceholderText(/Nazwa/i), "Prad");
    await user.type(screen.getByPlaceholderText(/Kwota/i), "300");
    await user.click(screen.getByRole("button", { name: /Dodaj/i }));
    expect(screen.getByText("Prad")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Reset/i }));

    expect(getBudgetInput()).toHaveValue(5000);
    expect(screen.queryByText("Prad")).not.toBeInTheDocument();
    expect(screen.getByText(/Brak wpis/i)).toBeInTheDocument();

    await waitFor(() => {
      const savedRaw = localStorage.getItem(STORAGE_KEY);
      expect(savedRaw).not.toBeNull();
      expect(JSON.parse(savedRaw as string)).toEqual({
        budget: 5000,
        items: [],
      });
    });
  });

  it("loads initial state from localStorage", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        budget: 2400,
        items: [
          {
            id: "seed-1",
            name: "Czynsz",
            category: "Rachunki",
            price: 1200,
            qty: 1,
            bought: false,
          },
        ],
      })
    );

    render(<App />);

    expect(getBudgetInput()).toHaveValue(2400);
    expect(screen.getByText("Czynsz")).toBeInTheDocument();
  });

  it("updates only selected item when multiple expenses exist", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        budget: 3000,
        items: [
          {
            id: "first",
            name: "A",
            category: "Rachunki",
            price: 100,
            qty: 1,
            bought: false,
          },
          {
            id: "second",
            name: "B",
            category: "Rachunki",
            price: 200,
            qty: 1,
            bought: false,
          },
        ],
      })
    );

    render(<App />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();

    const firstRow = screen.getByText("A").closest("li");
    const secondRow = screen.getByText("B").closest("li");
    if (!firstRow || !secondRow) throw new Error("Rows not found");

    fireEvent.change(within(firstRow).getByRole("spinbutton"), {
      target: { value: "3" },
    });

    expect(within(firstRow).getByRole("spinbutton")).toHaveValue(3);
    expect(within(secondRow).getByRole("spinbutton")).toHaveValue(1);
  });
});
