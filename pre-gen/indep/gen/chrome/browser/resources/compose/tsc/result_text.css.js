import { css } from '//resources/lit/v3_0/lit.rollup.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
.result-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  user-select: text;
  outline: none;
  cursor: text;
  padding-bottom: 1lh;
  /*One line high, to avoid resizing after first word is added.*/
  min-height: 1lh;
}

@keyframes text-fade-in {
  from { opacity: 0;}
  to {opacity: 1;}
}

/* Each word fades in when streaming. */
#partialResultText span {
  animation-name: text-fade-in;
  animation-duration: 200ms;
  animation-timing-function: linear;
}

#root[hidden],
#resultText[hidden],
#partialResultText[hidden] {
  display: none;
}`]);
}
