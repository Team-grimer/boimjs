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

  removeChildrenOfHeadElement() {
    while (this.headElement.firstChild) {
      this.headElement.removeChild(this.headElement.lastChild);
    }
  }

  removeDuplicateHead() {
    this.headTargetList.forEach((value) => {
      if (this.customHeadElement.querySelector(value)) {
        this.headElement.querySelector(value).remove();
      }
    });
  }

  addDefaultHeadChildren() {
    this.addChildrenToTarget(
      this.headElement,
      this.defaultHeadElement.children
    );
  }

  addCustomHeadChildren() {
    this.addChildrenToTarget(this.headElement, this.customHeadElement.children);
  }

  addChildrenToTarget(
    targetElement: HTMLElement | null,
    childrenElement: HTMLCollection | null
  ) {
    Object.entries(childrenElement).forEach(([_, value]) => {
      targetElement.appendChild(value);
    });
  }
}
