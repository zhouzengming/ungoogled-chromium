import 'chrome://resources/cr_elements/cr_chip/cr_chip.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/icons.html.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
export declare class HistoryFilterChipsElement extends CrLitElement {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        userVisits: {
            type: BooleanConstructor;
        };
        actorVisits: {
            type: BooleanConstructor;
        };
    };
    private accessor userVisits;
    private accessor actorVisits;
    protected isUserSelected(): boolean;
    protected isActorSelected(): boolean;
    protected onUserVisitsClick_(): void;
    protected onActorVisitsClick_(): void;
    protected recordMetrics_(newUserState: boolean, newActorState: boolean): void;
    protected getUserVisitsIcon_(): string;
    protected getActorVisitsIcon_(): string;
    private isCriticalActionsEnabled_;
    private fireChange_;
}
declare global {
    interface HTMLElementTagNameMap {
        'history-filter-chips': HistoryFilterChipsElement;
    }
}
