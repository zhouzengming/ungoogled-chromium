/**
 * @fileoverview Mixin for scrollable containers with <iron-list>.
 *
 * Any containers with the 'scrollable' attribute set will have the following
 * classes toggled appropriately: can-scroll, is-scrolled, scrolled-to-bottom.
 * These classes are used to style the container div and list elements
 * appropriately, see cr_shared_style.css.
 *
 * The associated HTML should look something like:
 *   <div id="container" scrollable>
 *     <iron-list items="[[items]]" scroll-target="container">
 *       <template>
 *         <my-element item="[[item]] tabindex$="[[tabIndex]]"></my-element>
 *       </template>
 *     </iron-list>
 *   </div>
 *
 * In order to get correct keyboard focus (tab) behavior within the list,
 * any elements with tabbable sub-elements also need to set tabindex, e.g:
 *
 * <dom-module id="my-element>
 *   <template>
 *     ...
 *     <paper-icon-button toggles active="{{opened}}" tabindex$="[[tabindex]]">
 *   </template>
 * </dom-module>
 *
 * NOTE: If 'container' is not fixed size, it is important to call
 * updateScrollableContents() when [[items]] changes, otherwise the container
 * will not be sized correctly.
 */
import type { PolymerElement } from '//resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { IronListElement } from '//resources/polymer/v3_0/iron-list/iron-list.js';
type Constructor<T> = new (...args: any[]) => T;
export declare const ScrollableMixin: <T extends Constructor<PolymerElement>>(superClass: T) => T & Constructor<ScrollableMixinInterface>;
export interface ScrollableMixinInterface {
    updateScrollableContents(): void;
    requestUpdateScroll(): void;
    saveScroll(list: IronListElement): void;
    restoreScroll(list: IronListElement): void;
}
export {};
