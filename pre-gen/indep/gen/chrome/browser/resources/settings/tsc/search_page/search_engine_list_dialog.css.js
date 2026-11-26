import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss as getCrSharedStyleLit } from 'chrome://resources/cr_elements/cr_shared_style_lit.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import { getCss as getSettingsSharedLit } from '../settings_shared_lit.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[getCrSharedStyleLit(), getSettingsSharedLit()], css `
.subtitle {
  font-size: 0.75rem;
  line-height: 22px;
}

.title {
  margin: 0 0 16px;
}

.dialog-body {
  color: var(--cr-primary-text-color);
}

.search-engine {
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: 16px;
}

.search-engine cr-policy-indicator {
  margin-inline-start: auto;
  margin-inline-end: 8px;
}

#setAsDefaultButton {
  margin-inline-start: 12px;
}

#saveGuestChoiceCheckbox {
  margin-right: auto;
}

cr-dialog {
  --cr-dialog-body-padding-horizontal: 16px;
  --cr-dialog-button-container-padding-horizontal: 24px;
  --cr-dialog-button-container-padding-bottom: 24px;
  --cr-dialog-button-container-padding-top: 24px;
  --cr-dialog-title-slot-padding-bottom: 16px;
  --cr-dialog-title-slot-padding-end: 16px;
  --cr-dialog-title-slot-padding-start: 16px;
  --cr-dialog-title-slot-padding-top: 16px;
}

cr-dialog::part(body-container) {
  max-height: 360px;
}

cr-radio-button {
  --cr-radio-button-size: 20px;
  margin: 0 16px;
}
`]);
}
