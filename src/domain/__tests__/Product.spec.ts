import { describe, expect, it } from "vitest";
import { Product } from "../Product";

describe("Product", () => {
    const validProductData = {
        id: 1,
        title: "Test Product",
        image: "test.jpg",
        price: "99.99",
    };

    it("should create a Product with valid data", () => {
        const product = Product.create(validProductData);
        expect(product.id).toBe(validProductData.id);
        expect(product.title).toBe(validProductData.title);
        expect(product.image).toBe(validProductData.image);
        expect(product.price.value).toBe(99.99);
        expect(product.status).toBe("active");
    });

    it("should set status to 'inactive' if price is zero", () => {
        const data = { ...validProductData, price: "0" };
        const product = Product.create(data);
        expect(product.status).toBe("inactive");
        expect(product.price.value).toBe(0);
    });

    it("should set status to 'active' if price is greater than zero", () => {
        const data = { ...validProductData, price: "10" };
        const product = Product.create(data);
        expect(product.status).toBe("active");
        expect(product.price.value).toBe(10);
    });

    it("should consider two products with the same id as equal", () => {
        const product1 = Product.create(validProductData);
        const product2 = Product.create({ ...validProductData, title: "Other product" });
        expect(product1.equals(product2)).toBe(true);
    });

    it("should consider two products with different ids as not equal", () => {
        const product1 = Product.create(validProductData);
        const product2 = Product.create({ ...validProductData, id: 2 });
        expect(product1.equals(product2)).toBe(false);
    });

    it("should update the price and status using editPrice", () => {
        const product = Product.create(validProductData);
        const updated = product.editPrice("0");
        expect(updated.price.value).toBe(0);
        expect(updated.status).toBe("inactive");
        expect(updated.id).toBe(product.id);
        expect(updated.title).toBe(product.title);
        expect(updated.image).toBe(product.image);
    });

    it("should return a new Product instance when editPrice is called", () => {
        const product = Product.create(validProductData);
        const updated = product.editPrice("150.50");
        expect(updated).not.toBe(product);
        expect(updated.price.value).toBe(150.50);
        expect(updated.status).toBe("active");
    });

    it("should not mutate the original Product when editPrice is called", () => {
        const product = Product.create(validProductData);
        const updated = product.editPrice("0");
        expect(product.price.value).toBe(99.99);
        expect(product.status).toBe("active");
        expect(updated.price.value).toBe(0);
        expect(updated.status).toBe("inactive");
    });
});
