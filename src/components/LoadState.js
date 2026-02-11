import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import React, { useEffect } from 'react'

const text = `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Praveen akdakakljsdf  j","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`;

const LoadState = () => {
    const [editor] = useLexicalComposerContext();
  
    useEffect(()=>{
        const newState = editor.parseEditorState(text);
        editor.setEditorState(newState);
        editor.setEditable(true);
    },[]);
  return (
    <></>
  )
}

export default LoadState