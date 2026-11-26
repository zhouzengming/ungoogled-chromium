import { css } from '//resources/lit/v3_0/lit.rollup.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

:host(.modalScrim) {
  filter: brightness(50%);
}

cr-tab-webview {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
  /* We hide background tabs with visibility:hidden and not display:none
   * so that a plugin --- and therefore a SurfaceEmbedConnector --- actually
   * exist in case someone wants to capture them. Similarly, they're taken out
   * of flow with position: absolute and not just sized to 0x0 so they are sized
   * appropriately for capture. */
  visibility: hidden;
  position: absolute;
}

cr-tab-webview.active {
  visibility: visible;
  position: static;
}`]);
}
