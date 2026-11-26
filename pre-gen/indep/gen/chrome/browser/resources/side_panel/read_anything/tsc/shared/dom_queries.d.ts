import type { Segment } from '../read_aloud/read_aloud_types.js';
export declare function getTextNodeOffsets(rootNode: Node, start: number): {
    node: Node;
    offset: number;
};
export declare function getRectsForSegments(segments: Segment[]): DOMRect[];
export declare function getNearestTextBoundaryPoint(node: Node, offset: number, container: Node, isStart: boolean, isValidTarget?: (node: Node) => boolean): {
    node: Node;
    offset: number;
};
