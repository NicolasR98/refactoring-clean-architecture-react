import { useCallback, useEffect, useState } from "react";
import { GetProductByIdUseCase, ResourceNotFoundError } from "../../domain/GetProductByIdUseCase";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { Price, ValidationError } from "../../domain/Price";
import { Product, ProductData, ProductStatus } from "../../domain/Product";
import {
    ActionNotAllowerError,
    UpdateProductPriceUseCase,
} from "../../domain/UpdateProductPriceUseCase";
import { useAppContext } from "../context/useAppContext";
import { useReload } from "../hooks/useReload";

export type Message = { type: "error" | "success"; message: string };

export type ProductViewModel = ProductData & { status: ProductStatus };

export function useProducts(
    getProductsUseCase: GetProductsUseCase,
    getProducByIdUseCase: GetProductByIdUseCase,
    updateProductPriceUseCase: UpdateProductPriceUseCase
) {
    const { currentUser } = useAppContext();

    const [products, setProducts] = useState<ProductViewModel[]>([]);
    const [editingProduct, setEditingProduct] = useState<ProductViewModel | undefined>(undefined);
    const [message, setMessage] = useState<Message | undefined>();
    const [priceError, setPriceError] = useState<string | undefined>(undefined);

    const [reloadKey, reload] = useReload();

    useEffect(() => {
        getProductsUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);
            setProducts(products.map(buildProductViewModel));
        });
    }, [getProductsUseCase, reloadKey]);

    function onChangePrice(price: string): void {
        if (!editingProduct) return;

        try {
            setEditingProduct({ ...editingProduct, price: price });
            Price.create(price);
            setPriceError(undefined);
        } catch (error) {
            if (error instanceof ValidationError) {
                setPriceError(error.message);
            } else {
                setPriceError("Unexpected error has occurred");
            }
        }
    }

    // FIXME: User validation
    const updatingQuantity = useCallback(
        async (id: number) => {
            if (id) {
                if (!currentUser.isAdmin) {
                    setMessage({
                        type: "error",
                        message: "Only admin users can edit the price of a product",
                    });
                    return;
                }

                try {
                    const product = await getProducByIdUseCase.execute(id);
                    setEditingProduct(buildProductViewModel(product));
                } catch (error) {
                    if (error instanceof ResourceNotFoundError) {
                        setMessage({ type: "error", message: error.message });
                    } else {
                        setMessage({ type: "error", message: "Unexpected error has occurred" });
                    }
                }
            }
        },
        [currentUser.isAdmin, getProducByIdUseCase]
    );

    const cancelEditPrice = useCallback(() => {
        setEditingProduct(undefined);
    }, []);

    const onCloseMessage = useCallback(() => {
        setMessage(undefined);
    }, []);

    async function saveEditPrice(): Promise<void> {
        if (!editingProduct) return;

        try {
            await updateProductPriceUseCase.execute(
                currentUser,
                editingProduct.id,
                editingProduct.price
            );
            setMessage({
                type: "success",
                message: `Price ${editingProduct.price} for '${editingProduct.title}' updated`,
            });
            setEditingProduct(undefined);
            reload();
        } catch (error) {
            if (error instanceof ActionNotAllowerError) {
                setMessage({
                    type: "error",
                    message: error.message,
                });
            } else {
                setMessage({
                    type: "error",
                    message: `An error has ocurred updating the price ${editingProduct.price} for '${editingProduct.title}'`,
                });
                setEditingProduct(undefined);
                reload();
            }
        }
    }

    return {
        products,
        editingProduct,
        message,
        priceError,
        updatingQuantity,
        cancelEditPrice,
        onCloseMessage,
        onChangePrice,
        saveEditPrice,
    };
}

export function buildProductViewModel(product: Product): ProductViewModel {
    return {
        ...product,
        price: product.price.value.toFixed(2),
    };
}
