import { css } from '//resources/lit/v3_0/lit.rollup.js';
import { getCss as getSpSharedStyle } from 'chrome://customize-chrome-side-panel.top-chrome/shared/sp_shared_style.css.js';
import { getCss as getToggleContainerShared } from './toggle_container_shared.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[getSpSharedStyle(), getToggleContainerShared()], css `
#options {
  align-items: center;
  display: flex;
  line-height: inherit;
  margin: 0;
}

cr-collapse {
  --iron-collapse-transition-duration: 300ms;
  width: 100%;
}

cr-radio-group {
  --cr-radio-group-item-padding: 0px;
  width: 100%;
}

.option {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: var(--sp-card-padding);
  padding-inline-start: 32px;
}

.sub-options .option {
  padding-inline-start: 48px;
}

.option:hover {
  background-color: var(--cr-hover-background-color);
  cursor: pointer;
}

.option:focus {
  background-color: var(--cr-menu-background-focus-color);
  outline: none;
}

.option[hidden] {
  display: none;
}

/**
 * Members of this class are accessible text not meant to be seen by the user.
 * Screen readers ignore elements styled with display:none or
 * visibility:hidden so we hide it this way instead.
 */
.button-aria-describedby {
  clip: rect(0,0,0,0);
  display: block;
  position: fixed;
}

customize-chrome-button-label {
  flex: 1;
}

cr-radio-button {
  gap: 0;
}

cr-checkbox {
  gap: 0;
}

.sp-hr {
  margin: var(--sp-card-block-padding) var(--sp-card-inline-padding);
  width: auto;
}`]);
}
