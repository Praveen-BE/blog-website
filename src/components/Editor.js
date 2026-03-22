"use client";

// ─────────────────────────────────────────────────────────────────────────────
// UpdateEditor.js  (or wherever your LexicalComposer lives)
// Shows ONLY what changes from your existing editor setup.
// Merge this into your actual editor file — don't replace it wholesale.
// ─────────────────────────────────────────────────────────────────────────────

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";

// ── 1. Import your new files ──────────────────────────────────────────────
import { ImageNode } from "./ImageNode"; // NEW
import ImagesPlugin from "./ImagesPlugin"; // NEW
import Toolbar from "./Toolbar"; // UPDATED
import LoadState from "./LoadState";
import ImageToolbar from "./ImageToolbar.js";

const editorTheme = {
  // Map Lexical node types to CSS class names.
  // You can style these in your global CSS or a CSS module.
  paragraph: "editor-paragraph",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
  },
  quote: "editor-quote",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    code: "editor-text-code",
  },
  format: {
    left: "editor-align-left",
    center: "editor-align-center",
    right: "editor-align-right",
    justify: "editor-align-justify",
  },
  image: "editor-image", // applied to the span createDOM returns
};

function onError(error) {
  console.error("Lexical editor error:", error);
}

export function Editor() {
  const initialConfig = {
    namespace: "MyEditor",
    theme: exampleTheme,
    onError,
    nodes: [HeadingNode],
    editable: false,
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg h-[50vh] p-5">
      <LexicalComposer initialConfig={initialConfig}>
        <LoadState lexicalJson={null} />
        <Toolbar />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="focus:outline-none"
              aria-placeholder={"Enter some text..."}
              placeholder={<div>Enter some text...</div>}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </LexicalComposer>
    </div>
  );
}

export function UpdateEditor({ lexical_content }) {
  const initialConfig = {
    namespace: "MyEditor",
    theme: editorTheme,
    onError,
    // ── 2. Register ImageNode (and HorizontalRuleNode) ─────────────────────
    nodes: [
      HeadingNode,
      QuoteNode,
      HorizontalRuleNode,
      ImageNode, // <── THIS IS THE CRITICAL ADDITION
    ],
    // Add this to ensure Lexical handles state transitions smoothly
    editorState: lexical_content ? JSON.stringify(lexical_content) : undefined,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {/* Toolbar — contains image upload button */}
        <LoadState lexicalJson={lexical_content} />
        <Toolbar />
        {/* Editor area */}
        <div style={{ position: "relative" }}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                spellCheck={true}
                style={{
                  minHeight: "400px",
                  padding: "16px 20px",
                  outline: "none",
                  fontSize: "15px",
                  lineHeight: "1.7",
                  color: "#111827",
                }}
              />
            }
            placeholder={
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "20px",
                  color: "#9ca3af",
                  fontSize: "15px",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                Start writing…
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        {/* ── 3. Add ImagesPlugin alongside your other plugins ─────────────── */}
        <ImageToolbar />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <HorizontalRulePlugin />
        <ImagesPlugin /> {/* <── THIS IS THE OTHER CRITICAL ADDITION */}
      </div>
    </LexicalComposer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EDITOR CSS — add these to your global CSS or a .module.css file
// ─────────────────────────────────────────────────────────────────────────────

// .editor-paragraph { margin: 0 0 8px; }
// .editor-heading-h1 { font-size: 28px; font-weight: 700; margin: 20px 0 8px; }
// .editor-heading-h2 { font-size: 22px; font-weight: 600; margin: 16px 0 6px; }
// .editor-heading-h3 { font-size: 18px; font-weight: 600; margin: 14px 0 4px; }
// .editor-quote {
//   border-left: 4px solid #e5e7eb;
//   padding-left: 16px;
//   color: #6b7280;
//   margin: 8px 0;
// }
// .editor-text-bold { font-weight: 700; }
// .editor-text-italic { font-style: italic; }
// .editor-text-underline { text-decoration: underline; }
// .editor-text-strikethrough { text-decoration: line-through; }
// .editor-text-code {
//   font-family: 'Fira Code', monospace;
//   background: #f3f4f6;
//   padding: 1px 5px;
//   border-radius: 4px;
//   font-size: 13px;
// }
// .editor-image { display: block; }
