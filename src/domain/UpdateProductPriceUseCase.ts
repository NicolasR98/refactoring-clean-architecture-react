import { StoreApi } from "../data/api/StoreApi";
import { User } from "../presentation/context/AppContext";

export class ActionNotAllowerError extends Error {}

export class UpdateProductPriceUseCase {
    constructor(private storeApi: StoreApi) {}

    async execute(user: User, productId: number, price: string): Promise<void> {
        if (!user.isAdmin) {
            throw new ActionNotAllowerError("Only admin users can edit the price of a product");
        }

        const remoteProduct = await this.storeApi.get(productId);

        if (!remoteProduct) return;

        const editedRemoteProduct = {
            ...remoteProduct,
            price: Number(price),
        };

        await this.storeApi.post(editedRemoteProduct);
    }
}
