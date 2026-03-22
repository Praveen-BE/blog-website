"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "lexical";
import { useEffect } from "react";
import { $createImageNode, ImageNode } from "./ImageNode";

// ── Command ────────────────────────────────────────────────────────────────
// Export so Toolbar (or any other component) can dispatch it
export const INSERT_IMAGE_COMMAND = createCommand("INSERT_IMAGE_COMMAND");

// ── Plugin ─────────────────────────────────────────────────────────────────
// Drop this inside your LexicalComposer alongside RichTextPlugin etc.
// It listens for INSERT_IMAGE_COMMAND and inserts the node.
// Payload: { src: string, altText?: string, maxWidth?: number }
export default function ImagesPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error(
        "ImagesPlugin: ImageNode not registered on editor. Add it to the nodes array in your LexicalComposer initialConfig.",
      );
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          // If the image ends up directly under root (not inside a paragraph),
          // wrap it so surrounding text can exist above and below it.
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
}
