import React from "react";

function Navbar() {
  return (
    <div className="flex flex-row justify-between">
      <div className="text-l">
        <span className="text-accent">Dev</span> Connect
      </div>
      <div className="bg-white rounded-full text-muted py-5 pl-16 pr-5 flex flex-row gap-6">
        <div className="flex flex-row gap-1"></div>
      </div>
    </div>
  );
}

export default Navbar;
