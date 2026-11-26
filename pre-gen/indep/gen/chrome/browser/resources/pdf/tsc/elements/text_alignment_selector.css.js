import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host {
  display: inline-block;
}

cr-radio-group {
  /* gap instead of cr-radio-group-item-padding to have no start/end padding. */
  --cr-radio-group-item-padding: 0;
  display: flex;
  gap: 16px;
  justify-content: center;
}`]);
}
