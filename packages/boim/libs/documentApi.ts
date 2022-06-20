export default class Document {
  headElement: HTMLElement | null;
  defaultHeadElement: HTMLElement | null;
  customHeadElement: HTMLElement | null;
  headTargetList: Array<string>;

  constructor(head = null, defaultHead = null, customHead = null) {
    this.headElement = head;
    this.defaultHeadElement = defaultHead;
    this.customHeadElement = customHead;
    this.headTargetList = ["meta[charset]", "meta[name=\"viewport\"]", "title"];
  }

  setElement(type: string, element: HTMLElement) {
    switch (type) {
      case "head":
        this.headElement = element;
        break;
      case "defaultHead":
        this.defaultHeadElement = element;
        break;
      case "customHead":
        this.customHeadElement = element;
        break;
      default:
        break;
    }
  }

  removeChildrenOfHeadElement(): () => void {
    while (this.headElement.firstChild) {
      this.headElement.removeChild(this.headElement.lastChild);
    }

    return null;
  }

  removeDuplicateHead(): () => void {
    this.headTargetList.forEach((value) => {
      if (this.customHeadElement.querySelector(value)) {
        this.headElement.querySelector(value).remove();
      }
    });

    return null;
  }

  addDefaultHeadChildren(): () => void {
    this.addChildrenToTarget(
      this.headElement,
      this.defaultHeadElement.children
    );

    return null;
  }

  addCustomHeadChildren(): () => void {
    this.addChildrenToTarget(this.headElement, this.customHeadElement.children);

    return null;
  }

  addChildrenToTarget(
    targetElement: HTMLElement | null,
    childrenElement: HTMLCollection | null
  ): () => void {
    Object.entries(childrenElement).forEach(([_, value]) => {
      targetElement.appendChild(value);
    });

    return null;
  }
}
