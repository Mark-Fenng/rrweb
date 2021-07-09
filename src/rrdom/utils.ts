import { RRElement, RRNode } from './tree-node';
import { INode } from './types';

export function isElement(n: Node | INode | RRNode): n is RRElement {
  return n.nodeType === n.ELEMENT_NODE;
}

export function isShadowRoot(n: Node): n is ShadowRoot {
  const host: Element | null = (n as ShadowRoot)?.host;
  return Boolean(host && host.shadowRoot && host.shadowRoot === n);
}
