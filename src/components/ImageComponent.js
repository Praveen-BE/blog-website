"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ImageResizer from "./ImageResizer";
import { $isImageNode } from "./ImageNode";

function BrokenImage() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "200px",
        height: "150px",
        background: "#f3f4f6",
        border: "2px dashed #d1d5db",
        borderRadius: "8px",
        color: "#9ca3af",
        fontSize: "13px",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span>Image failed to load</span>
    </div>
  );
}

export default function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  resizable,
  showCaption,
  caption,
  layout, // 1. ADDED layout prop
}) {
  const imageRef = useRef(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState(false);
  const [isLoadError, setIsLoadError] = useState(false);
  const [editor] = useLexicalComposerContext();
  const [captionText, setCaptionText] = useState(caption || "");
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const captionInputRef = useRef(null);
  const activeEditorRef = useRef(null);

  const isInNodeSelection = useMemo(
    () =>
      isSelected &&
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        return $isNodeSelection(selection) && selection.has(nodeKey);
      }),
    [editor, isSelected, nodeKey],
  );

  const isFocused = (isSelected || isResizing) && !isLoadError;

  // ── COMMAND HANDLERS ──
  const onClick = useCallback(
    (payload) => {
      const event = payload;
      if (isResizing) return true;
      if (event.target === imageRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected);
        } else {
          clearSelection();
          setSelected(true);
        }
        return true;
      }
      return false;
    },
    [isResizing, isSelected, setSelected, clearSelection],
  );

  const onEscape = useCallback(
    (event) => {
      if (isSelected) {
        $setSelection(null);
        editor.update(() => {
          setSelected(false);
          const rootElement = editor.getRootElement();
          if (rootElement) rootElement.focus();
        });
        return true;
      }
      return false;
    },
    [editor, isSelected, setSelected],
  );

  const onDelete = useCallback(
    (event) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isImageNode(node)) node.remove();
        });
        return true;
      }
      return false;
    },
    [editor, isSelected, nodeKey],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        onEscape,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, onClick, onEscape, onDelete]);

  useEffect(() => {
    if (isEditingCaption && captionInputRef.current) {
      captionInputRef.current.focus();
    }
  }, [isEditingCaption]);

  const onResizeStart = () => setIsResizing(true);

  // const onResizeEnd = (nextWidth, nextHeight) => {
  //   setTimeout(() => setIsResizing(false), 200);
  //   editor.update(() => {
  //     const node = $getNodeByKey(nodeKey);
  //     if ($isImageNode(node)) {
  //       node.setWidthAndHeight(nextWidth, nextHeight);
  //     }
  //   });
  // };
  const onResizeEnd = (nextWidth, nextHeight) => {
    setTimeout(() => setIsResizing(false), 200);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        // Force them to be numbers to ensure the backend can parse them
        node.setWidthAndHeight(Math.round(nextWidth), Math.round(nextHeight));
      }
    });
  };

  const handleCaptionCommit = () => {
    setIsEditingCaption(false);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) node.setCaption(captionText);
    });
  };

  // ── DYNAMIC STYLES ──
  // 2. Compute container styles based on layout
  const containerStyle = {
    display: layout === "full" ? "block" : "inline-block",
    position: "relative",
    float: layout === "left" ? "left" : layout === "right" ? "right" : "none",
    margin:
      layout === "left"
        ? "0 20px 10px 0"
        : layout === "right"
          ? "0 0 10px 20px"
          : "10px auto",
    lineHeight: 0,
    clear: "both",
  };

  const imgStyle = {
    display: "block",
    maxWidth: "100%",
    width: width === "inherit" ? undefined : `${width}px`,
    height: height === "inherit" ? undefined : `${height}px`,
    borderRadius: "6px",
    cursor: "default",
    userSelect: "none",
  };

  return (
    <span contentEditable={false} style={containerStyle}>
      <span
        style={{
          display: "inline-block",
          position: "relative",
          outline: isFocused ? "2px solid #1a73e8" : "2px solid transparent",
          outlineOffset: "2px",
          borderRadius: "6px",
          lineHeight: 0,
          transition: "outline 0.12s ease",
        }}
      >
        {isLoadError ? (
          <BrokenImage />
        ) : (
          <img
            ref={imageRef}
            src={src}
            alt={altText}
            style={imgStyle}
            onError={() => setIsLoadError(true)}
            draggable="false"
          />
        )}

        {resizable && isInNodeSelection && isFocused && (
          <ImageResizer
            editor={editor}
            imageRef={imageRef}
            maxWidth={maxWidth}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
            showCaption={showCaption}
            setShowCaption={(show) => {
              editor.update(() => {
                const node = $getNodeByKey(nodeKey);
                if ($isImageNode(node)) node.setShowCaption(show);
              });
            }}
            captionsEnabled={!isLoadError}
          />
        )}
      </span>

      {showCaption && (
        <span
          style={{
            display: "block",
            lineHeight: "normal",
            marginTop: "6px",
            textAlign: "center",
          }}
        >
          {isEditingCaption ? (
            <input
              ref={captionInputRef}
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              onBlur={handleCaptionCommit}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter" || e.key === "Escape")
                  handleCaptionCommit();
              }}
              placeholder="Add a caption…"
              style={{
                width: imageRef.current
                  ? `${imageRef.current.offsetWidth}px`
                  : "100%",
                maxWidth: "100%",
                fontSize: "13px",
                color: "#6b7280",
                fontStyle: "italic",
                textAlign: "center",
                border: "none",
                borderBottom: "1.5px solid #1a73e8",
                outline: "none",
                background: "transparent",
                padding: "2px 0",
              }}
            />
          ) : (
            <span
              style={{
                fontSize: "13px",
                color: captionText ? "#6b7280" : "#9ca3af",
                fontStyle: "italic",
                cursor: "text",
                padding: "2px 8px",
                borderBottom: isSelected
                  ? "1px dashed #9ca3af"
                  : "1px solid transparent",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingCaption(true);
              }}
            >
              {captionText || "Click to write a caption…"}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
