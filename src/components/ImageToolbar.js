import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isNodeSelection } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function ImageToolbar() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [position, setPosition] = useState(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isNodeSelection(selection)) {
      const node = selection.getNodes()[0];
      if (node.getType() === "image") {
        const domElement = editor.getElementByKey(node.getKey());
        if (domElement) {
          const rect = domElement.getBoundingClientRect();
          // Position toolbar above the image
          setPosition({
            top: rect.top + window.scrollY - 40,
            left: rect.left + window.scrollX + rect.width / 2,
          });
          return;
        }
      }
    }
    setPosition(null);
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => updateToolbar());
    });
  }, [editor, updateToolbar]);

  const setLayout = (layout) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isNodeSelection(selection)) {
        const node = selection.getNodes()[0];
        node.update({ layout }); // This calls your ImageNode's update method
      }
    });
  };

  if (!position) return null;

  return createPortal(
    <div
      ref={toolbarRef}
      className="floating-image-toolbar"
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
      }}
    >
      <button onClick={() => setLayout("left")} title="Wrap Left">
        ⬅️
      </button>
      <button onClick={() => setLayout("full")} title="Break Text">
        ↔️
      </button>
      <button onClick={() => setLayout("right")} title="Wrap Right">
        ➡️
      </button>
    </div>,
    document.body,
  );
}
