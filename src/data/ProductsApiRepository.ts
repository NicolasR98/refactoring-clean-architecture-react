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

    async save(product: Product): Promise<void> {
        const remoteProduct = await this.storeApi.get(product.id);

        if (!remoteProduct) return;

        const editedRemoteProduct = {
            ...remoteProduct,
            price: Number(product.price.value),
        };

        await this.storeApi.post(editedRemoteProduct);
    }
}

// FIXME: Product mapping
export function buildProduct(remoteProduct: RemoteProduct): Product {
    return Product.create({
        id: remoteProduct.id,
        title: remoteProduct.title,
        image: remoteProduct.image,
        price: remoteProduct.price.toString(),
    });
}
