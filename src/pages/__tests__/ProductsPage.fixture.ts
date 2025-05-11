import { RemoteProduct } from "../../api/StoreApi";
import { MockWebServer } from "../../tests/MockWebServer";
import productResponseJSON from "../__tests__/data/productsResponse.json";

export function givenProducts(mockWebServer: MockWebServer): RemoteProduct[] {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            httpStatusCode: 200,
            response: productResponseJSON,
        },
    ]);

    return productResponseJSON;
}

export function givenNoProducts(mockWebServer: MockWebServer) {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            httpStatusCode: 200,
            response: [],
        },
    ]);
}
