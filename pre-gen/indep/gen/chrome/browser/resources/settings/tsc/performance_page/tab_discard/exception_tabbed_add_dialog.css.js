import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
cr-tabs {
  --cr-tabs-font-size: 100%;
  --cr-tabs-height: 40px;
}

#dialog {
  --border-top-color: var(--google-grey-300);
  --cr-dialog-body-border-top: 1px solid var(--border-top-color);
}

@media (prefers-color-scheme: dark) {
  #dialog {
    --border-top-color: var(--cr-separator-color);
  }
}

#dialog::part(wrapper) {
  overflow: hidden;
}

#dialog [slot=title] {
  padding-bottom: 8px;
}

#dialog::part(body-container) {
  height: calc(5 * var(--cr-section-min-height) + 2px);
}

/*
 * remove padding as we will introduce the padding on an inner element so as
 * not to cut off the checkbox ripple
 */
#body {
  padding-inline-end: 0;
  padding-inline-start: 0;
}

#helpText {
  padding-bottom: 20px;
}

#helpText > a {
  color: var(--cr-link-color);
}

/*
 * adds horizontal padding to account for the removed padding from the dialog
 * body
 */
#inputPage {
  padding-inline-end: 20px;
  padding-inline-start: 20px;
  padding-top: 20px;
}`]);
}
