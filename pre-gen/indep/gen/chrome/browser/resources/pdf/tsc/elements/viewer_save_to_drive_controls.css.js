import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss as getPdfShared } from './pdf_shared.css.js';
import { getCss as getViewerSaveControlsShared } from './viewer_save_controls_shared.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[getPdfShared(), getViewerSaveControlsShared()], css `
:host {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

:host([state='uploading']) #save {
  z-index: 1;

  /* The following is to force using the same dark mode color even
   * in light mode. */
  --pdf-toolbar-text-color: var(--cr-fallback-color-inverse-primary);

  @media (prefers-color-scheme: dark) {
    --pdf-toolbar-text-color: var(--cr-fallback-color-primary);
  }
}`]);
}
