import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function AuthPasswordInput({
  value,
  label,
  onChange,
}: {
  value?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <label className="flex flex-col gap-2">
      {label}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="p-5 pr-12 border border-text2 rounded-xl w-full"
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text2 hover:text-text1 transition-colors cursor-pointer"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </label>
  );
}

export default AuthPasswordInput;
