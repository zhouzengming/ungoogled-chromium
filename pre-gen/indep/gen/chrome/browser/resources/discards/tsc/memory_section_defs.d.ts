/**
 * Definition of a single metric entry to be extracted from a ProcessMemoryDump.
 */
export interface MetricDef {
    /** User-visible label for the metric. */
    label: string;
    /**
     * Name of the allocator dump in chromeAllocatorDumps (or empty for OS dump).
     */
    dumpName: string;
    /**
     * Name of the numeric metric within the allocator dump (or OS dump field).
     */
    metricName: string;
    /** Display unit and formatting type. */
    unit: 'bytes' | 'kib' | 'count' | 'percent';
}
/**
 * Definition of a collapsible section grouping related metrics.
 */
export interface SectionDef {
    /** Unique section identifier. */
    id: string;
    /** User-visible label for the section header. */
    label: string;
    /** List of metric definitions contained in this section. */
    metrics: MetricDef[];
}
export declare const SECTION_DEFS: SectionDef[];
