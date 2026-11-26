import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss as getCrSharedStyleLit } from 'chrome://resources/cr_elements/cr_shared_style_lit.css.js';
import { getCss as getSettingsSharedLit } from '../settings_shared_lit.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[getCrSharedStyleLit(), getSettingsSharedLit()], css `
/* Override the default padding of a cr-row to 0. The template inside has
   left and right padding. */
.cr-row-with-template {
  padding: 0;
}

/* Ensure the toggle button stretches the width of its container despite
   removing its parent's padding. */
#liveCaptionToggleButton {
  width: 100%;
}

.language-dropdown {
  margin-inline-start: auto;
}

.subsection-group {
  padding-bottom: 10px;
}

/* Ensure the toggle button stretches the width of its container despite
   removing its parent's padding. */
#liveTranslateToggleButton {
  width: 100%;
}`]);
}
