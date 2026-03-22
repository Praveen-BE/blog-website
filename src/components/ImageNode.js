"use client";

import { $applyNodeReplacement, DecoratorNode } from "lexical";
import * as React from "react";

const ImageComponent = React.lazy(() => import("./ImageComponent"));

export class ImageNode extends DecoratorNode {
  __src;
  __altText;
  __width;
  __height;
  __maxWidth;
  __showCaption;
  __caption;
  // 1. ADDED: Internal property for layout
  __layout;

  static getType() {
    return "image";
  }

  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__layout, // ADDED
      node.__key,
    );
  }

  constructor(
    src,
    altText,
    maxWidth,
    width,
    height,
    showCaption,
    caption,
    layout, // ADDED
    key,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText || "";
    this.__maxWidth = maxWidth || 500;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
    this.__showCaption = showCaption || false;
    this.__caption = caption || "";
    this.__layout = layout || "full"; // Default to full width
  }

  // 2. FIXED: The update method now handles layout correctly
  update(payload) {
    const writable = this.getWritable();
    if (payload.layout) writable.__layout = payload.layout;
    if (payload.width) writable.__width = payload.width;
    if (payload.height) writable.__height = payload.height;
    if (payload.caption) writable.__caption = payload.caption;
  }

  // ImageNode.js
  createDOM(config) {
    const span = document.createElement("span");
    // If you have a theme, apply it here
    const className = config.theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM() {
    return false; // DecoratorNodes should almost always return false
  }

  // ... (keeping your other helper methods)

  static importJSON(serializedNode) {
    const {
      src,
      altText,
      maxWidth,
      width,
      height,
      showCaption,
      caption,
      layout,
    } = serializedNode;
    return $createImageNode({
      src,
      altText,
      maxWidth,
      width: width || "inherit",
      height: height || "inherit",
      showCaption,
      caption,
      layout: layout || "full", // Load layout from JSON
    });
  }

  // exportJSON() {
  //   return {
  //     type: "image",
  //     version: 1,
  //     src: this.__src,
  //     altText: this.__altText,
  //     maxWidth: this.__maxWidth,
  //     width: this.__width === "inherit" ? 0 : this.__width,
  //     height: this.__height === "inherit" ? 0 : this.__height,
  //     showCaption: this.__showCaption,
  //     caption: this.__caption,
  //     layout: this.__layout, // Save layout to JSON
  //   };
  // }

  // Inside your ImageNode class
  setWidthAndHeight(width, height) {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  // Ensure exportJSON actually saves these numbers (not 'inherit')
  exportJSON() {
    return {
      type: "image",
      src: this.__src,
      altText: this.__altText,
      maxWidth: this.__maxWidth,
      width: this.__width, // Save the actual number
      height: this.__height, // Save the actual number
      showCaption: this.__showCaption,
      caption: this.__caption,
      layout: this.__layout,
      version: 1,
    };
  }

  decorate() {
    return (
      <React.Suspense fallback={null}>
        <ImageComponent
          src={this.__src}
          altText={this.__altText}
          width={this.__width}
          height={this.__height}
          maxWidth={this.__maxWidth}
          nodeKey={this.getKey()}
          showCaption={this.__showCaption}
          caption={this.__caption}
          layout={this.__layout} // 3. PASS layout to React component
          resizable={true}
        />
      </React.Suspense>
    );
  }
}

export function $createImageNode({
  src,
  altText = "",
  maxWidth = 500,
  width,
  height,
  showCaption = false,
  caption = "",
  layout = "full", // Added default
  key,
}) {
  return $applyNodeReplacement(
    new ImageNode(
      src,
      altText,
      maxWidth,
      width,
      height,
      showCaption,
      caption,
      layout,
      key,
    ),
  );
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
