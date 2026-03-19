import { DecoratorNode } from "lexical";
import * as React from "react";

// We use React.lazy to avoid SSR issues with Next.js
const ImageComponent = React.lazy(() => import("./ImageComponent"));

export class ImageNode extends DecoratorNode {
  static getType() {
    return "image";
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__width, node.__key);
  }

  constructor(src, width, key) {
    super(key);
    this.__src = src;
    this.__width = width || 300; // Default width
  }

  // This is the magic part: it renders a React Component inside the editor
  decorate() {
    return (
      <React.Suspense fallback={null}>
        <ImageComponent
          src={this.__src}
          nodeKey={this.getKey()}
          width={this.__width}
        />
      </React.Suspense>
    );
  }

  createDOM() {
    const span = document.createElement("span");
    span.style.display = "inline-block"; // Allows text wrapping
    return span;
  }

  updateDOM() {
    return false;
  }

  setWidth(width) {
    const writable = this.getWritable();
    writable.__width = width;
  }

  static importJSON(serializedNode) {
    return new ImageNode(serializedNode.src, serializedNode.width);
  }

  exportJSON() {
    return {
      type: "image",
      src: this.__src,
      width: this.__width,
      version: 1,
    };
  }
}
