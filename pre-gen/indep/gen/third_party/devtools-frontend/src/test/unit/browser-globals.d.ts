import type * as Mocha from 'mocha';
export interface KarmaMochaConfig {
    expose?: string[];
    reporter?: unknown;
    require?: unknown;
    [key: string]: unknown;
}
export interface KarmaConfig {
    mocha?: KarmaMochaConfig;
    checkoutRoot?: string;
    pathSeparator?: string;
    testIds: string[];
    skippedTests: string[];
    repetitions: number;
}
export interface Karma {
    config: KarmaConfig;
    start: () => void;
    info: (info: {
        total: number;
    }) => void;
    result: (result: unknown) => void;
    complete: (data: {
        coverage?: unknown;
    }) => void;
    error: (error: string | Error) => void;
}
export interface BrowserMocha extends Mocha {
    setup(options: Record<string, unknown>): void;
    utils?: {
        stringify(value: unknown): string;
    };
}
export interface MochaGlobalsNamespace {
    interfaces: Record<string, (suite: Mocha.Suite) => void> & {
        bdd: (suite: Mocha.Suite) => void;
    };
}
declare global {
    interface Window {
        __karma__: Karma;
        mocha: BrowserMocha;
        Mocha: MochaGlobalsNamespace;
        __coverage__?: unknown;
    }
}
