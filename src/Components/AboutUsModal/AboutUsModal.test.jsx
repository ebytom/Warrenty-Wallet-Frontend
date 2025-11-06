/* eslint-disable testing-library/no-unnecessary-act */
import React, { createRef } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import AboutUsModal from "./AboutUsModal";

// Mock Ant Design Modal to simplify DOM rendering
jest.mock("antd", () => ({
  Modal: ({ title, open, onOk, onCancel, children }) => (
    <div data-testid="modal" style={{ display: open ? "block" : "none" }}>
      <h2>{title}</h2>
      {children}
      <button data-testid="ok-btn" onClick={onOk}>
        OK
      </button>
      <button data-testid="cancel-btn" onClick={onCancel}>
        Cancel
      </button>
    </div>
  ),
}));

describe("AboutUsModal Component", () => {
  test("modal is hidden initially", () => {
    const ref = createRef();
    render(<AboutUsModal ref={ref} />);
    const modal = screen.getByTestId("modal");
    expect(modal).toHaveStyle("display: none");
  });

  test("modal becomes visible when showModal() is called", async () => {
    const ref = createRef();
    render(<AboutUsModal ref={ref} />);

    await act(async () => {
      ref.current.showModal(); // 👈 wrap in act()
    });

    const modal = screen.getByTestId("modal");
    expect(modal).toHaveStyle("display: block");
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome to Warranty Wallet/i)
    ).toBeInTheDocument();
  });

  test("modal closes when clicking OK or Cancel", async () => {
    const ref = createRef();
    render(<AboutUsModal ref={ref} />);

    await act(async () => {
      ref.current.showModal(); // 👈 open modal within act()
    });

    const modal = screen.getByTestId("modal");
    expect(modal).toHaveStyle("display: block");

    // Click OK
    await act(async () => {
      fireEvent.click(screen.getByTestId("ok-btn"));
    });
    expect(modal).toHaveStyle("display: none");

    // Reopen modal and test Cancel
    await act(async () => {
      ref.current.showModal();
    });
    expect(modal).toHaveStyle("display: block");

    await act(async () => {
      fireEvent.click(screen.getByTestId("cancel-btn"));
    });
    expect(modal).toHaveStyle("display: none");
  });
});
