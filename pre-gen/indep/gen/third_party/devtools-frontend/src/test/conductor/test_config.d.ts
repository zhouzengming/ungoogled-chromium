interface Config {
    tests: string[];
    verbose: number;
    artifactsDir: string;
    chromeBinary: string;
    debug: boolean;
    headless: boolean;
    coverage: boolean;
    repetitions: number;
    onDiff: {
        update: boolean | string[];
        throw: boolean;
    };
    shuffle: boolean;
    mochaGrep: {
        invert?: boolean;
        grep?: string;
    } | {
        invert?: boolean;
        fgrep?: string;
    };
    copyScreenshotGoldens: boolean;
    retries: number;
    configureChrome: (executablePath: string) => void;
    cpuThrottle: number;
    shardCount: number;
    shardNumber: number;
    shardBias: number;
    isAiAgent: boolean;
    isLuci: boolean;
    isPerfTest: boolean;
    expectationsFile?: string;
    bail: boolean;
    forceScreenshots: boolean;
    otaUsername?: string;
}
export declare function isAIAgent(): boolean;
export declare const TestConfig: Config;
export declare function shuffleTests(tests: string[]): string[];
export declare function loadTests(testDirectory: string, filename?: string): string[];
export {};
