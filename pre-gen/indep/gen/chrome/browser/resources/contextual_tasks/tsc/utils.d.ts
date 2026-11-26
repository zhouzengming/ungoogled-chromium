import type { BigBuffer } from 'chrome://resources/mojo/mojo/public/mojom/base/big_buffer.mojom-webui.js';
export declare function recordAction(actionName: string): void;
export interface UnboundedDialog extends HTMLDialogElement {
    showUnboundedElement?: () => Promise<void>;
    hideUnboundedElement?: () => Promise<void>;
}
export declare function isGoogleOrigin(origin: string): boolean;
export declare function getArrayBufferFromBigBuffer(bigBuffer: BigBuffer): ArrayBuffer;
export declare const HANDSHAKE_INTERVAL_MS = 10;
export declare const HANDSHAKE_TIMEOUT_MS = 30000;
export declare const MAX_HANDSHAKE_ATTEMPTS: number;
