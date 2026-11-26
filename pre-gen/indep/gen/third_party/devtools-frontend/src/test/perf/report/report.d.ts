/**
 * Based on skia-perf format:
 * https://skia.googlesource.com/buildbot/+/refs/heads/main/perf/FORMAT.md
 * https://pkg.go.dev/go.skia.org/infra/perf/go/ingest/format#Result
 **/
interface BenchmarkBase {
    key: {
        test: string;
        [key: string]: string;
    };
}
/** Only one of `measurement` or `measurements` should be populated. **/
export type Benchmark = BenchmarkMultiMeasure | BenchmarkSingleMeasure;
/**
 * The idea behind Measurements is that you may have more than one
 * metric you want to report at the end of running a test, for example
 * you may track the fastest time it took to run a test, and also the
 * median and max time.
 **/
interface BenchmarkMultiMeasure extends BenchmarkBase {
    measurements: Record<string, SingleMeasurement[]>;
}
interface BenchmarkSingleMeasure extends BenchmarkBase {
    measurement: number;
}
interface SingleMeasurement {
    value: string;
    measurement: number;
}
export declare function addBenchmarkResult(benchmark: Benchmark): void;
export declare function clearResults(): void;
export declare function writeReport(): void;
export declare const measurements: Record<string, number[]>;
export declare function collectMeasurements(): void;
export {};
