import { RemoteProduct, StoreApi } from "../data/api/StoreApi";
import { Product } from "./Product";

export class GetProductsUseCase {
    constructor(private storeApi: StoreApi) {}

    async execute(): Promise<Product[]> {
        const productsReponse = await this.storeApi.getAll();
        return productsReponse.map(buildProduct);
    }
}

// FIXME: Product mapping
export function buildProduct(remoteProduct: RemoteProduct): Product {
    return {
        id: remoteProduct.id,
        title: remoteProduct.title,
        image: remoteProduct.image,
        price: remoteProduct.price.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }),
    };
}
