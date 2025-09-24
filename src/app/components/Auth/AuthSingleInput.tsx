import React from "react";

function AuthSingleInput({
  value,
  label,
  onChange,
  type,
}: {
  value?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      {label}
      <input
        type={type}
        className="p-5 border border-text2 rounded-xl"
        value={value}
        onChange={onChange}
      />
    </label>
  );
}

export default AuthSingleInput;
