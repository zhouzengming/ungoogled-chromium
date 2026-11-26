import '//resources/cr_components/composebox/composebox_dropdown.js';
import '//resources/cr_components/composebox/composebox_input.js';
import '//resources/cr_components/composebox/composebox_submit.js';
import '//resources/cr_components/composebox/composebox_tool_chip.js';
import '//resources/cr_components/composebox/composebox_voice_search.js';
import '//resources/cr_components/composebox/contextual_entrypoint_button.js';
import '//resources/cr_components/composebox/error_scrim.js';
import '//resources/cr_components/composebox/file_carousel.js';
import '//resources/cr_components/localized_link/localized_link.js';
import '//resources/cr_components/search/animated_glow.js';
import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import '//resources/cr_components/composebox/composebox_lens_search.js';
import { ComposeboxFile } from '//resources/cr_components/composebox/common.js';
import type { PageHandlerRemote } from '//resources/cr_components/composebox/composebox.mojom-webui.js';
import type { ComposeboxDropdownElement } from '//resources/cr_components/composebox/composebox_dropdown.js';
import type { ComposeboxInputElement } from '//resources/cr_components/composebox/composebox_input.js';
import type { ContextualEntrypointButtonElement } from '//resources/cr_components/composebox/contextual_entrypoint_button.js';
import { GlowAnimationState } from '//resources/cr_components/search/constants.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { PropertyValues } from '//resources/lit/v3_0/lit.rollup.js';
import type { PageCallbackRouter as SearchboxPageCallbackRouter, PageHandlerRemote as SearchboxPageHandlerRemote, SearchContext } from '//resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
import type { UnguessableToken } from '//resources/mojo/mojo/public/mojom/base/unguessable_token.mojom-webui.js';
export interface OmniboxComposeboxElement {
    $: {
        composeboxInput: ComposeboxInputElement;
        composebox: HTMLElement;
        matches: ComposeboxDropdownElement;
    };
}
declare const OmniboxComposeboxElement_base: typeof CrLitElement & (new (...args: any[]) => import("//resources/cr_elements/i18n_mixin_lit.js").I18nMixinLitInterface) & (new (...args: any[]) => import("//resources/cr_components/composebox/composebox_mixin.js").ComposeboxEmbedderMixinInterface);
export declare class OmniboxComposeboxElement extends OmniboxComposeboxElement_base {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        applyContextButtonBackground: {
            reflect: boolean;
            type: BooleanConstructor;
        };
        expanding_: {
            reflect: boolean;
            type: BooleanConstructor;
        };
        animationState: {
            type: StringConstructor;
            reflect: boolean;
        };
        entrypointName: {
            type: StringConstructor;
            reflect: boolean;
        };
        enableCarouselScrolling: {
            type: BooleanConstructor;
        };
        askGComposeboxLensChipEnabled_: {
            type: BooleanConstructor;
        };
        isLensSearchChipShown_: {
            type: BooleanConstructor;
        };
        isContentSharingEnabled_: {
            type: BooleanConstructor;
        };
        isLensSearchEligible_: {
            type: BooleanConstructor;
        };
        askGComposeboxPlaceholderEnabled_: {
            type: BooleanConstructor;
        };
    };
    accessor entrypointName: string;
    accessor applyContextButtonBackground: boolean;
    accessor enableCarouselScrolling: boolean;
    accessor animationState: GlowAnimationState;
    protected accessor expanding_: boolean;
    protected accessor askGComposeboxLensChipEnabled_: boolean;
    protected accessor isLensSearchChipShown_: boolean;
    protected accessor isContentSharingEnabled_: boolean;
    protected accessor isLensSearchEligible_: boolean;
    protected accessor askGComposeboxPlaceholderEnabled_: boolean;
    protected onLensSearchClick_(e: Event): void;
    private onVisibilityChange_;
    private pageHandler_;
    private searchboxCallbackRouter_;
    private searchboxHandler_;
    private listenerIds_;
    /**
     * Whether this session opened the composebox without suggestions and is
     * waiting for contextual ones. Set in `addSearchContext()` and consumed
     * exactly once, on the `showDropdown` when the results come in.
     */
    private awaitingBlockedZeroStateSuggestions_;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(changedProperties: PropertyValues<this>): void;
    updateInputPlaceholder(): void;
    firstUpdated(changedProperties: PropertyValues<this>): void;
    updated(changedProperties: PropertyValues<this>): void;
    /**
     * Plays the load-in animation: the box grows to fit the arriving
     * suggestions, which fade in as it opens.
     */
    private animateContextualSuggestions_;
    deleteFile(uuidToDelete: UnguessableToken, fromUserAction?: boolean): ComposeboxFile | null;
    getActiveElement(): Element | null;
    getDropdownElement(): ComposeboxDropdownElement;
    getInputElement(): ComposeboxInputElement;
    getPageHandler(): PageHandlerRemote;
    getSearchboxCallbackRouter(): SearchboxPageCallbackRouter;
    getSearchboxHandler(): SearchboxPageHandlerRemote;
    getContextEntrypointElement(): ContextualEntrypointButtonElement | null;
    shouldShowDivider(): boolean;
    shouldHandleSuggestionFuseboxActions(): boolean;
    addSearchContext(context: SearchContext | null): void;
    playGlowAnimation(): void;
    isExpanded(): boolean;
    private addFileFromAttachment_;
    private addTabFromAttachment_;
    private hasGridSuggestionsGroup_;
}
declare global {
    interface HTMLElementTagNameMap {
        'cr-omnibox-composebox': OmniboxComposeboxElement;
    }
}
export {};
