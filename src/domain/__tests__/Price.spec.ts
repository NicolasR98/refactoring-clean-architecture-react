import { describe, it, expect } from "vitest";
import { Price, ValidationError } from "../Price";

describe("Price", () => {
    it("should create a Price with valid integer string", () => {
        const price = Price.create("100");
        expect(price.value).toBe(100);
    });

    it("should create a Price with valid decimal string", () => {
        const price = Price.create("99.99");
        expect(price.value).toBe(99.99);
    });

    it("should throw ValidationError for non-numeric string", () => {
        expect(() => Price.create("abc")).toThrow(ValidationError);
        expect(() => Price.create("abc")).toThrow("Only numbers are allowed");
    });

    it("should throw ValidationError for invalid price format (too many decimals)", () => {
        expect(() => Price.create("10.999")).toThrow(ValidationError);
        expect(() => Price.create("10.999")).toThrow("Invalid price format");
    });

    it("should throw ValidationError for price greater than 999.99", () => {
        expect(() => Price.create("1000")).toThrow(ValidationError);
        expect(() => Price.create("1000")).toThrow("The max possible price is 999.99");
        expect(() => Price.create("1000.00")).toThrow(ValidationError);
    });

    it("should throw ValidationError for negative price", () => {
        expect(() => Price.create("-10")).toThrow(ValidationError);
        expect(() => Price.create("-10")).toThrow("Invalid price format");
    });

    it("should throw ValidationError for empty string", () => {
        expect(() => Price.create("")).toThrow(ValidationError);
        expect(() => Price.create("")).toThrow("Invalid price format");
    });

    it("should create a Price with zero", () => {
        const price = Price.create("0");
        expect(price.value).toBe(0);
    });

    it("should create a Price with one decimal digit", () => {
        const price = Price.create("12.5");
        expect(price.value).toBe(12.5);
    });

    it("should throw ValidationError for price with letters and numbers", () => {
        expect(() => Price.create("12a.34")).toThrow(ValidationError);
        expect(() => Price.create("12a.34")).toThrow("Only numbers are allowed");
    });
});