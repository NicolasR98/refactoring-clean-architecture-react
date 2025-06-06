import { ValueObject } from "./core/ValueObject";

const PRICE_REGEX = /^\d+(\.\d{1,2})?$/;

export interface PriceProps {
    value: number;
}

export class Price extends ValueObject<PriceProps> {
    public readonly value: number;

    private constructor(props: PriceProps) {
        super(props);

        this.value = props.value;
    }

    public static create(value: string): Price {
        const isValidNumber = !isNaN(+value);

        if (!isValidNumber) {
            throw new ValidationError("Only numbers are allowed");
        } else {
            if (!PRICE_REGEX.test(value)) {
                throw new ValidationError("Invalid price format");
            } else if (+value > 999.99) {
                throw new ValidationError("The max possible price is 999.99");
            } else {
                return new Price({ value: +value });
            }
        }
    }
}

export class ValidationError extends Error {}
