const sheet = new CSSStyleSheet();
sheet.replaceSync(`
html {
  --sp-body-padding: 8px;
  --sp-card-block-padding: 8px;
  --sp-card-inline-padding: 16px;
  --sp-card-padding: var(--sp-card-block-padding) var(--sp-card-inline-padding);
  --sp-card-gap: 12px;

  /* Override default WebUI vars from cr_shared_vars. */
  --cr-primary-text-color: var(--color-side-panel-card-primary-foreground);
  --cr-secondary-text-color: var(--color-side-panel-card-secondary-foreground);
}`);
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
export {};
