export abstract class CsError {
    private readonly _code: string;

    protected constructor(message: string, code: string) {
        this._code = code;
    }

    get code(): string {
        return this._code;
    }
}
