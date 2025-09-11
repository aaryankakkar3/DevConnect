import React from "react";

function DescriptionInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <label className="flex flex-col gap-2 w-full">
      Description
      <textarea
        className="py-4 px-8 bg-bg2 focus:outline-none focus:ring-0 resize-none min-h-[59px]"
        value={value}
        onChange={onChange}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = Math.max(59, target.scrollHeight) + "px";
        }}
        style={{ overflowY: "hidden" }}
        rows={1}
      />
    </label>
  );
}

export default DescriptionInput;
