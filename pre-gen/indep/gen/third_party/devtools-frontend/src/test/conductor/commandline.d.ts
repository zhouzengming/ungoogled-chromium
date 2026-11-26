import type * as Yargs from 'yargs';
export declare function expandResponseFiles(args: string[]): string[];
export declare const DiffBehaviors: {
    readonly UPDATE: "update";
    readonly THROW: "throw";
    readonly NO_THROW: "no-throw";
    readonly NO_UPDATE: "no-update";
};
export type DiffBehaviors = typeof DiffBehaviors[keyof typeof DiffBehaviors];
export declare function asArray(value?: string | string[]): string[];
export interface CommandLineOptions {
    debug: boolean;
    headless?: boolean;
    coverage: boolean;
    'artifacts-dir'?: string;
    'chrome-binary'?: string;
    'on-diff'?: string[];
    verbose: number;
    shuffle: boolean;
    repeat: number;
    bail: boolean;
    retries: number;
    grep?: string;
    fgrep?: string;
    'invert-grep': boolean;
    'cpu-throttle': number;
    'shard-count': number;
    'shard-number': number;
    'shard-bias': number;
    'expectations-file'?: string;
    'force-screenshots': boolean;
    'ota-username'?: string;
}
export declare function commandLineArgs<T = Record<string, unknown>>(yargs: Yargs.Argv<T>): Yargs.Argv<T & CommandLineOptions>;
