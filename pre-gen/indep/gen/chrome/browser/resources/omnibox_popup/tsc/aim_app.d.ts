import '//resources/cr_components/composebox/composebox.js';
import './omnibox_composebox.js';
import '/strings.m.js';
import type { ComposeboxElement } from '//resources/cr_components/composebox/composebox.js';
import type { VoicePermissionPromptState } from '//resources/cr_components/composebox/composebox_voice_search.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { OmniboxComposeboxElement } from './omnibox_composebox.js';
export interface OmniboxAimAppElement {
    $: {
        composebox: ComposeboxElement | OmniboxComposeboxElement;
    };
}
export declare class OmniboxAimAppElement extends CrLitElement {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        searchboxLayoutMode_: {
            type: StringConstructor;
        };
        hasAllowedInputs_: {
            type: BooleanConstructor;
        };
        caretAnimationsEnabled_: {
            type: BooleanConstructor;
        };
        disableComposeboxAnimation_: {
            type: BooleanConstructor;
        };
        energyEffectEnabled_: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        energyEffectAnimationEnabled_: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        disableVoiceSearchAnimation_: {
            type: BooleanConstructor;
        };
        usePecApi_: {
            type: BooleanConstructor;
        };
        smartTabSharingVisible_: {
            type: BooleanConstructor;
        };
        contextManagementInComposeboxEnabled_: {
            type: BooleanConstructor;
        };
        isOblongShape_: {
            type: BooleanConstructor;
        };
        webuiOmniboxSimplificationEnabled_: {
            type: BooleanConstructor;
        };
        webuiOmniboxFullPopupEnabled_: {
            type: BooleanConstructor;
        };
        smartComposeEnabled_: {
            type: BooleanConstructor;
        };
        webuiShadowEnabled_: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    protected accessor searchboxLayoutMode_: string;
    protected accessor hasAllowedInputs_: boolean;
    protected accessor disableComposeboxAnimation_: boolean;
    protected accessor disableVoiceSearchAnimation_: boolean;
    protected accessor caretAnimationsEnabled_: boolean;
    protected accessor energyEffectEnabled_: boolean;
    protected accessor energyEffectAnimationEnabled_: boolean;
    protected accessor usePecApi_: boolean;
    protected accessor smartTabSharingVisible_: boolean;
    protected accessor contextManagementInComposeboxEnabled_: boolean;
    protected accessor isOblongShape_: boolean;
    protected accessor webuiOmniboxSimplificationEnabled_: boolean;
    protected accessor webuiOmniboxFullPopupEnabled_: boolean;
    protected accessor smartComposeEnabled_: boolean;
    protected accessor webuiShadowEnabled_: boolean;
    private eventTracker_;
    private browserProxy_;
    private listenerIds_;
    private preserveContextOnClose_;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected getSearchboxLayoutMode_(): string;
    protected onContextMenuEntrypointClick_(e: CustomEvent<{
        x: number;
        y: number;
    }>): void;
    private onContextMenuClosed_;
    protected onVoicePermissionPromptChanged(e: CustomEvent<VoicePermissionPromptState>): void;
    /**
     * Forwards close requests along with the active composebox input text so the
     * browser can transfer any typed draft back to the Omnibox.
     */
    protected onCloseComposebox_(e: CustomEvent<{
        composeboxText: string;
    }>): void;
    protected setPreserveContextOnClose_(preserveContextOnClose: boolean): void;
    private onPopupShown_;
    private addContext_;
    private focusInput_;
    private clearPopup_;
    protected onComposeboxSubmit_(): void;
    setSearchboxLayoutModeForTesting(mode: string): void;
    setHasAllowedInputsForTesting(hasAllowedInputs: boolean): void;
    getSearchboxLayoutModeForTesting(): string;
    getHasAllowedInputsForTesting(): boolean;
}
declare global {
    interface HTMLElementTagNameMap {
        'omnibox-aim-app': OmniboxAimAppElement;
    }
}
