import type * as puppeteer from 'puppeteer-core';
import type * as Host from '../../../front_end/core/host/host.js';
import { AsyncScope } from '../../conductor/async-scope.js';
import type { DevToolsPage } from '../shared/DevToolsPage.js';
import type { InspectedPage } from '../shared/InspectedPage.js';
export declare const ELEMENTS_PANEL_SELECTOR = ".panel[aria-label=\"elements\"]";
export declare const SECTION_SUBTITLE_SELECTOR = ".styles-section-subtitle";
export declare const INACTIVE_GRID_ADORNER_SELECTOR = "[aria-label=\"Enable grid mode\"]";
export declare const ACTIVE_GRID_ADORNER_SELECTOR = "[aria-label=\"Disable grid mode\"]";
export declare const INACTIVE_STARTING_STYLE_ADORNER_SELECTOR = "[aria-label=\"Enable @starting-style mode\"]";
export declare const ACTIVE_STARTING_STYLE_ADORNER_SELECTOR = "[aria-label=\"Disable @starting-style mode\"]";
export declare const STYLE_PROPERTIES_SELECTOR = ".tree-outline-disclosure [role=\"treeitem\"]";
export declare const SEARCH_BOX_SELECTOR = ".search-bar";
export declare const EMULATE_FOCUSED_PAGE = "Emulate a focused page";
export declare const openLayoutPane: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const waitForAdorners: (devToolsPage: DevToolsPage, expectedAdorners: Array<{
    textContent: string;
    isActive: boolean;
}>, activeSelector?: string) => Promise<void>;
export declare const toggleAdornerSetting: (devToolsPage: DevToolsPage, type: string) => Promise<void>;
export declare const waitForSelectedNodeToBeExpanded: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const waitForAdornerOnSelectedNode: (devToolsPage: DevToolsPage, expectedAdornerText: string) => Promise<void>;
export declare const waitForSpecificAdornerOnSelectedNode: (devToolsPage: DevToolsPage, selector: string) => Promise<void>;
export declare const waitForNoAdornersOnSelectedNode: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const toggleElementCheckboxInLayoutPane: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const getGridsInLayoutPane: (devToolsPage: DevToolsPage) => Promise<Array<puppeteer.ElementHandle<Element>>>;
export declare const waitForSomeGridsInLayoutPane: (devToolsPage: DevToolsPage, minimumGridCount: number) => Promise<void>;
export declare const waitForContentOfSelectedElementsNode: (devToolsPage: DevToolsPage, expectedTextContent: string) => Promise<void>;
export declare const waitForPartialContentOfSelectedElementsNode: (devToolsPage: DevToolsPage, expectedPartialTextContent: string) => Promise<void>;
/**
 * Gets the text content of the currently selected element.
 */
export declare const getContentOfSelectedNode: (devToolsPage: DevToolsPage) => Promise<string>;
export declare const waitForSelectedNodeChange: (devToolsPage: DevToolsPage, initialValue: string, asyncScope?: AsyncScope) => Promise<void>;
export declare const assertSelectedElementsNodeTextIncludes: (devToolsPage: DevToolsPage, expectedTextContent: string) => Promise<void>;
export declare const waitForSelectedTreeElementSelectorWithTextcontent: (devToolsPage: DevToolsPage, expectedTextContent: string) => Promise<void>;
export declare const waitForSelectedTreeElementSelectorWhichIncludesText: (devToolsPage: DevToolsPage, expectedTextContent: string) => Promise<void>;
export declare const waitForChildrenOfSelectedElementNode: (devToolsPage: DevToolsPage, partialTexts?: string[]) => Promise<true>;
export declare const waitForAndClickTreeElementWithPartialText: (devToolsPage: DevToolsPage, text: string, jslogContext?: string) => Promise<void>;
export declare const waitForElementWithPartialText: (devToolsPage: DevToolsPage, text: string) => Promise<puppeteer.ElementHandle<Element>>;
export declare const elementWithPartialText: (devToolsPage: DevToolsPage, text: string) => Promise<puppeteer.ElementHandle<Element> | null>;
export declare const clickTreeElementWithPartialText: (devToolsPage: DevToolsPage, text: string, jslogContext?: string) => Promise<boolean>;
export declare const clickNthChildOfSelectedElementNode: (devToolsPage: DevToolsPage, childIndex: number) => Promise<void>;
export declare const focusElementsTree: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const navigateToSidePane: (devToolsPage: DevToolsPage, paneName: string) => Promise<void>;
export declare const waitForElementsStyleSection: (devToolsPage: DevToolsPage, expectedNodeText?: string | null) => Promise<void>;
export declare const waitForElementsDOMBreakpointsSection: (devToolsPage: DevToolsPage) => Promise<void>;
export declare function getDOMBreakpoints(devToolsPage: DevToolsPage): Promise<puppeteer.ElementHandle<Element> | null>;
export declare const isDOMBreakpointEnabled: (devToolsPage: DevToolsPage, breakpoint: puppeteer.ElementHandle<Element>) => Promise<boolean>;
export declare const setDOMBreakpointOnSelectedNode: (devToolsPage: DevToolsPage, type: string) => Promise<void>;
export declare const toggleDOMBreakpointCheckbox: (devToolsPage: DevToolsPage, breakpoint: puppeteer.ElementHandle<Element>, wantChecked: boolean) => Promise<void>;
export declare const waitForElementsComputedSection: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const getContentOfComputedPane: (devToolsPage: DevToolsPage) => Promise<string>;
export declare const waitForComputedPaneChange: (devToolsPage: DevToolsPage, initialValue: string) => Promise<void>;
export declare const getAllPropertiesFromComputedPane: (devToolsPage: DevToolsPage) => Promise<Array<{
    name: string;
    value: string;
}>>;
export declare const getPropertyFromComputedPane: (devToolsPage: DevToolsPage, name: string) => Promise<puppeteer.ElementHandle<Element> | undefined>;
export declare const expandSelectedNodeRecursively: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const findElementById: (devToolsPage: DevToolsPage, id: string) => Promise<void>;
export declare const showForceState: (devToolsPage: DevToolsPage, specificStates?: boolean) => Promise<void>;
export declare const forcePseudoState: (devToolsPage: DevToolsPage, pseudoState: string, specificStates?: boolean) => Promise<void>;
export declare const removePseudoState: (devToolsPage: DevToolsPage, pseudoState: string) => Promise<void>;
export declare const getComputedStylesForDomNode: <K extends keyof CSSStyleDeclaration>(inspectedPage: InspectedPage, elementSelector: string, styleAttribute: K) => Promise<CSSStyleDeclaration[K]>;
export declare const waitForNumberOfComputedProperties: (devToolsPage: DevToolsPage, numberToWaitFor: number) => Promise<true>;
export declare const getComputedPanel: (devToolsPage: DevToolsPage) => Promise<puppeteer.ElementHandle<Element>>;
export declare const filterComputedProperties: (devToolsPage: DevToolsPage, filterString: string) => Promise<void>;
export declare const toggleShowAllComputedProperties: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const waitForDomNodeToBeVisible: (inspectedPage: InspectedPage, elementSelector: string) => Promise<void>;
export declare const waitForDomNodeToBeHidden: (inspectedPage: InspectedPage, elementSelector: string) => Promise<void>;
export declare const assertGutterDecorationForDomNodeExists: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const getStyleRuleSelector: (selector: string) => string;
export declare const waitForExactStyleRule: (devToolsPage: DevToolsPage, expectedSelector: string) => Promise<void>;
export declare const waitForStyleRule: (devToolsPage: DevToolsPage, expectedSelector: string) => Promise<void>;
export declare const getComputedStyleProperties: (devToolsPage: DevToolsPage) => Promise<Array<{
    name: string;
    value: string;
    trace: Array<{
        value: string;
        selector: string;
        link: string;
    }>;
}>>;
export declare const getDisplayedCSSDeclarations: (devToolsPage: DevToolsPage) => Promise<string[]>;
export declare const getDisplayedStyleRulesCompact: (devToolsPage: DevToolsPage) => Promise<Array<{
    selectorText: string;
    propertyNames: string[];
}>>;
export declare const getDisplayedStyleRules: (devToolsPage: DevToolsPage) => Promise<Array<{
    selectorText: string;
    propertyData: Array<{
        propertyName: string;
        isOverLoaded: boolean | undefined;
        isInherited: boolean | undefined;
    }>;
}>>;
/**
 * @param propertiesSection The element containing this properties section.
 * @returns an array with an entry for each property in the section. Each entry has:
 * - propertyName: The name of this property.
 * - isOverloaded: True if this is an inherited properties section, and this property is overloaded by a child node.
 *                 The property will be shown as crossed out in the style pane.
 * - isInherited: True if this is an inherited properties section, and this property is a non-inherited CSS property.
 *                The property will be shown as grayed-out in the style pane.
 */
export declare const getDisplayedCSSPropertyData: (devToolsPage: DevToolsPage, propertiesSection: puppeteer.ElementHandle<Element>) => Promise<Array<{
    propertyName: string;
    isOverLoaded: boolean | undefined;
    isInherited: boolean | undefined;
}>>;
export declare const getDisplayedCSSPropertyNames: (devToolsPage: DevToolsPage, propertiesSection: puppeteer.ElementHandle<Element>) => Promise<string[]>;
export declare const getStyleRule: (devToolsPage: DevToolsPage, selector: string) => Promise<puppeteer.ElementHandle<Element>>;
export declare const getStyleRuleWithSourcePosition: (devToolsPage: DevToolsPage, styleSelector: string, sourcePosition: string | undefined) => Promise<puppeteer.ElementHandle<Element>>;
export declare const getColorSwatch: (devToolsPage: DevToolsPage, parent: puppeteer.ElementHandle<Element> | undefined, index: number) => Promise<puppeteer.ElementHandle<Element>>;
export declare const getColorSwatchColor: (devToolsPage: DevToolsPage, parent: puppeteer.ElementHandle<Element>, index: number) => Promise<string>;
export declare const shiftClickColorSwatch: (devToolsPage: DevToolsPage, parent: puppeteer.ElementHandle<Element>, index: number, parentVe: string) => Promise<void>;
export declare const getStyleSectionSubtitles: (devToolsPage: DevToolsPage) => Promise<string[]>;
export declare const getCSSPropertyInRule: (devToolsPage: DevToolsPage, ruleSection: puppeteer.ElementHandle<Element> | string, name: string, sourcePosition?: string | undefined) => Promise<puppeteer.ElementHandle<HTMLElement> | undefined>;
export declare const focusCSSPropertyValue: (devToolsPage: DevToolsPage, selector: string, propertyName: string) => Promise<void>;
/**
 * Edit a CSS property value in a given rule
 * @param selector The selector of the rule to be updated. Note that because of the way the Styles populates, it is
 * important to provide a rule selector that is unique here, to avoid editing a property in the wrong rule.
 * @param propertyName The name of the property to be found and edited. If several properties have the same names, the
 * first one is edited.
 * @param newValue The new value to be used.
 */
export declare function editCSSProperty(devToolsPage: DevToolsPage, selector: string, propertyName: string, newValue: string): Promise<void>;
/** Edit a media or container query rule text for the given styles section **/
export declare function editQueryRuleText(devToolsPage: DevToolsPage, queryStylesSections: puppeteer.ElementHandle<Element>, newQueryText: string, willDelete?: boolean): Promise<void>;
export declare function waitForCSSPropertyValue(devToolsPage: DevToolsPage, selector: string, name: string, value: string, sourcePosition: string | undefined): Promise<puppeteer.ElementHandle<Element>>;
export declare function waitForPropertyToHighlight(devToolsPage: DevToolsPage, ruleSelector: string, propertyName: string): Promise<void>;
export declare const getBreadcrumbsTextContent: (devToolsPage: DevToolsPage, { expectedNodeCount }: {
    expectedNodeCount: number;
}) => Promise<string[]>;
export declare const getSelectedBreadcrumbTextContent: (devToolsPage: DevToolsPage) => Promise<string>;
export declare const navigateToElementsTab: (devToolsPage: DevToolsPage, options?: {
    expectExistingPanel: boolean;
}) => Promise<void>;
export declare const clickOnFirstLinkInStylesPanel: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const toggleClassesPane: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const typeInClassesPaneInput: (devToolsPage: DevToolsPage, text: string, commitWith?: puppeteer.KeyInput, waitForNodeChange?: boolean) => Promise<void>;
export declare const toggleClassesPaneCheckbox: (devToolsPage: DevToolsPage, checkboxLabel: string) => Promise<void>;
export declare const assertSelectedNodeClasses: (devToolsPage: DevToolsPage, expectedClasses: string[]) => Promise<void>;
export declare const toggleAccessibilityPane: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const toggleAccessibilityTree: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const getPropertiesWithHints: (devToolsPage: DevToolsPage) => Promise<string[]>;
export declare const summonAndWaitForSearchBox: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const assertSearchResultMatchesText: (devToolsPage: DevToolsPage, text: string) => Promise<void>;
export declare const goToResourceAndWaitForStyleSection: (devToolsPage: DevToolsPage, inspectedPage: InspectedPage, path: string) => Promise<void>;
export declare const checkStyleAttributes: (devToolsPage: DevToolsPage, expectedStyles: string[]) => Promise<boolean>;
export declare const TEXT_PROMPT_GHOST_TEXT_SELECTOR = ".auto-complete-text";
export declare const GHOST_VALUE_PREDICTION_SELECTOR = ".ghost-value-prediction";
export declare const GHOST_ROW_SELECTOR = ".ghost-row";
declare global {
    interface Window {
        __lastAidaRequest: string;
    }
}
export declare const mockAidaCodeComplete: (devToolsPage: DevToolsPage, response: Host.AidaClient.CompletionResponse) => Promise<void>;
export declare const getLastAidaRequest: (devToolsPage: DevToolsPage) => Promise<string>;
export declare const getGhostTextInCurrentTextPrompt: (devToolsPage: DevToolsPage) => Promise<string | null>;
export declare const getGhostText: (devToolsPage: DevToolsPage) => Promise<string | null>;
export declare const getMultilineGhostElements: (devToolsPage: DevToolsPage) => Promise<string[]>;
export declare const getAccessibilityTreeNodeSelector: (textContent: string) => string;
