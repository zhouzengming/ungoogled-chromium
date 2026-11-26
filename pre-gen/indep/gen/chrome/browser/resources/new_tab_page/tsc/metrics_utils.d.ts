/** Records `durationMs` in the `metricName` histogram. */
export declare function recordDuration(metricName: string, durationMs: number): void;
/**
 * Records the duration between navigation start and `msSinceEpoch` in the
 * `metricName` histogram.
 */
export declare function recordLoadDuration(metricName: string, msSinceEpoch: number): void;
/**
 * Records `value` (expected to be between 0 and 10) into the ten-bucket
 * `metricName` histogram.
 */
export declare function recordPerdecage(metricName: string, value: number): void;
/**
 * Records that an event has happened rather than a value in the `metricName`
 * histogram.
 */
export declare function recordOccurrence(metricName: string): void;
export declare function recordEnumeration(metricName: string, value: number, enumSize: number): void;
export declare function recordBoolean(metricName: string, value: boolean): void;
export declare function recordSparseValueWithPersistentHash(metricName: string, value: string): void;
export declare function recordSmallCount(metricName: string, value: number): void;
export declare function recordLogValue(metricName: string, min: number, max: number, buckets: number, value: number): void;
export declare function recordLinearValue(metricName: string, min: number, max: number, buckets: number, value: number): void;
