import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

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
});
