import { css } from '//resources/lit/v3_0/lit.rollup.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host {
  display: flex;
}

.favicons {
  --stacked-favicons-overlap_: -2px;
  align-items: center;
  display: flex;
  isolation: isolate;
  justify-content: center;
}

.favicons .favicon {
  background-color: var(--color-list-item-url-favicon-background,
      var(--cr-fallback-color-neutral-container));
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 100%;
  box-shadow: 0 0 0 2px var(--color-list-item-url-favicon-background,
      var(--cr-fallback-color-neutral-container));
  height: 16px;
  position: relative;
  width: 16px;
}

:host(:not([stack-vertically])) .favicons .favicon:not(:first-child) {
  margin-inline-start: var(--stacked-favicons-overlap_);
}

:host([stack-vertically]) .favicons {
  flex-direction: column;
}

:host([stack-vertically]) .favicons .favicon:not(:first-child) {
  margin-block-start: var(--stacked-favicons-overlap_);
}`]);
}
