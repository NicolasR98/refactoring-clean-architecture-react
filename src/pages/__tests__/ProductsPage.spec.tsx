import { render, RenderResult, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, test } from "vitest";
import { AppProvider } from "../../context/AppProvider";
import { ProductsPage } from "../ProductsPage";
import { MockWebServer } from "../../tests/MockWebServer";
import productResponseJSON from "../__tests__/data/productsResponse.json";

const mockWebServer = new MockWebServer();

describe("<ProductsPage />", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("should display title", async () => {
        givenProducts();
        renderComponent(<ProductsPage />);
        await screen.findByRole("heading", { name: "Product price updater" });
    });
});

function givenProducts() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            httpStatusCode: 200,
            response: productResponseJSON,
        },
    ]);
}

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
