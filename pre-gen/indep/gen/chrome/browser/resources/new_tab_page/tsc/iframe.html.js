import { html } from '//resources/lit/v3_0/lit.rollup.js';
export function getHtml() {
    return html `<!--_html_template_start_--><iframe id="iframe" .src="${this.getSrc_()}">
</iframe>
<!--_html_template_end_-->`;
}
