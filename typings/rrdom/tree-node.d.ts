import { NodeType, serializedNodeWithId } from 'rrweb-snapshot';
export declare abstract class RRNode {
    __sn: serializedNodeWithId | undefined;
    children: Array<RRNode>;
    parentElement: RRElement | null;
    parentNode: RRNode | null;
    ELEMENT_NODE: number;
    TEXT_NODE: number;
    get firstChild(): RRNode;
    get nodeType(): NodeType | undefined;
    get childNodes(): RRNode[];
    appendChild(newChild: RRNode): RRNode;
    insertBefore(newChild: RRNode, refChild: RRNode | null): RRNode;
    contains(node: RRNode): void;
    removeChild(node: RRNode): void;
    toString(nodeName?: string): string;
}
export declare class RRWindow {
    scrollLeft: number;
    scrollTop: number;
    scrollTo(options?: ScrollToOptions): void;
}
export declare class RRDocument extends RRNode {
    private mirror;
    get documentElement(): RRNode;
    get body(): RRNode;
    get head(): RRNode;
    get implementation(): this;
    appendChild(childNode: RRNode): RRNode;
    insertBefore(newChild: RRNode, refChild: RRNode | null): RRNode;
    getElementsByTagName(tagName: string): RRElement[];
    createDocument(_namespace: string | null, _qualifiedName: string | null, _doctype?: DocumentType | null): RRDocument;
    createDocumentType(qualifiedName: string, publicId: string, systemId: string): RRDocumentType;
    createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): RRElementType<K>;
    createElement(tagName: string): RRElement;
    createElementNS(_namespaceURI: 'http://www.w3.org/2000/svg', qualifiedName: string): RRElement | RRMediaElement | RRImageElement;
    createComment(data: string): RRComment;
    createCDATASection(data: string): RRCDATASection;
    createTextNode(data: string): RRText;
    open(): void;
    close(): void;
    buildFromDom(dom: Document): void;
    destroyTree(): void;
    toString(): string;
}
export declare class RRDocumentType extends RRNode {
    readonly name: string;
    readonly publicId: string;
    readonly systemId: string;
    constructor(qualifiedName: string, publicId: string, systemId: string);
    toString(): string;
}
export declare class RRElement extends RRNode {
    tagName: string;
    attributes: Record<string, string | number | boolean>;
    scrollLeft: number;
    scrollTop: number;
    shadowRoot: RRElement | null;
    constructor(tagName: string);
    get classList(): {
        add: (className: string) => void;
    };
    get textContent(): string;
    set textContent(newText: string);
    get style(): Record<string, string> & {
        setProperty: (name: string, value: string | null, priority?: string | null | undefined) => void;
    };
    setAttribute(name: string, attribute: string): void;
    setAttributeNS(_namespace: string | null, qualifiedName: string, value: string): void;
    removeAttribute(name: string): void;
    appendChild(newChild: RRNode): RRNode;
    insertBefore(newChild: RRNode, refChild: RRNode | null): RRNode;
    querySelectorAll(selectors: string): RRElement[];
    getElementsByTagName(tagName: string): RRElement[];
    attachShadow(init: ShadowRootInit): RRElement;
    toString(): string;
}
export declare class RRImageElement extends RRElement {
    src: string;
    width: number;
    height: number;
    onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
}
export declare class RRMediaElement extends RRElement {
    currentTime: number;
    paused: boolean;
    play(): Promise<void>;
    pause(): Promise<void>;
}
export declare class RRIframeElement extends RRElement {
    width: string;
    height: string;
    src: string;
    contentDocument: RRDocument;
    contentWindow: RRWindow;
}
export declare class RRText extends RRNode {
    textContent: string;
    constructor(data: string);
    toString(): string;
}
export declare class RRComment extends RRNode {
    data: string;
    constructor(data: string);
    toString(): string;
}
export declare class RRCDATASection extends RRNode {
    data: string;
    constructor(data: string);
    toString(): string;
}
interface RRElementTagNameMap {
    img: RRImageElement;
    audio: RRMediaElement;
    video: RRMediaElement;
}
declare type RRElementType<K extends keyof HTMLElementTagNameMap> = K extends keyof RRElementTagNameMap ? RRElementTagNameMap[K] : RRElement;
export {};
