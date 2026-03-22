"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { mergeRegister } from "@lexical/utils";

// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { $getSelection } from "lexical";
// import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  $getSelection,
  $isRangeSelection,
  $isNodeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  $createParagraphNode,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useEditorContext } from "@/context/EditorContext";
import { INSERT_IMAGE_COMMAND } from "./ImagesPlugin";
import { useParams } from "next/navigation";

// ── Divider ────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <span
      style={{
        display: "inline-block",
        width: "1px",
        height: "20px",
        background: "#e5e7eb",
        margin: "0 6px",
        verticalAlign: "middle",
      }}
    />
  );
}

// ── ToolbarButton ──────────────────────────────────────────────────────────
function ToolbarButton({ active, disabled, onClick, title, children }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        borderRadius: "6px",
        border: "none",
        background: active ? "#e8f0fe" : "transparent",
        color: active ? "#1a73e8" : disabled ? "#9ca3af" : "#374151",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "14px",
        fontWeight: active ? "600" : "400",
        transition: "background 0.12s",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) e.currentTarget.style.background = "#f3f4f6";
      }}
      onMouseLeave={(e) => {
        if (!disabled && !active)
          e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}

// ── ImageUploadButton ──────────────────────────────────────────────────────
// Handles the file pick → backend upload → dispatch INSERT_IMAGE_COMMAND flow
function ImageUploadButton({ editor }) {
  const { post_id } = useParams();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("postId", post_id);

      const res = await fetch("http://localhost:5000/api/images/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();

      if (data?.url) {
        // Only the URL is stored — no base64, no blob
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          src: data.url,
          altText: file.name,
          maxWidth: 500,
        });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
      // Reset so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <ToolbarButton
        title="Insert image"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          // Tiny spinner
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            style={{ animation: "spin 0.8s linear infinite" }}
          >
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <circle
              cx="8"
              cy="8"
              r="6"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeDasharray="20 10"
            />
          </svg>
        ) : (
          // Image icon
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        )}
      </ToolbarButton>
    </>
  );
}

// Image Tool Bar
function ImageToolbar() {
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

// ── BlockFormatSelect ──────────────────────────────────────────────────────
const BLOCK_TYPES = [
  { value: "paragraph", label: "Normal" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "quote", label: "Quote" },
];

function BlockFormatSelect({ editor, blockType }) {
  const formatBlock = (value) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (value === "paragraph") {
        $setBlocksType(selection, () => $createParagraphNode());
      } else if (value === "quote") {
        $setBlocksType(selection, () => $createQuoteNode());
      } else {
        $setBlocksType(selection, () => $createHeadingNode(value));
      }
    });
  };

  return (
    <select
      value={blockType}
      onChange={(e) => formatBlock(e.target.value)}
      style={{
        height: "32px",
        padding: "0 8px",
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
        background: "#fff",
        color: "#374151",
        fontSize: "13px",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {BLOCK_TYPES.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </select>
  );
}

// ── Toolbar ────────────────────────────────────────────────────────────────
export default function Toolbar() {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [editor] = useLexicalComposerContext();
  const { setLexicalJson } = useEditorContext();

  const handleStateSave = useDebouncedCallback((contentLexical) => {
    setLexicalJson(contentLexical);
  }, 500);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      // Detect block type from anchor node
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM) {
        const type = element.getType();
        if (type === "heading") {
          setBlockType(element.getTag());
        } else if (type === "quote") {
          setBlockType("quote");
        } else {
          setBlockType("paragraph");
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(
        ({ editorState, dirtyElements, dirtyLeaves }) => {
          editorState.read(() => updateToolbar());
          if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;
          handleStateSave(JSON.stringify(editorState.toJSON()));
        },
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (p) => {
          setCanUndo(p);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (p) => {
          setCanRedo(p);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateToolbar]);

  const cmd = (command, payload) => editor.dispatchCommand(command, payload);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "2px",
        padding: "6px 10px",
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
        borderRadius: "8px 8px 0 0",
        userSelect: "none",
      }}
    >
      {/* Undo / Redo */}
      <ToolbarButton
        disabled={!canUndo}
        onClick={() => cmd(UNDO_COMMAND)}
        title="Undo (⌘Z)"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        disabled={!canRedo}
        onClick={() => cmd(REDO_COMMAND)}
        title="Redo (⌘⇧Z)"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
        </svg>
      </ToolbarButton>

      <Divider />

      {/* Block format */}
      <BlockFormatSelect editor={editor} blockType={blockType} />

      <Divider />

      {/* Text format */}
      <ToolbarButton
        active={isBold}
        onClick={() => cmd(FORMAT_TEXT_COMMAND, "bold")}
        title="Bold (⌘B)"
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        active={isItalic}
        onClick={() => cmd(FORMAT_TEXT_COMMAND, "italic")}
        title="Italic (⌘I)"
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        active={isUnderline}
        onClick={() => cmd(FORMAT_TEXT_COMMAND, "underline")}
        title="Underline (⌘U)"
      >
        <span style={{ textDecoration: "underline" }}>U</span>
      </ToolbarButton>
      <ToolbarButton
        active={isStrikethrough}
        onClick={() => cmd(FORMAT_TEXT_COMMAND, "strikethrough")}
        title="Strikethrough"
      >
        <span style={{ textDecoration: "line-through" }}>S</span>
      </ToolbarButton>
      <ToolbarButton
        active={isCode}
        onClick={() => cmd(FORMAT_TEXT_COMMAND, "code")}
        title="Inline code"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </ToolbarButton>

      <Divider />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => cmd(FORMAT_ELEMENT_COMMAND, "left")}
        title="Align left"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="18" y2="18" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => cmd(FORMAT_ELEMENT_COMMAND, "center")}
        title="Center"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="6" y1="12" x2="18" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => cmd(FORMAT_ELEMENT_COMMAND, "right")}
        title="Align right"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="9" y1="12" x2="21" y2="12" />
          <line x1="6" y1="18" x2="21" y2="18" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => cmd(FORMAT_ELEMENT_COMMAND, "justify")}
        title="Justify"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </ToolbarButton>

      <Divider />

      {/* Horizontal rule */}
      <ToolbarButton
        onClick={() => cmd(INSERT_HORIZONTAL_RULE_COMMAND)}
        title="Insert horizontal rule"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      </ToolbarButton>

      {/* Image upload */}
      <ImageUploadButton editor={editor} />
    </div>
  );
}
