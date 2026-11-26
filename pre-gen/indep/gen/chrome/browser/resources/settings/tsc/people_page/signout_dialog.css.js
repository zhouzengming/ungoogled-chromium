import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss as getSettingsSharedLit } from '../settings_shared_lit.css.js';
import { getCss as getCrSharedStyleLit } from 'chrome://resources/cr_elements/cr_shared_style_lit.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[getCrSharedStyleLit(), getSettingsSharedLit()], css `
.delete-profile-warning {
  padding-bottom: 10px;
  padding-inline-end: var(--cr-section-padding);
  /* In order to line up with the checkbox text. */
  padding-inline-start: calc(var(--cr-section-padding) + 32px);
  padding-top: 10px;
}

#wideFooter {
  /* Override the cr-dialog footer padding. */
  padding: 0;
}

#dialog-body {
  /* Add space for the link focus ring. See https://crbug.com/41432789. */
  padding-bottom: 2px;
}`]);
}
