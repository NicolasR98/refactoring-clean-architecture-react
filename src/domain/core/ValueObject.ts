export abstract class ValueObject<T> {
    constructor(protected props: T) {}

    public equals(vo?: ValueObject<T>): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }
        if (vo.props === undefined) {
            return false;
        }
        return JSON.stringify(vo.props) === JSON.stringify(this.props);
    }
}
