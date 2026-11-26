import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss as getCrSharedStyleLit } from 'chrome://resources/cr_elements/cr_shared_style_lit.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import { getCss as getMdSelectLit } from 'chrome://resources/cr_elements/md_select_lit.css.js';
import { getCss as getSettingsSharedLit } from '../../settings_shared_lit.css.js';
import '../../settings_vars.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[getCrSharedStyleLit(), getSettingsSharedLit(), getMdSelectLit()], css `
cr-input {
  /* Larger cr-input margin (by reserving space for error display). */
  --cr-input-error-display: block;
  margin-bottom: 0;
  width: var(--cr-default-input-max-width);
}

.md-select + .md-select {
  margin-inline-start: 8px;
}

#numberInput {
  /* Add a larger gap between the card input and the 'Expiration date'
     text, as the default height for cr-input does not leave enough room
     for the error text when it is visible. */
  margin-bottom: 10px;
}

#month {
  width: 70px;
}

#cvcInput {
  width: 132px;
}

#cvcImage {
  margin-inline-start: 10px;
}

#saved-to-this-device-only-label {
  /* Overall space between input fields, including space between
     nicknameInput and saved-to-this-device text, between
     saved-to-this-device text and button. */
  margin-bottom: 10px;
  margin-top: 0;
}

#year {
  width: 100px;
}

/* For nickname input, cr-input-width is the same as other input fields */
#nicknameInput {
  --cr-input-width: var(--cr-default-input-max-width);
  width: fit-content;
}

#charCount {
  font-size: var(--cr-form-field-label-font-size);
  line-height: var(--cr-form-field-label-line-height);
  padding-inline-start: 8px;
}

/* Same style as cr-input error except margin-top. */
#expiredError {
  display: block;
  font-size: var(--cr-form-field-label-font-size);
  height: var(--cr-form-field-label-height);
  line-height: var(--cr-form-field-label-line-height);
  margin: 8px 0;
  visibility: hidden;
}

:host([expired_]) #expiredError {
  visibility: visible;
}

#expiredError,
:host([expired_]) #expiration {
  color: var(--google-red-600);
}

@media (prefers-color-scheme: dark) {
  #expiredError,
  :host([expired_]) #expiration {
    color: var(--google-red-300);
  }
}`]);
}
