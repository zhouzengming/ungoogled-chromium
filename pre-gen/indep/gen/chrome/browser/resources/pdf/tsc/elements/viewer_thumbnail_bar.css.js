import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host(:focus) {
  outline: none;
}

#thumbnails {
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  padding-bottom: 24px;
  padding-inline-end: var(--viewer-thumbnail-bar-padding-inline-end);
  text-align: center;
}

viewer-thumbnail {
  padding-top: 24px;
}`]);
}
