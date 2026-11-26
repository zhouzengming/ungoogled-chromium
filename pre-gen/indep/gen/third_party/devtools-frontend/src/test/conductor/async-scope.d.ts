export declare class AsyncScope {
    static scopes: Set<AsyncScope>;
    static abortSignal: AbortSignal | undefined;
    private asyncStack;
    get descriptions(): string[];
    get stack(): null | string[];
    push(description?: string): string[];
    pop(): void;
    exec<T>(callable: (messages: string[]) => Promise<T>, description?: string): Promise<T>;
}
