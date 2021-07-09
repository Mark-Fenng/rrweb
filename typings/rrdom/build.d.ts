import { serializedNodeWithId, idNodeMap, INode } from './types';
import { RRDocument, RRNode } from './tree-node';
export declare function addHoverClass(cssText: string): string;
export declare function buildNodeWithSN(n: serializedNodeWithId, options: {
    doc: Document | RRDocument;
    map: idNodeMap;
    skipChild?: boolean;
    hackCss: boolean;
    afterAppend?: (n: INode | RRNode) => unknown;
}): INode | RRNode | null;
declare function rebuild(n: serializedNodeWithId, options: {
    doc: Document | RRDocument;
    onVisit?: (node: INode | RRNode) => unknown;
    hackCss?: boolean;
    afterAppend?: (n: INode | RRNode) => unknown;
}): [Node | RRNode | null, idNodeMap];
export default rebuild;
