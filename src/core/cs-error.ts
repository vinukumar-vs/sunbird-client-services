export abstract class CsError extends Error {
    private readonly _code: string;

    protected constructor(message: string, code: string) {
        super(message);
        this._code = code;

        Object.setPrototypeOf(this, CsError.prototype);
    }

    get code(): string {
        return this._code;
    }
}
