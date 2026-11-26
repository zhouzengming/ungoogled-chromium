import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss as getMdSelectLit } from 'chrome://resources/cr_elements/md_select_lit.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[getMdSelectLit()], css `
:host {
  align-items: center;
  display: inline-flex;
}

/* When settings-dropdown-menu is start-aligned, we probably want policy
 * indicator to be displayed after the dropdown.
 * Setting --settings-dropdown-menu-policy-order to 1 will do the job.
 */
cr-policy-pref-indicator {
  height: var(--iron-icon-width, 24px);
  margin: 0 var(--cr-controlled-by-spacing);
  order: var(--settings-dropdown-menu-policy-order, 0);
  width: var(--iron-icon-width, 24px);
}

/* Hide "Custom" value when unselectable. */
option:disabled {
  display: none;
}`]);
}
