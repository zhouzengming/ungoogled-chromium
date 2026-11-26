import {css, CSSResultGroup} from 'chrome://resources/lit/v3_0/lit.rollup.js';


let instance: CSSResultGroup|null = null;
export function getCss(): CSSResultGroup {
  return instance || (instance = [...[], css`:host{align-items:center;display:inline-flex;justify-content:flex-start;margin:0;padding:0;width:fit-content}#faviconGroup{--composebox-favicon-border-color:var(--color-favicons-border,#f2f2f2)}@media (prefers-color-scheme:dark){#faviconGroup{--composebox-favicon-border-color:var(--color-favicons-border,#1f1f1f)}}`]);
}