import { css } from '//resources/lit/v3_0/lit.rollup.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host {
  align-items: center;
  display: flex;
  gap: var(--toolbar-icon-default-margin);
  height: 100%;
}

/* In native Views FlexLayout, adjacent expanded buttons collapse their margins
 * (max(5px, 5px) = 5px). In CSS Flexbox, margins are additive. If the
 * preceding avatar button is visible and expanded with a label, its trailing
 * margin already expands the inter-button gap to 5px. Collapse the app menu
 * button's leading margin so the margins do not additively widen to 8px. */
avatar-button[has-label]:not(.overflow-display-none) ~ app-menu-button[has-label] {
  margin-inline-start: 0;
}`]);
}
