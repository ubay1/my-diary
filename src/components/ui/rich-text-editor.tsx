/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
}) => {
  const editor = useRef<any>(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder,
      style: {
        "word-break": "break-word",
        "overflow-wrap": "anywhere",
      },
    }),
    [placeholder]
  );

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      tabIndex={1}
      onBlur={(newContent) => onChange(newContent)}
      onChange={() => {}} // onChange tetap diperlukan oleh Jodit, meski dikosongkan
    />
  );
};

export default RichTextEditor;
