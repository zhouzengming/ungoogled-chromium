import { css } from '//resources/lit/v3_0/lit.rollup.js';
let instance = null;
export function getCss() {
    return instance || (instance = [...[], css `
:host {
  display: block;
}

#crUrlListItem {
  --organizer-list-section-item-trailing-icon-size_: 16px;
  --organizer-list-section-item-trailing-button-size_: 24px;
}

#crUrlListItem::part(iconContainer) {
  background: none;
  margin-inline-end: 4px;
  width: 40px;
}

#content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  width: 100%;
}

#crUrlListItem[size=compact] #content {
  align-items: center;
  flex-direction: row;
}

#trailingIcon {
  --iron-icon-height: var(--organizer-list-section-item-trailing-icon-size_);
  --iron-icon-width: var(--organizer-list-section-item-trailing-icon-size_);
}

#trailingIcon.has-action-button {
  margin-inline-end: 0;
  padding: calc((var(--organizer-list-section-item-trailing-button-size_) -
      var(--organizer-list-section-item-trailing-icon-size_)) / 2);
}

#actionButton {
  --cr-icon-button-icon-size:
      var(--organizer-list-section-item-trailing-icon-size_);
  --cr-icon-button-margin-end: 0;
  --cr-icon-button-margin-start: 0;
  --cr-icon-button-size:
      var(--organizer-list-section-item-trailing-button-size_);
  display: none;
}

:host(:hover) #actionButton,
:host(.hovered) #actionButton,
:host(:focus-within) #actionButton,
#crUrlListItem.hovered #actionButton {
  display: inline-flex;
}

:host(:hover) #trailingIcon.has-action-button,
:host(.hovered) #trailingIcon.has-action-button,
:host(:focus-within) #trailingIcon.has-action-button,
#crUrlListItem.hovered #trailingIcon.has-action-button {
  display: none;
}`]);
}
