import { css } from '//resources/lit/v3_0/lit.rollup.js';
import '//resources/cr_elements/cr_shared_vars.css.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host {
  display: block;
  margin: 16px;
}

.card {
  border: 1px solid var(--cr-separator-color);
  border-radius: 4px;
  padding: 12px;
}

.badge {
  border-radius: 3px;
  padding: 2px 6px;
}

.badge.connected {
  background-color: var(--google-green-50);
  color: var(--google-green-700);
}

.badge.connecting {
  background-color: var(--google-yellow-50);
  color: var(--google-yellow-900);
}

.badge.disconnected {
  background-color: var(--google-red-50);
  color: var(--google-red-700);
}

@media (prefers-color-scheme: dark) {
  .badge.connected {
    background-color: rgba(var(--google-green-300-rgb), 0.2);
    color: var(--google-green-300);
  }

  .badge.connecting {
    background-color: rgba(var(--google-yellow-300-rgb), 0.2);
    color: var(--google-yellow-300);
  }

  .badge.disconnected {
    background-color: rgba(var(--google-red-300-rgb), 0.2);
    color: var(--google-red-300);
  }
}`]);
}
