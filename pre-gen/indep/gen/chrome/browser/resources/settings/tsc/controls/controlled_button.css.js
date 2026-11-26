import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host {
  --justify-margin: 8px;
  align-items: center;
  display: flex;
}

:host([enforced_]) {
  /* Disable pointer events for this whole element, as outer on-click gets
   * triggered when clicking anywhere in :host. */
  pointer-events: none;
}

cr-policy-pref-indicator {
  /* Enable pointer events for the indicator so :hover works. Disable
   * clicks via onIndicatorClick_ so outer on-click doesn't trigger. */
  pointer-events: all;
}

:host(:not([end-justified])) cr-policy-pref-indicator {
  margin-inline-start: var(--cr-controlled-by-spacing);
}

:host([end-justified]) cr-policy-pref-indicator {
  margin-inline-end: var(--cr-controlled-by-spacing);
  margin-inline-start: calc(
      var(--cr-controlled-by-spacing) - var(--justify-margin));
  order: -1;
}`]);
}
