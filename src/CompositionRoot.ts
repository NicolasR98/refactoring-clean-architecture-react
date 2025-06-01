import { StoreApi } from "./data/api/StoreApi";
import { ProductApiRepository } from "./data/ProductsApiRepository";
import { GetProductByIdUseCase } from "./domain/GetProductByIdUseCase";
import { GetProductsUseCase } from "./domain/GetProductsUseCase";
import { UpdateProductPriceUseCase } from "./domain/UpdateProductPriceUseCase";

export class CompositionRoot {
    private storeApi = new StoreApi();
    private repository = new ProductApiRepository(this.storeApi);

    private static instance: CompositionRoot;

    constructor() {}

    public static getInstance(): CompositionRoot {
        if (!CompositionRoot.instance) {
            CompositionRoot.instance = new CompositionRoot();
        }

        return CompositionRoot.instance;
    }

    provideGetProductsUseCase(): GetProductsUseCase {
        return new GetProductsUseCase(this.repository);
    }

    provideGetProductByIdUseCase(): GetProductByIdUseCase {
        return new GetProductByIdUseCase(this.repository);
    }

    provideUpdateProductPriceUseCase(): UpdateProductPriceUseCase {
        return new UpdateProductPriceUseCase(this.storeApi);
    }

    provideStoreApi(): StoreApi {
        return this.storeApi;
    }
}
