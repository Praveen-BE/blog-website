import { DecoratorNode } from "lexical";

export class ImageNode extends DecoratorNode {
  static getType() {
    return "image";
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__key);
  }

  constructor(src, key) {
    super(key);
    this.__src = src;
  }

  createDOM() {
    const img = document.createElement("img");
    img.src = this.__src;
    img.alt = "Inserted image";
    img.className = "editor-image"; // match your theme
    return img;
  }

  updateDOM() {
    return false; // no updates needed
  }

  static importJSON(serializedNode) {
    return new ImageNode(serializedNode.src);
  }

  exportJSON() {
    return {
      type: "image",
      version: 1,
      src: this.__src,
    };
  }
}
