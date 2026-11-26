import { css } from '//resources/lit/v3_0/lit.rollup.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
/* Used to hide elements that have overflowed. Distinct from hidden to prevent
 * interactions with other reasons to hide elements, which typically disallow
 * adding elements to the overflow menu.
 */
:host(.overflow-display-none) {
  display: none !important;
}`]);
}
