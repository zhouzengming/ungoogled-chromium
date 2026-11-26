import { css } from '//resources/lit/v3_0/lit.rollup.js';
import { getCss as getCrSharedStyleLit } from '//resources/cr_elements/cr_shared_style_lit.css.js';
import { getCss as getCrIconsLit } from '//resources/cr_elements/cr_icons_lit.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[getCrSharedStyleLit(), getCrIconsLit()], css `
:host {
  --slide-in-start-x: -100%;
  background-color: var(--color-new-tab-page-threads-rail-background);
  display: block;
  height: 100%;
  inset-inline-start: 0;
  position: fixed;
  top: 0;
  z-index: 1001; /* Above the one google bar (1000) z-index. */
  transform: translateX(0);
  transition: transform 300ms cubic-bezier(0.2, 0.0, 0, 1.0);
  animation: slide-in 300ms cubic-bezier(0.2, 0.0, 0, 1.0);
}

/* The slide-in animation is from the opposite side for RTL languages. */
:host-context([dir='rtl']) {
  --slide-in-start-x: 100%;
}

@keyframes slide-in {
  from { transform: translateX(var(--slide-in-start-x)); }
  to { transform: translateX(0); }
}

#rail {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 61px;
  height: 100%;
  padding: 30px 18px 0 18px;
  width: var(--threads-rail-width, 76px);
}

cr-icon-button {
  --cr-icon-button-icon-size: 24px;
  --cr-icon-button-size: 48px;
  --cr-icon-button-focus-outline-color: var(--threads-rail-focus-outline-color);
  --cr-icon-button-fill-color:
    var(--color-new-tab-page-threads-rail-icon-button);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}`]);
}
