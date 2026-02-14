"use client";
import { createContext, useContext, useState } from "react"

const EditorContext = createContext();

export const EditorProvider = ({children})=>{
    const [lexicalJson, setLexicalJson] = useState(null);

    return (
        <EditorContext.Provider value={{lexicalJson, setLexicalJson}}>
            {children}
        </EditorContext.Provider>
    );
}

export const useEditorContext = ()=> useContext(EditorContext);