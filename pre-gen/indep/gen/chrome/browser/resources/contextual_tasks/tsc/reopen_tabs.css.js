import { css } from '//resources/lit/v3_0/lit.rollup.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host {
  display: block;
  width: 100%;
}

#reopenContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background-color: var(--cr-fallback-color-tonal-container);
  border-radius: 12px;
  margin-top: 12px;
}

#reopenText {
  flex: 1;
  font-size: 13px;
  font-weight: 400;
  color: var(--cr-fallback-color-on-tonal-container);
}

.reopen-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

cr-button {
  --cr-button-height: 28px;
  border: none;
  font-size: 13px;
}

cr-icon-button {
  --cr-icon-button-size: 28px;
  --cr-icon-button-icon-size: 20px;
  margin: 0;
}`]);
}
