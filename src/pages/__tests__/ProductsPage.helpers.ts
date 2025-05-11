import { screen, waitFor, within } from "@testing-library/react";
import { RemoteProduct } from "../../api/StoreApi";
import { expect } from "vitest";

export function verifyHeader(headerRow: HTMLElement): void {
    const headerScope = within(headerRow);
    const cells = headerScope.getAllByRole("columnheader");

    within(cells[0]).getByText("ID");
    within(cells[1]).getByText("Title");
    within(cells[2]).getByText("Image");
    within(cells[3]).getByText("Price");
    within(cells[4]).getByText("Status");
}

export function verifyRows(rows: HTMLElement[], products: RemoteProduct[]): void {
    expect(rows.length).toBe(products.length);

    rows.forEach((row, index) => {
        const rowScope = within(row);
        const cells = rowScope.getAllByRole("cell");

        expect(cells.length).toBe(6);

        const product = products[index];

        within(cells[0]).getByText(product.id);
        within(cells[1]).getByText(product.title);

        const image: HTMLImageElement = within(cells[2]).getByRole("img");
        expect(image.src).toBe(products[index].image);

        within(cells[3]).getByText(`$${product.price.toFixed(2)}`);
        within(cells[4]).getByText(+product.price === 0 ? "inactive" : "active");
    });
}

export async function waitTableToBeLoaded(): Promise<void> {
    await waitFor(async () => {
        expect((await screen.findAllByRole("row")).length).toBeGreaterThan(1);
    });
}
