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
  return (
    <div className="w-fit h-fit gap-2 bg-bg1 rounded-xl border border-text2 flex flex-row mx-auto">
      <button
        onClick={() => {
          accountType !== "client" && setAccountType("client");
        }}
        className={`px-12 py-3 rounded-xl cursor-pointer ${
          currentType === "client" ? currentTypeClasses : nonCurrentTypeClasses
        }`}
      >
        Client
      </button>
      <button
        onClick={() => {
          accountType !== "developer" && setAccountType("developer");
        }}
        className={`px-12 py-3 rounded-xl cursor-pointer ${
          currentType === "developer"
            ? currentTypeClasses
            : nonCurrentTypeClasses
        }`}
      >
        Developer
      </button>
    </div>
  );
}

export default SwitchAuthTypeComponent;
