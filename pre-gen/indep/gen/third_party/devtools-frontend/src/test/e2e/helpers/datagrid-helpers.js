// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from 'chai';
export async function getDataGridRows(devToolsPage, expectedNumberOfRows, root, matchExactNumberOfRows = true) {
    const dataGrid = !root ? await devToolsPage.waitFor('devtools-data-grid') : root;
    const handlers = await (async () => {
        if (matchExactNumberOfRows) {
            return await devToolsPage.waitForFunction(async () => {
                const rows = await devToolsPage.$$('tbody > tr[jslog]:not(.hidden)', dataGrid);
                return rows.length === expectedNumberOfRows ? rows : undefined;
            });
        }
        return await devToolsPage.waitForFunction(async () => {
            const rows = await devToolsPage.$$('tbody > tr[jslog]:not(.hidden)', dataGrid);
            return rows.length >= expectedNumberOfRows ? rows : undefined;
        });
    })();
    return await Promise.all(handlers.map(handler => devToolsPage.$$('td[jslog]:not(.hidden)', handler)));
}
export async function getDataGridColumnNames(devToolsPage, root) {
    const columnNames = [];
    const dataGrid = !root ? await devToolsPage.waitFor('devtools-data-grid') : root;
    const columnNodes = await dataGrid.$$('pierce/[role="columnheader"]');
    for (const column of columnNodes) {
        const text = await column.evaluate(x => {
            return x.innerText || '';
        });
        columnNames.push(text);
    }
    return columnNames;
}
export async function getDataGrid(devToolsPage, root) {
    const dataGrid = await devToolsPage.waitFor('devtools-data-grid', root);
    assert.isOk(dataGrid, 'Could not find data-grid');
    await devToolsPage.waitForFunction(async () => {
        const height = await dataGrid.evaluate(elem => elem.clientHeight);
        // Give it a chance to fully render into the page.
        return height > 20;
    }, undefined, 'Ensuring the data grid has a minimum height of 20px');
    return dataGrid;
}
export async function getInnerTextOfDataGridCells(devToolsPage, dataGridElement, expectedNumberOfRows, matchExactNumberOfRows = true) {
    const gridRows = await getDataGridRows(devToolsPage, expectedNumberOfRows, dataGridElement, matchExactNumberOfRows);
    const table = [];
    for (const row of gridRows) {
        const textRow = [];
        for (const cell of row.values()) {
            const text = await cell.evaluate(x => {
                return x.innerText || '';
            });
            textRow.push(text);
        }
        table.push(textRow);
    }
    return table;
}
//# sourceMappingURL=datagrid-helpers.js.map