import React from "react";

function ConfirmationModal({
  type,
  onSubmit,
  onClose,
  loading,
  setLoading,
}: {
  type: "project" | "dev";
  onSubmit: () => void;
  onClose: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      <div className="fixed inset-0 bg-bg1 opacity-30 transition-opacity" />
      <form className="relative z-20 w-180 bg-bg1 border border-text2 flex flex-col p-10 gap-4 max-h-[90vh] overflow-y-auto">
        <h1 className="text-5xl text-center">Are you sure?</h1>
        <p className="">
          This action will cause you to use 1 {type} token. Are you sure you
          want to perform this action?
        </p>
        <div className="flex flex-row gap-4 ml-auto">
          <button
            type="button"
            className="cursor-pointer px-6 py-3 rounded-xl bg-accent w-fit text-bg1 font-semibold hover:opacity-75 disabled:opacity-50"
            onClick={() => {
              onSubmit();
            }}
            disabled={loading}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
            }}
            className="cursor-pointer px-6 py-3 rounded-xl bg-bg1 w-fit text-text1 font-semibold hover:bg-bg2 disabled:opacity-50 border border-text2"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConfirmationModal;
