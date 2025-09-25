import React from "react";

function SwitchAuthTypeComponent({
  accountType,
  setAccountType,
}: {
  accountType: string;
  setAccountType: React.Dispatch<React.SetStateAction<string>>;
}) {
  let currentType = accountType || "client";
  const currentTypeClasses = "bg-accent text-bg1";
  const nonCurrentTypeClasses = "text-text1 hover:bg-bg2";
  function Button({ type }: { type: string }) {
    return (
      <button
        onClick={() => {
          accountType !== type && setAccountType(type);
        }}
        className={`px-12 py-3 rounded-xl cursor-pointer ${
          currentType === type ? currentTypeClasses : nonCurrentTypeClasses
        }`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    );
  }
  return (
    <div className="w-fit h-fit gap-2 bg-bg1 rounded-xl border border-text2 flex flex-row mx-auto">
      <Button type="client" />
      <Button type="developer" />
    </div>
  );
}

export default SwitchAuthTypeComponent;
