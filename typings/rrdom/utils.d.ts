import { RRElement, RRNode } from './tree-node';
import { INode } from './types';
export declare function isElement(n: Node | INode | RRNode): n is RRElement;
export declare function isShadowRoot(n: Node): n is ShadowRoot;
