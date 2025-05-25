import { Product } from "./Product";
import { ProductRepository } from "./ProductsRepository";

export class GetProductsUseCase {
    constructor(private productsRepository: ProductRepository) {}

    async execute(): Promise<Product[]> {
        return await this.productsRepository.getAll();
    }
}
