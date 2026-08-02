import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WizardSteps } from "./WizardSteps";

const STEPS = [
  { id: "a", label: "Amount", content: <p>amount body</p> },
  { id: "b", label: "Review", content: <p>review body</p> },
];

describe("WizardSteps", () => {
  it("advances with Next and finishes on last step", async () => {
    const onComplete = vi.fn();
    render(<WizardSteps steps={STEPS} onComplete={onComplete} finishLabel="Send" />);
    expect(screen.getByText("amount body")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("review body")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("Back returns to the previous step", async () => {
    render(<WizardSteps steps={STEPS} />);
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText("amount body")).toBeTruthy();
  });
});
