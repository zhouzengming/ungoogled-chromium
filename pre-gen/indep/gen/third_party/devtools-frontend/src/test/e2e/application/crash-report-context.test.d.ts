interface CrashReportContext {
    initialize(size: number): Promise<void>;
    set(key: string, value: string): void;
    delete(key: string): void;
}
declare global {
    interface Window {
        crashReport: CrashReportContext;
    }
}
export {};
