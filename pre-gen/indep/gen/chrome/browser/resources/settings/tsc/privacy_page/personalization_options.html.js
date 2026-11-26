import { html } from '//resources/lit/v3_0/lit.rollup.js';
import { RestartType } from '../relaunch_mixin_lit.js';
// 
export function getHtml() {
    return html `<!--_html_template_start_-->
<!-- not chromeos -->
<!-- _google_chrome -->
<!-- _google_chrome -->
    ${this.showSearchSuggestToggle_() ? html `
      <settings-toggle-button id="searchSuggestToggle"
          class="hr"
          pref-key="search.suggest_enabled"
          label="$i18n{searchSuggestPref}"
          sub-label="$i18n{searchSuggestPrefDesc}">
      </settings-toggle-button>
    ` : ''}

    <!-- This toggle is only shown for users with the appropriate enterprise
        policy enabled. The state is not changeable by the user, so when shown,
        it is alays selected but disabled. -->
    ${this.showSearchAggregatorSuggest_ ? html `
      <settings-toggle-button id="searchAggregatorSuggestToggle"
          .pref="${this.searchAggregatorSuggestFakePref_}"
          disabled
          class="hr"
          label="$i18n{searchAggregatorSuggestPref}"
          sub-label="$i18n{searchAggregatorSuggestPrefDesc}">
      </settings-toggle-button>
    ` : ''}

    ${this.showPriceEmailNotificationsToggle_() ? html `
      <settings-toggle-button id="priceEmailNotificationsToggle"
          class="hr"
          label="$i18n{priceEmailNotificationsPref}"
          sub-label="${this.getPriceEmailNotificationsPrefDesc_()}"
          pref-key="price_tracking.email_notifications_enabled">
      </settings-toggle-button>
    ` : ''}

    ${this.showSignoutDialog_ ? html `
      <settings-signout-dialog .syncStatus="${this.syncStatus}"
          @close="${this.onSignoutDialogClose_}">
      </settings-signout-dialog>
    ` : ''}


    <cr-toast id="toast">
      <div>$i18n{restartToApplyChanges}</div>
      <cr-button @click="${this.onRestartClick_}">$i18n{restart}</cr-button>
    </cr-toast>

    ${this.shouldShowRelaunchDialog ? html `
      <relaunch-confirmation-dialog .restartType="${RestartType.RESTART}"
          @close="${this.onRelaunchDialogClose}"></relaunch-confirmation-dialog>
    ` : ''}
    <cr-toast id="chromeSigninUserChoiceToast" duration="5000">
      <div>$i18n{chromeSigninChoiceToast}</div>
    </cr-toast>
<!--_html_template_end_-->`;
}
