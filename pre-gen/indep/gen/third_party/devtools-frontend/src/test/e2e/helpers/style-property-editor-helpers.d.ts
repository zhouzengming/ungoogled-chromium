import type { DevToolsPage } from '../shared/DevToolsPage.js';
export declare function clickStylePropertyEditorButton(devToolsPage: DevToolsPage, title: string, editorElement: 'devtools-grid-editor' | 'devtools-flexbox-editor' | 'devtools-grid-lanes-editor'): Promise<void>;
export declare function clickPropertyButton(devToolsPage: DevToolsPage, selector: string): Promise<void>;
