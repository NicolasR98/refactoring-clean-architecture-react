export interface EntityData {
    id: number;
}

const isEntity = (v: unknown): v is Entity => v instanceof Entity;

export abstract class Entity implements EntityData {
    constructor(public id: number) {}

    public equals(object?: Entity): boolean {
        if (object === null || object === undefined) {
            return false;
        }

        if (this === object) {
            return true;
        }

        if (!isEntity) {
            return false;
        }

        return this.id === object.id;
    }
}
