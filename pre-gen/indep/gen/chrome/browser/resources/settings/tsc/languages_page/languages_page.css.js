import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss as getCrSharedStyleLit } from 'chrome://resources/cr_elements/cr_shared_style_lit.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import { getCss as getSettingsSharedLit } from '../settings_shared_lit.css.js';
import '../settings_vars.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[getCrSharedStyleLit(), getSettingsSharedLit()], css `
cr-action-menu.complex .dropdown-item {
  min-height: 36px;
}

cr-action-menu:not(.complex) hr {
  display: none;
}

cr-action-menu.complex hr {
  /* Override user-agent border and margin. */
  border: none;
  border-top: var(--cr-separator-line);
  margin: 6px 0 0 0;
}

div.list-item.non-target .target-info {
  display: none;
}

/* Any .target.target-info following another .target element needs to
 * be hidden. We only want to show the _first_ .target-info of the list.
 * This is a way to do a :first-of-class selector. */
div.list-item.target ~ div.list-item.target .target-info {
  display: none;
}

#languagesSectionHeader {
  padding-bottom: 12px;
  padding-top: 12px;
}

`]);
}
