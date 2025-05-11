import { render, RenderResult, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { AppProvider } from "../../context/AppProvider";
import { MockWebServer } from "../../tests/MockWebServer";
import { ProductsPage } from "../ProductsPage";
import { givenNoProducts, givenProducts } from "./ProductsPage.fixture";
import { verifyHeader, verifyRows, waitTableToBeLoaded } from "./ProductsPage.helpers";

const mockWebServer = new MockWebServer();

describe("<ProductsPage />", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("should display title", async () => {
        givenProducts(mockWebServer);
        renderComponent(<ProductsPage />);
        await screen.findByRole("heading", { name: "Product price updater" });
    });

    test("should display an empty table if no data", async () => {
        givenNoProducts(mockWebServer);
        renderComponent(<ProductsPage />);
        const rows = await screen.findAllByRole("row");

        expect(rows.length).toBe(1);
        verifyHeader(rows[0]);
    });

    test("should display the correct headers and rows", async () => {
        const products = givenProducts(mockWebServer);
        renderComponent(<ProductsPage />);
        await waitTableToBeLoaded();

        const [headerRow, ...rows] = await screen.findAllByRole("row");

        verifyHeader(headerRow);
        verifyRows(rows, products);
    });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
