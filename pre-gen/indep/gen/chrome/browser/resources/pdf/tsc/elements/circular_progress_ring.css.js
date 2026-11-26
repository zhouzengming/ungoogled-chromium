import { css } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host {
  display: contents;
}

#progressRing {
  width: 28px;
  height: 28px;
  position: absolute;
  transform: rotate(-90deg);
}

/* Disable for the following block since these are SVG DOM nodes and the
 * property values are valid. */
/* stylelint-disable declaration-property-value-no-unknown */
#innerProgress,
#progressTrack {
  r: 90;
  cx: 100;
  cy: 100;
  fill: transparent;
  stroke-width: 16px;
}
/* stylelint-enable declaration-property-value-no-unknown */

#progressTrack {
  /* Force dark mode colors even in light mode. */
  stroke: rgb(117, 117, 117);

  @media (prefers-color-scheme: dark) {
    stroke: var(--cr-fallback-color-neutral-outline);
  }
}

#innerProgress {
  stroke-linecap: round;
  stroke-dasharray: 565.48px;

  /* The following is to force using the same dark mode color even
   * in light mode. */
  stroke: var(--cr-fallback-color-inverse-primary);

  @media (prefers-color-scheme: dark) {
    stroke: var(--cr-fallback-color-primary);
  }
}`]);
}
