export type ArtifactGroup = Record<string, {
    filePath: string;
}>;
export declare class ScreenshotError extends Error {
    static readonly SUMMARY_LENGTH_CUTOFF = 3900;
    static errors: ScreenshotError[];
    readonly screenshots: ArtifactGroup;
    screenshotPath?: string;
    private constructor();
    /**
     * Creates a ScreenshotError when a reference golden does not exists.
     */
    static fromGeneratedScreenshot(message: string, generatedImgPath: string): ScreenshotError;
    /**
     * Creates a ScreenshotError when a generated screenshot is different from
     * the golden.
     */
    static fromScreenshotAssertionError(error: Error, goldenImgPath: string, generatedImgPath: string, diffImgPath: string): ScreenshotError;
    /**
     * Creates a ScreenshotError when an unexpected error occurs. Screenshots are
     * taken for both the inspected page and the DevTools page.
     */
    static fromBase64Images(error: Error, inspectedPageScreenshot?: string, devToolsPageScreenshot?: string, collectedScreenshots?: Record<string, string>): Error;
    static saveArtifacts(collectedScreenshots: Record<string, string> | undefined): ArtifactGroup;
    /**
     * Costructs a summary for Milo at resultdb publication time.
     */
    toMiloSummary(): string;
    /**
     * Copy artifacts in tmp folder so they remain available
     * at resultdb publication time.
     */
    private static stashArtifact;
    /**
     * Save base64 image in tmp folder to make it available at resultdb
     * publication time.
     */
    private static saveArtifact;
}
export interface ScreenshotErrorReporterInstance {
    onRunComplete?: () => void;
    [key: string]: unknown;
}
export declare const ScreenshotErrorReporter: {
    (this: ScreenshotErrorReporterInstance, baseReporterDecorator: (arg0: unknown) => void): void;
    $inject: string[];
};
