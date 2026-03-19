"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { $getNodeByKey } from "lexical";
import { useRef } from "react";

export default function ImageComponent({ src, nodeKey, width }) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey);
  const imageRef = useRef(null);

  const onResizeEnd = (nextWidth) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) node.setWidth(nextWidth);
    });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = imageRef.current.offsetWidth;

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(50, startWidth + delta); // Min width 50px
      onResizeEnd(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      className={`relative inline-block align-bottom ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        setSelected(!isSelected);
      }}
    >
      <img
        ref={imageRef}
        src={src}
        alt="User upload"
        style={{ width: `${width}px`, height: "auto" }}
        className="max-w-full block"
      />

      {isSelected && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-nwse-resize"
          title="Resize"
        />
      )}
    </div>
  );
}
