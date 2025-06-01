import { User } from "../presentation/context/AppContext";
import { ProductRepository } from "./ProductsRepository";

export class ActionNotAllowerError extends Error {}

export class UpdateProductPriceUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(user: User, productId: number, price: string): Promise<void> {
        if (!user.isAdmin) {
            throw new ActionNotAllowerError("Only admin users can edit the price of a product");
        }

        const product = await this.productRepository.getById(productId);

        const editedProduct = product.editPrice(price);

        return this.productRepository.save(editedProduct);
    }
}
