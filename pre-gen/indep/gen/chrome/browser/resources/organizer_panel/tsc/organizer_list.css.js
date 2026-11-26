import { css } from '//resources/lit/v3_0/lit.rollup.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host {
  display: block;
}

.divider {
  background-color: var(--color-sys-divider, var(--cr-fallback-color-divider));
  height: 1px;
  margin: 8px 16px;
}`]);
}
