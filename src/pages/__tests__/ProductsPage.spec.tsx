import { render, RenderResult, screen } from "@testing-library/react";
import { test } from "vitest";
import { ProductsPage } from "../ProductsPage";
import { ReactNode } from "react";
import { AppProvider } from "../../context/AppProvider";

test("should display title", async () => {
    renderComponent(<ProductsPage />);
    await screen.findByRole("heading", { name: "Product price updater" });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(
        <AppProvider>
            {component}
        </AppProvider>
    )
}
