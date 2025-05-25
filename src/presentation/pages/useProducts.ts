import { useCallback, useEffect, useState } from "react";
import { RemoteProduct, StoreApi } from "../../data/api/StoreApi";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { useReload } from "../hooks/useReload";

export function useProducts(getProductsUseCase: GetProductsUseCase, storeApi: StoreApi) {
    const { currentUser } = useAppContext();

    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [error, setError] = useState<string>();

    const [reloadKey, reload] = useReload();

    useEffect(() => {
        getProductsUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);
            setProducts(products);
        });
    }, [getProductsUseCase, reloadKey]);

    // FIXME: Load product
    // FIXME: User validation
    const updatingQuantity = useCallback(
        async (id: number) => {
            if (id) {
                if (!currentUser.isAdmin) {
                    setError("Only admin users can edit the price of a product");
                    return;
                }

                storeApi
                    .get(id)
                    .then(buildProduct)
                    .then(product => {
                        setEditingProduct(product);
                    })
                    .catch(() => {
                        setError(`Product with id ${id} not found`);
                    });
            }
        },
        [currentUser.isAdmin, storeApi]
    );

    // FIXME: Close dialog
    const cancelEditPrice = useCallback(() => {
        setEditingProduct(undefined);
    }, []);

    return {
        products,
        editingProduct,
        error,
        reload,
        updatingQuantity,
        cancelEditPrice,
        setEditingProduct,
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
