// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * The following custom query all implement the same traversal logic and as such
 * it would be nice if we could refactor this out instead of repeating ourselves.
 * But because the handlers will be stringified and sent over the wire through
 * CDP, we need the functions to be completely self-contained and not refer any
 * names from the outer scope. This means that such a refactoring can only be
 * achieved by using reflection, which we decided against.
 */
export const querySelectorShadowTextOne = (element, text) => {
    let found = null;
    const search = (root) => {
        const iter = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
        do {
            const currentNode = iter.currentNode;
            if (currentNode.shadowRoot) {
                search(currentNode.shadowRoot);
            }
            if (currentNode instanceof ShadowRoot) {
                continue;
            }
            if (!found && currentNode.textContent === text) {
                found = currentNode;
            }
        } while (!found && iter.nextNode());
    };
    if (element instanceof Document) {
        element = element.documentElement;
    }
    search(element);
    return found;
};
export const querySelectorShadowTextAll = (element, selector) => {
    const result = [];
    const collect = (root) => {
        const iter = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
        do {
            const currentNode = iter.currentNode;
            if (currentNode.shadowRoot) {
                collect(currentNode.shadowRoot);
            }
            if (currentNode instanceof ShadowRoot) {
                continue;
            }
            if (currentNode.textContent === selector) {
                result.push(currentNode);
            }
        } while (iter.nextNode());
    };
    if (element instanceof Document) {
        element = element.documentElement;
    }
    collect(element);
    return result;
};
//# sourceMappingURL=custom-query-handlers.js.map