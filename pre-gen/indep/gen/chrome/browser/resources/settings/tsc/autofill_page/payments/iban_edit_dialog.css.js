import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss as getCrSharedStyleLit } from 'chrome://resources/cr_elements/cr_shared_style_lit.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import { getCss as getSettingsSharedLit } from '../../settings_shared_lit.css.js';
import '../../settings_vars.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[getCrSharedStyleLit(), getSettingsSharedLit()], css `
cr-input {
  /* Larger cr-input margin (by reserving space for error display). */
  --cr-input-error-display: block;
  margin-bottom: 0;
  width: var(--cr-default-input-max-width);
}

/* Override the padding-top (the space is set by save-to-this-device). */
div[slot='button-container'] {
  padding-top: 0;
}

#saved-to-this-device-only-label {
  /* Overall space between input fields, including space between
     nicknameInput and saved-to-this-device text, between
     saved-to-this-device text and button. */
  margin-bottom: 26px;
  margin-top: 0;
}

#charCount {
  font-size: var(--cr-form-field-label-font-size);
  line-height: var(--cr-form-field-label-line-height);
  padding-inline-start: 8px;
}`]);
}
