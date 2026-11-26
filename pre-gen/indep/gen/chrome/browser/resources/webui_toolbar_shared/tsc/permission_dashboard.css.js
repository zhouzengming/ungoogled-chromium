import { css } from '//resources/lit/v3_0/lit.rollup.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host {
  align-items: center;
  display: flex;
}

#container {
  align-items: center;
  display: flex;
}

#indicator-chip {
  position: relative;
  /* Keep indicator chip above request chip */
  z-index: 2;
}

#request-chip {
  position: relative;
  z-index: 1;
}`]);
}
