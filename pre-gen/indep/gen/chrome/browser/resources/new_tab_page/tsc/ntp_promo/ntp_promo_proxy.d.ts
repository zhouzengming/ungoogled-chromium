import type { NtpPromoHandlerInterface } from '../ntp_promo.mojom-webui.js';
import { NtpPromoClientCallbackRouter, NtpPromoHandlerRemote } from '../ntp_promo.mojom-webui.js';
export interface NtpPromoProxy {
    getHandler(): NtpPromoHandlerInterface;
    getCallbackRouter(): NtpPromoClientCallbackRouter;
}
export declare class NtpPromoProxyImpl implements NtpPromoProxy {
    private callbackRouter_;
    private handler_;
    constructor();
    static getInstance(): NtpPromoProxy;
    static setInstance(obj: NtpPromoProxy): void;
    getHandler(): NtpPromoHandlerRemote;
    getCallbackRouter(): NtpPromoClientCallbackRouter;
}
