export abstract class CsClientStorage {
    static readonly TRACE_ID: string = 'trace_id';
    abstract setItem(key: string, value: string): Promise<void>;
    abstract getItem(key: string): Promise<string | undefined>;
}
