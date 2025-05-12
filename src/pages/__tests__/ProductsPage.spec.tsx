import { render, RenderResult, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { AppProvider } from "../../context/AppProvider";
import { MockWebServer } from "../../tests/MockWebServer";
import { ProductsPage } from "../ProductsPage";
import { givenNoProducts, givenProducts } from "./ProductsPage.fixture";
import {
    openDialog,
    typePrice,
    verifyDialog,
    verifyError,
    verifyHeader,
    verifyRows,
    waitTableToBeLoaded,
} from "./ProductsPage.helpers";

const mockWebServer = new MockWebServer();

describe("<ProductsPage />", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    describe("Table", () => {
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

    describe("Dialog", () => {
        test("should display a dialog with product info", async () => {
            const products = givenProducts(mockWebServer);
            const productIndex = 1;
            renderComponent(<ProductsPage />);
            await waitTableToBeLoaded();

            const dialog = await openDialog(productIndex);
            verifyDialog(dialog, products[productIndex]);
        });

        test("should display an error when introducing a negative price", async () => {
            givenProducts(mockWebServer);
            const productIndex = 1;
            renderComponent(<ProductsPage />);
            await waitTableToBeLoaded();

            const dialog = await openDialog(productIndex);

            await typePrice(dialog, "-100");
            await verifyError(dialog, "Invalid price format");
        });

        test("should display an error when introducing non numeric value", async () => {
            givenProducts(mockWebServer);
            const productIndex = 1;
            renderComponent(<ProductsPage />);
            await waitTableToBeLoaded();

            const dialog = await openDialog(productIndex);

            await typePrice(dialog, "hello world");
            await verifyError(dialog, "Only numbers are allowed");
        });

        test("should display an error when introducing value greater than max", async () => {
            givenProducts(mockWebServer);
            const productIndex = 1;
            renderComponent(<ProductsPage />);
            await waitTableToBeLoaded();

            const dialog = await openDialog(productIndex);

            await typePrice(dialog, "10000");
            await verifyError(dialog, "The max possible price is 999.99");
        });
    });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
