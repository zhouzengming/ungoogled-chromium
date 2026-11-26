import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss as getCrSharedStyleLit } from '//resources/cr_elements/cr_shared_style_lit.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[getCrSharedStyleLit()], css `
:host {
  display: block;
  margin: 16px auto 8px;
  max-width: var(--cluster-max-width);
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
}

.filter-chip-container {
  display: flex;
  gap: 8px;
}`]);
}
