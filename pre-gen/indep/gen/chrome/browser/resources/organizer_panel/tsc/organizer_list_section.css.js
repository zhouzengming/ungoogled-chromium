import { css } from '//resources/lit/v3_0/lit.rollup.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host {
  display: block;
}

#header {
  align-items: center;
  color: var(--cr-secondary-text-color);
  display: flex;
  font-size: 9px;
  font-weight: 700;
  line-height: 16px;
  margin: 8px 16px;
  text-transform: uppercase;
}

#noResults {
  color: var(--cr-secondary-text-color);
  font-size: 12px;
  margin: 8px 16px;
}

#collapse {
  height: 0;
  interpolate-size: allow-keywords;
  overflow: hidden;
  transition: height 300ms ease-out, visibility 0s 300ms;
  visibility: hidden;
}

:host([expanded_]) #collapse {
  height: auto;
  transition: height 300ms ease-out;
  visibility: visible;
}

#expandButton::part(iconContainer) {
  background: none;
  margin-inline-end: 4px;
  width: 40px;
}

#expandButtonIcon {
  --iron-icon-height: 16px;
  --iron-icon-width: 16px;
}`]);
}
