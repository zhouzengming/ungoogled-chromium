import { html } from '//resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export function getTemplate() {
    return html `<!--_html_template_start_--><style include="settings-shared">
  cr-view-manager [hidden-by-search],
  cr-view-manager[show-all] [slot=view][data-parent-view-id] {
    display: none;
  }
</style>

<cr-view-manager id="viewManager" class="cr-centered-card-container"
    show-all$="[[shouldShowAll]]">

  <settings-autofill-page slot="view" id="parent" prefs="{{prefs}}">
  </settings-autofill-page>

  <settings-contact-info-page slot="view" id="contactInfo"
      data-parent-view-id="parent">
  </settings-contact-info-page>

  <settings-identity-docs-page slot="view" id="identityDocs" prefs="{{prefs}}"
      data-parent-view-id="parent">
  </settings-identity-docs-page>



  <settings-payments-page slot="view" id="payments"
      data-parent-view-id="parent">
  </settings-payments-page>

  <settings-travel-page slot="view" id="travel" prefs="{{prefs}}"
      data-parent-view-id="parent">
  </settings-travel-page>

  <template is="dom-if" if="[[isShoppingEnabled_]]">
    <settings-shopping-page slot="view" id="shopping" prefs="{{prefs}}"
        data-parent-view-id="parent">
    </settings-shopping-page>
  </template>

  <template is="dom-if" if="[[showSuggestionsFromGeminiSettings_]]">
    <settings-suggestions-from-gemini-page slot="view"
        id="suggestionsFromGemini" data-parent-view-id="parent"
        prefs="{{prefs}}">
    </settings-suggestions-from-gemini-page>
  </template>

</cr-view-manager>
<!--_html_template_end_-->`;
}
