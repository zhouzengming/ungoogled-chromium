type DiffCallback = (line: string) => string;
export declare function formatDiff(diffBlocks: Array<{
    value: string;
    added: boolean;
    removed: boolean;
}>, onSame: DiffCallback, onAdded: DiffCallback, onRemoved: DiffCallback): Generator<string, void, unknown>;
export declare function resultAssertionsDiff(assertionErrors: any[]): any;
export declare function formatDiffText(assertionDiff: any[]): string | null;
export declare function formatSummary(message: string, diffText: string | null, cutoff?: number): string;
export declare function formatAsHtml(assertionDiff: any): string | null;
export {};
