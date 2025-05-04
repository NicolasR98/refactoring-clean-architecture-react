import { render, screen } from "@testing-library/react";
import { test } from "vitest";
import App from "../../App";

test("should display title", () => {
    render(<App />);

    screen.getByRole("heading", { name: "Product price updater" });
});
