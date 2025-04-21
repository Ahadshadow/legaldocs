// components/ui/RichTextEditor.tsx
"use client";

import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface RichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  className = "",
}) => {
  const [editorState, setEditorState] = useState<EditorState>(() => {
    if (value) {
      const blocksFromHTML = convertFromHTML(value);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const rawContent = convertToRaw(state.getCurrentContent());
    const html = draftToHtml(rawContent);
    onChange(html); // Return HTML, not EditorState
  };

  return (
    <div className={`border border-input rounded-md p-2 bg-white ${className}`}>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName min-h-[150px] px-3 py-2"
        toolbarClassName="toolbarClassName"
      />
    </div>
  );
};
