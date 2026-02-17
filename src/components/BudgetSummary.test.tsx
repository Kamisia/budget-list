import { render, screen, within } from "@testing-library/react";
import { BudgetSummary } from "./BudgetSummary";

describe("BudgetSummary", () => {
  it("renders non-over budget with green remaining values", () => {
    render(
      <BudgetSummary
        budget={1000}
        onBudgetChange={jest.fn()}
        totals={{
          plannedTotal: 300,
          spentTotal: 200,
          plannedRemaining: 700,
          actualRemaining: 800,
          plannedOver: false,
          actualOver: false,
        }}
      />
    );

    const plannedCard = screen.getByTestId("planned-card");
    const actualCard = screen.getByTestId("actual-card");

    expect(within(plannedCard).getByText(/700/)).toHaveClass("text-green-300");
    expect(within(actualCard).getByText(/800/)).toHaveClass("text-green-300");
  });

  it("renders over-budget state with red styling", () => {
    render(
      <BudgetSummary
        budget={1000}
        onBudgetChange={jest.fn()}
        totals={{
          plannedTotal: 1300,
          spentTotal: 1100,
          plannedRemaining: -300,
          actualRemaining: -100,
          plannedOver: true,
          actualOver: true,
        }}
      />
    );

    const plannedCard = screen.getByTestId("planned-card");
    const actualCard = screen.getByTestId("actual-card");

    expect(plannedCard.className).toContain("border-red-700");
    expect(actualCard.className).toContain("border-red-700");
    expect(within(plannedCard).getByText(/-300/)).toHaveClass("text-red-300");
    expect(within(actualCard).getByText(/-100/)).toHaveClass("text-red-300");
  });
});
