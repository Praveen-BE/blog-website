
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, FORMAT_TEXT_COMMAND, REDO_COMMAND, UNDO_COMMAND} from 'lexical';
import React, { useCallback, useEffect, useState } from 'react';
import {mergeRegister} from '@lexical/utils';
import { useDebouncedCallback } from 'use-debounce';

const Toolbar = () => {
      const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
      const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
    const [editor] = useLexicalComposerContext();
  const handleSave = useDebouncedCallback((content)=>{
    console.log(content);
    
  }, 500);

      const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
    //   setIsUnderline(selection.hasFormat('underline'));
    //   setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);


    useEffect(() => {
        return mergeRegister(
      editor.registerUpdateListener(({editorState, dirtyElements, dirtyLeaves}) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          {editor},
        );
        if(dirtyElements.size === 0 && dirtyLeaves.size === 0){
            return;
        }
        handleSave(JSON.stringify(editorState));
      }),
    editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
        )
  }, [editor, $updateToolbar]);

  const handleHeading = ()=>{
    editor.update(()=>{
        const selection = $getSelection();
        if($isRangeSelection(selection)){
            $setBlocksType(selection, ()=>$createHeadingNode("h1"))
        }
    })
  }




  return (
    <div>
        <button className={`font-bold mx-1 size-8 rounded-md ${isBold? "bg-gray-200": " "}`} onClick={()=>{
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}>
            B 
        </button>
        <button className={`italic mx-1 size-8 rounded-md ${isItalic? "bg-grey-200": " "}`} onClick={()=>{
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}>
            I
        </button>
        <button className={`mx-1 size-8 rounded-md `} onClick={handleHeading}>
            h1
        </button>
        <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced disabled:text-gray-500 mx-1"
        aria-label="Undo">
        undo
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item mx-1 disabled:text-gray-500 "
        aria-label="Redo">
        redo
      </button>

    </div>
  )
}

export default Toolbar