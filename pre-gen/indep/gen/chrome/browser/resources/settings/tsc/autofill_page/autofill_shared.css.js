import { html } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
const styleMod = document.createElement('dom-module');
styleMod.appendChild(html `
  <template>
    <style>

.multi-card > .card {
  background-color: var(--cr-card-background-color);
  border-radius: var(--cr-card-border-radius);
  box-shadow: var(--cr-card-shadow);
  margin-top: var(--cr-section-vertical-margin);
}

.multi-card > .card:first-of-type {
  margin-top: 0;
}

.list-with-header > div:first-of-type {
  border-top: var(--cr-separator-line);
}

.type-column {
  align-items: center;
  display: flex;
  flex: 2;
  overflow: hidden;
}

.ellipses {
  flex: 1;
  max-width: fit-content;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
    </style>
  </template>
`.content);
styleMod.register('autofill-shared');
