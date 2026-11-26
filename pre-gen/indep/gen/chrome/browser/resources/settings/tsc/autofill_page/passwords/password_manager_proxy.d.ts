/**
 * @fileoverview PasswordManagerProxy is an abstraction over
 * chrome.passwordsPrivate which facilitates testing.
 */
/**
 * Interface for all callbacks to the password API.
 */
export interface PasswordManagerProxy {
    /**
     * Log that the Passwords page was accessed from the Chrome Settings WebUI.
     */
    recordPasswordsPageAccessInSettings(): void;
    /**
     * Records the referrer of a given navigation to the Password Check page.
     */
    recordPasswordCheckReferrer(referrer: PasswordCheckReferrer): void;
    /**
     * Shows new Password Manager UI (chrome://password-manager).
     */
    showPasswordManager(page: PasswordManagerPage): void;
}
/**
 * Represents different referrers when navigating to the Password Check page.
 *
 * These values are persisted to logs. Entries should not be renumbered and
 * numeric values should never be reused.
 */
export declare enum PasswordCheckReferrer {
    SAFETY_CHECK = 0,// Web UI, recorded in JavaScript.
    PASSWORD_SETTINGS = 1,// Web UI, recorded in JavaScript.
    PHISH_GUARD_DIALOG = 2,// Native UI, recorded in C++.
    PASSWORD_BREACH_DIALOG = 3,// Native UI, recorded in C++.
    MORE_TO_FIX_BUBBLE = 4,// Native UI, recorded in C++.
    SAFETY_CHECK_MAGIC_STACK = 6,// Native UI, recorded in C++.
    SAFETY_CHECK_NOTIFICATION = 7,// Native UI, recorded in C++.
    COUNT = 8
}
export declare enum PasswordManagerPage {
    PASSWORDS = 0,
    CHECKUP = 1
}
/**
 * Implementation that accesses the private API.
 */
export declare class PasswordManagerImpl implements PasswordManagerProxy {
    recordPasswordsPageAccessInSettings(): void;
    /** override */
    recordPasswordCheckReferrer(referrer: PasswordCheckReferrer): void;
    showPasswordManager(page: PasswordManagerPage): void;
    static getInstance(): PasswordManagerProxy;
    static setInstance(obj: PasswordManagerProxy): void;
}
