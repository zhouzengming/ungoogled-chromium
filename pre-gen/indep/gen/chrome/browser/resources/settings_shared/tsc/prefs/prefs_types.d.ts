declare class CrSettingsPrefsInternal {
    isInitialized: boolean;
    deferInitialization: boolean;
    private initializedResolver_;
    constructor();
    get initialized(): Promise<void>;
    /** Resolves the |initialized| promise. */
    setInitialized(): void;
    /** Restores state for testing. */
    resetForTesting(): void;
}
export declare const CrSettingsPrefs: CrSettingsPrefsInternal;
export {};
