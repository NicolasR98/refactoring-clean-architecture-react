import { Product } from "../domain/Product";
import { ProductRepository } from "../domain/ProductsRepository";
import { RemoteProduct, StoreApi } from "./api/StoreApi";

export class ProductApiRepository implements ProductRepository {
    constructor(private storeApi: StoreApi) {}

    async getAll(): Promise<Product[]> {
        const productsReponse = await this.storeApi.getAll();
        return productsReponse.map(buildProduct);
    }

    async getById(productId: number): Promise<Product> {
        const productResponse = await this.storeApi.get(productId);
        return buildProduct(productResponse);
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
