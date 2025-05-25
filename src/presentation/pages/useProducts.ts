import { useEffect, useState } from "react";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";
import { useReload } from "../hooks/useReload";

export function useProducts(getProductsUseCase: GetProductsUseCase) {
    const [products, setProducts] = useState<Product[]>([]);
    const [reloadKey, reload] = useReload();

    useEffect(() => {
        getProductsUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);
            setProducts(products);
        });
    }, [getProductsUseCase, reloadKey]);

    return { products, reload };
}
