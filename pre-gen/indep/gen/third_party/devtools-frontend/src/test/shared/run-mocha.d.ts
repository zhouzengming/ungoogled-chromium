import Mocha from 'mocha';
type Options = Mocha.MochaOptions & {
    spec?: string[];
    suiteName?: string;
};
type OmitOptions = 'reporter' | 'allowUncaught' | 'retries';
export declare function run(options: Omit<Options, OmitOptions>): Promise<void>;
export {};
