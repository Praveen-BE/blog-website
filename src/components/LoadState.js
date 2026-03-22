import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";

const LoadState = ({ lexicalJson }) => {
  const [editor] = useLexicalComposerContext();
  const isFirstLoad = useRef(true); // Track if we've already loaded

  useEffect(() => {
    // 1. Only load if we have data, an editor, AND we haven't loaded yet
    if (!lexicalJson || !editor || !isFirstLoad.current) return;

    try {
      const newState = editor.parseEditorState(lexicalJson);

      // Use editor.update for the safest state transition
      editor.update(() => {
        editor.setEditorState(newState);
        isFirstLoad.current = false; // Mark as loaded so it never runs again
      });

      // Keep it editable
      editor.setEditable(true);
    } catch (e) {
      console.error("Failed to load editor state:", e);
    }
  }, [editor, lexicalJson]);

  return null;
};

export default LoadState;
