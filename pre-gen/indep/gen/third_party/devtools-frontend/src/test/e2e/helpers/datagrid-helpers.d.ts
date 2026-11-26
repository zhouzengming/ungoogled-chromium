import type { ElementHandle } from 'puppeteer-core';
import type { DataGridElement } from '../../../front_end/ui/legacy/components/data_grid/DataGridElement.js';
import type { DevToolsPage } from '../shared/DevToolsPage.js';
export declare function getDataGridRows(devToolsPage: DevToolsPage, expectedNumberOfRows: number, root: ElementHandle<Node> | undefined, matchExactNumberOfRows?: boolean): Promise<Array<Array<ElementHandle<HTMLTableCellElement>>>>;
export declare function getDataGridColumnNames(devToolsPage: DevToolsPage, root: ElementHandle<Node> | undefined): Promise<String[]>;
export declare function getDataGrid(devToolsPage: DevToolsPage, root: ElementHandle | undefined): Promise<ElementHandle<DataGridElement>>;
export declare function getInnerTextOfDataGridCells(devToolsPage: DevToolsPage, dataGridElement: ElementHandle<Element>, expectedNumberOfRows: number, matchExactNumberOfRows?: boolean): Promise<string[][]>;
