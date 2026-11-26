import { css } from '//resources/lit/v3_0/lit.rollup.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host(:not([hidden])) {
  display: block;
}

#iframe {
  border: none;
  border-radius: inherit;
  display: block;
  height: inherit;
  max-height: inherit;
  max-width: inherit;
  width: inherit;
}`]);
}
