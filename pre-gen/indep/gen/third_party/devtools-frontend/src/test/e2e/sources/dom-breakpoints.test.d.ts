declare global {
    function appendElementToOpenShadowRoot(childId: string): void;
    function appendElementToAuthorShadowTree(parentId: string, childId: string): void;
    function appendElement(parentId: string, childId: string): void;
}
export {};
