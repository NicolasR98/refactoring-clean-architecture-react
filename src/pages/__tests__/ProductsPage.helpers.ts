import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";
import { RemoteProduct } from "../../api/StoreApi";

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

export async function openDialog(index: number): Promise<HTMLElement> {
    await tryOpenDialog(index);

    return await screen.findByRole("dialog");
}

export function verifyDialog(dialog: HTMLElement, product: RemoteProduct) {
    const dialogScope = within(dialog);

    // Check image
    const image: HTMLImageElement = dialogScope.getByRole("img");
    expect(image.src).toBe(product.image);

    // Check title
    dialogScope.getByText(product.title);

    // Check price
    dialogScope.getByDisplayValue(product.price.toFixed(2));
}

export async function typePrice(dialog: HTMLElement, price: string): Promise<void> {
    const dialogScope = within(dialog);
    const priceField = dialogScope.getByRole("textbox", { name: "Price" });

    await userEvent.clear(priceField);
    await userEvent.type(priceField, price);
}

export async function verifyError(dialog: HTMLElement, error: string): Promise<void> {
    const dialogScope = within(dialog);

    await dialogScope.findByText(error);
}

export async function savePrice(dialog: HTMLElement): Promise<void> {
    const dialogScope = within(dialog);

    await userEvent.click(dialogScope.getByRole("button", { name: /save/i }));
}

export async function verifyProductRowPriceAndStatus(
    index: number,
    price: string,
    status: string
): Promise<void> {
    const [, ...rows] = await screen.findAllByRole("row");
    const rowScope = within(rows[index]);
    const cells = rowScope.getAllByRole("cell");

    within(cells[3]).getByText(`$${Number(price).toFixed(2)}`);
    within(cells[4]).getByText(status);
}

export async function tryOpenDialog(index: number): Promise<void> {
    const [, ...rows] = await screen.findAllByRole("row");
    const selectedRowScope = within(rows[index]);

    await userEvent.click(selectedRowScope.getByRole("menuitem"));
    const updatePriceMenu = await screen.findByRole("menuitem", { name: /update price/i });
    await userEvent.click(updatePriceMenu);
}

export async function changeToNonAdminUser(): Promise<void> {
    await userEvent.click(screen.getByRole("button", { name: /user: admin user/i }));
    await userEvent.click(screen.getByRole("menuitem", { name: /non admin user/i }));
}
