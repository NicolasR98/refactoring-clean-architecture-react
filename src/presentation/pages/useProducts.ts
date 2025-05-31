import { useCallback, useEffect, useState } from "react";
import { RemoteProduct } from "../../data/api/StoreApi";
import { GetProductByIdUseCase, ResourceNotFoundError } from "../../domain/GetProductByIdUseCase";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { useReload } from "../hooks/useReload";

export function useProducts(
    getProductsUseCase: GetProductsUseCase,
    getProducByIdUseCase: GetProductByIdUseCase
) {
    const { currentUser } = useAppContext();

    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [error, setError] = useState<string>();
    const [priceError, setPriceError] = useState<string | undefined>(undefined);

    const [reloadKey, reload] = useReload();

    useEffect(() => {
        getProductsUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);
            setProducts(products);
        });
    }, [getProductsUseCase, reloadKey]);

    function onChangePrice(price: string): void {
        if (!editingProduct) return;

        const isValidNumber = !isNaN(+price);
        setEditingProduct({ ...editingProduct, price: price });

        if (!isValidNumber) {
            setPriceError("Only numbers are allowed");
        } else {
            if (!PRICE_REGEX.test(price)) {
                setPriceError("Invalid price format");
            } else if (+price > 999.99) {
                setPriceError("The max possible price is 999.99");
            } else {
                setPriceError(undefined);
            }
        }
    }

    // FIXME: User validation
    const updatingQuantity = useCallback(
        async (id: number) => {
            if (id) {
                if (!currentUser.isAdmin) {
                    setError("Only admin users can edit the price of a product");
                    return;
                }

                try {
                    const product = await getProducByIdUseCase.execute(id);
                    setEditingProduct(product);
                } catch (error) {
                    if (error instanceof ResourceNotFoundError) {
                        setError(error.message);
                    } else {
                        setError("Unexpected error has occurred");
                    }
                }
            }
        },
        [currentUser.isAdmin, getProducByIdUseCase]
    );

    // FIXME: Close dialog
    const cancelEditPrice = useCallback(() => {
        setEditingProduct(undefined);
    }, []);

    return {
        products,
        editingProduct,
        error,
        priceError,
        reload,
        updatingQuantity,
        cancelEditPrice,
        setEditingProduct,
        onChangePrice,
    };
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

const PRICE_REGEX = /^\d+(\.\d{1,2})?$/;
