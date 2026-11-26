import { html } from '//resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export function getTemplate() {
    return html `<!--_html_template_start_-->    <style include="cr-shared-style settings-shared">
      #profile-icon {
        background: center / cover no-repeat;
        border-radius: 20px;
        flex-shrink: 0;
        height: 40px;
        width: 40px;
      }

      cr-link-row {
        --cr-link-row-icon-width: 40px;
        border-top: var(--cr-separator-line);
      }

      settings-sync-account-control[showing-promo]::part(banner) {
        /* Make the banner image stay within setting-section's card border
           radius. */
        border-top-left-radius: var(--cr-card-border-radius);
        border-top-right-radius: var(--cr-card-border-radius);
      }

      settings-sync-account-control[showing-promo]::part(title) {
        font-size: 1.1rem;
        line-height: 1.625rem;
      }

      #account-card {
        background-color: var(--cr-card-background-color);
        border-radius: var(--cr-card-border-radius);
        box-shadow: var(--cr-card-shadow);
        flex: 1;
        margin-bottom: 20px;
        margin-top: 16px;
        overflow: hidden;
      }

      @media (forced-colors: active) {
        /* Use border instead of box-shadow (which does not work) in Windows
            HCM. */
        #account-card {
          border: var(--cr-border-hcm);
        }
      }
    </style>


  <template is="dom-if" if="[[shouldShowSyncAccountControl_(
      syncStatus.syncSystemEnabled, syncStatus.signedInStatus)]]" restamp>
    <div id="account-card">
      <settings-sync-account-control
          sync-status="[[syncStatus]]"
          prefs="{{prefs}}"
          promo-label-with-account="$i18n{peopleSignInPrompt}"
          promo-label-with-no-account="$i18n{peopleSignInPrompt}"
          promo-secondary-label-with-account=
              "$i18n{peopleSignInPromptSecondaryWithAccount}"
          promo-secondary-label-with-no-account=
              "$i18n{peopleSignInPromptSecondaryWithNoAccount}"
          access-point="[[accessPointEnum_.SETTINGS_YOUR_SAVED_INFO]]">
      </settings-sync-account-control>
    </div>
  </template>
  <template is="dom-if" if="[[shouldLinkToAccountSettingsPage_(
      syncStatus.signedInState)]]" restamp>
    <div id="account-card">
      <cr-link-row id="account-subpage-row" class="cr-row first"
          on-click="onAccountClick_">
        <div id="profile-icon"
            style="background-image: [[getIconImageSet_(
                primaryAccountIconUrl_)]]">
        </div>
        <div class="cr-row-gap cr-padded-text flex no-min-width">
          <div id="account-name" class="text-elide">
            [[primaryAccountName_]]
          </div>
          <div id="account-subtitle" class="secondary">
            [[getAccountRowSubtitle_(primaryAccountEmail_, syncStatus)]]
          </div>
        </div>
      </cr-link-row>
    </div>
  </template>



<!--_html_template_end_-->`;
}
