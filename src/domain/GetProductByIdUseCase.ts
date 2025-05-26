import { Product } from "./Product";
import { ProductRepository } from "./ProductsRepository";

export class ResourceNotFoundError extends Error {}

export class GetProductByIdUseCase {
    constructor(private productsRepository: ProductRepository) {}

    async execute(productId: number): Promise<Product> {
        try {
            return await this.productsRepository.getById(productId);
        } catch (error) {
            throw new ResourceNotFoundError(`Product with id ${productId} not found`);
        }
    }
}
