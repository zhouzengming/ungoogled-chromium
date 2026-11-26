import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss as getCrSharedStyleLit } from 'chrome://resources/cr_elements/cr_shared_style_lit.css.js';
import { getCss as getMdSelectLit } from 'chrome://resources/cr_elements/md_select_lit.css.js';
import { getCss as getSettingsSharedLit } from '../settings_shared_lit.css.js';
import '../settings_vars.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[getCrSharedStyleLit(), getSettingsSharedLit(), getMdSelectLit()], css `
/* Lines up with cr-input. */
#custom-input {
  /* (cr-input line-height + cr-input top/bottom padding) / 2 -
     cr-radio disc-wrapper height / 2 */
  --cr-radio-button-disc-margin-block-start: calc(
      (1.54em + 12px) / 2 - 8px);
  align-items: start;
}

/* The theme mixes a link and a cr-button divided by a separator with
 * grit expressions and dom-if templates. That leads to a tricky thing
 * to style correctly, these are a workaround. */
#themeRow cr-button,
#toolbarRow cr-button {
  margin-inline-end: 20px;
}

#themeRow .separator,
#toolbarRow .separator  {
  margin-inline-start: 0;
}

#toolbarRow {
  border-top: var(--cr-separator-line);
}

.indented-toggles,
.indented-rows {
  padding-inline-end: 0;
}

.indented-toggles settings-toggle-button,
.indented-rows .cr-row {
  padding-inline-start: 0;
}`]);
}
