import 'chrome://resources/cr_elements/cr_icon_button/cr_icon_button.js';
import 'chrome://resources/cr_elements/cr_page_selector/cr_page_selector.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
/**
 * Action the user can perform while using voice search. This enum must match
 * the numbering for NewTabPageVoiceAction in enums.xml. These values are
 * persisted to logs. Entries should not be renumbered, removed or reused.
 */
export declare enum Action {
    ACTIVATE = 0,
    ACTIVATE_KEYBOARD = 1,
    CLOSE_OVERLAY = 2,
    QUERY_SUBMITTED = 3,
    SUPPORT_LINK_CLICKED = 4,
    TRY_AGAIN_LINK = 5,
    TRY_AGAIN_MIC_BUTTON = 6,// Deprecated.
    MAX_VALUE = 6
}
/**
 * Errors than can occur while using voice search. This enum must match the
 * numbering for NewTabPageVoiceError in enums.xml. These values are persisted
 * to logs. Entries should not be renumbered, removed or reused.
 */
export declare enum Error {
    ABORTED = 0,
    AUDIO_CAPTURE = 1,
    BAD_GRAMMAR = 2,
    LANGUAGE_NOT_SUPPORTED = 3,
    NETWORK = 4,
    NO_MATCH = 5,
    NO_SPEECH = 6,
    NOT_ALLOWED = 7,
    OTHER = 8,
    SERVICE_NOT_ALLOWED = 9,
    MAX_VALUE = 9
}
export declare function recordVoiceAction(action: Action): void;
declare global {
    interface Window {
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}
export interface VoiceSearchOverlayElement {
    $: {
        dialog: HTMLDialogElement;
        micContainer: HTMLElement;
        micVolume: HTMLElement;
    };
}
export declare class VoiceSearchOverlayElement extends CrLitElement {
    static get is(): string;
    static get styles(): import("chrome://resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("chrome://resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        interimResult_: {
            type: StringConstructor;
        };
        finalResult_: {
            type: StringConstructor;
        };
        state_: {
            type: NumberConstructor;
        };
        helpUrl_: {
            type: StringConstructor;
        };
        micVolumeLevel_: {
            type: NumberConstructor;
        };
        micVolumeDuration_: {
            type: NumberConstructor;
        };
    };
    protected accessor interimResult_: string;
    protected accessor finalResult_: string;
    protected accessor helpUrl_: string;
    protected accessor micVolumeLevel_: number;
    protected accessor micVolumeDuration_: number;
    private accessor state_;
    private voiceRecognition_;
    private error_;
    private timerId_;
    constructor();
    connectedCallback(): void;
    private start;
    protected onOverlayClose_(): void;
    protected onOverlayClick_(): void;
    /**
     * Handles <ENTER> or <SPACE> to trigger a query if we have recognized speech.
     */
    protected onOverlayKeydown_(e: KeyboardEvent): void;
    /**
     * Handles <ENTER> or <SPACE> to simulate click.
     */
    protected onLinkKeydown_(e: KeyboardEvent): void;
    protected onLearnMoreClick_(): void;
    protected onTryAgainClick_(e: Event): void;
    private resetIdleTimer_;
    private onIdleTimeout_;
    private resetErrorTimer_;
    private onAudioStart_;
    private onSpeechStart_;
    private onResult_;
    private onFinalResult_;
    private onEnd_;
    private onError_;
    private animateVolume_;
    protected getText_(): string;
    protected getErrorText_(): string;
    protected getErrorLink_(): string;
    protected getMicClass_(): string;
}
declare global {
    interface HTMLElementTagNameMap {
        'ntp-voice-search-overlay': VoiceSearchOverlayElement;
    }
}
