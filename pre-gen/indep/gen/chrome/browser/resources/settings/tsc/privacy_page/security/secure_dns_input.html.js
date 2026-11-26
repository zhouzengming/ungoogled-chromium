import { html } from '//resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export function getTemplate() {
    return html `<!--_html_template_start_-->    <style>
      :host {
        cursor: auto;
        display: block;
        width: 100%;
      }

      cr-textarea {
        width: 100%;
        --cr-textarea-footer-display: flex;
      }
    </style>
    <!-- Max length of 100 KB to prevent browser from freezing. -->
    <cr-textarea id="input" value="{{value}}" rows=1 autogrow="true"
        placeholder="$i18n{secureDnsCustomPlaceholder}" invalid="[[showError_]]"
        first-footer="[[errorText_]]" maxlength="102400" spellcheck="false"
        on-keypress="onKeyPress_" on-input="onInput_"
        on-blur="validate" on-change="validate">
    </cr-textarea>
<!--_html_template_end_-->`;
}
