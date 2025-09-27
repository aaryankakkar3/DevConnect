import React, { useEffect, useRef } from "react";

function DescriptionInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.max(59, textareaRef.current.scrollHeight) + "px";
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <label className="flex flex-col gap-1 w-full">
      {label ? label : "Description"}
      <textarea
        ref={textareaRef}
        className="p-5 bg-bg1 border border-text2 rounded-xl resize-none min-h-[59px]"
        value={value}
        onChange={onChange}
        onInput={adjustHeight}
        style={{ overflowY: "hidden" }}
        rows={1}
      />
    </label>
  );
}

export default DescriptionInput;
