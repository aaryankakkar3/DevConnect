import { SquarePlus } from "lucide-react";
import React from "react";

function EditProjectModal() {
  return (
    <>
      <label className="flex flex-col gap-2 w-full">
        Project Name
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        />
      </label>
      {/* Insert multiple images */}
      <label className="flex flex-col gap-2 w-full">
        Description
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        />
      </label>
      <div className="flex flex-row gap-4">
        <label className="flex flex-col gap-2 w-full">
          Proof Link
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          Link Label
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          />
        </label>
      </div>
    </>
  );
}
function EditWorkModal() {
  return (
    <>
      <label className="flex flex-col gap-2 w-full">
        Position
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        />
      </label>
      <label className="flex flex-col gap-2 w-full">
        Company Name
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        />
      </label>
      <label className="flex flex-col gap-2 w-full">
        Description
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        />
      </label>
      <div className="flex flex-row gap-4">
        <label className="flex flex-col gap-2 w-full">
          From
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          To
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 w-full">
        Proof Link
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        />
      </label>
    </>
  );
}
function EditEducationModal() {
  return (
    <>
      <label className="flex flex-col gap-2 w-full">
        Degree
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        />
      </label>
      <label className="flex flex-col gap-2 w-full">
        Institution
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        />
      </label>
      <div className="flex flex-row gap-4">
        <label className="flex flex-col gap-2 w-full">
          Score
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          Max Score
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          />
        </label>
      </div>
      <div className="flex flex-row gap-4">
        <label className="flex flex-col gap-2 w-full">
          From
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          To
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          />
        </label>
      </div>
      {/* Upload Picture Proof */}
    </>
  );
}
function EditCourseModal() {
  return (
    <>
      <label className="flex flex-col gap-2 w-full">
        Title
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        />
      </label>
      <label className="flex flex-col gap-2 w-full">
        Granting Organization
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        />
      </label>
      <label className="flex flex-col gap-2 w-full">
        Description
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        />
      </label>
      <div className="flex flex-row gap-4">
        <label className="flex flex-col gap-2 w-full">
          Start Date
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          End Date
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          />
        </label>
      </div>
      {/* Insert image proof */}
    </>
  );
}

function AddProfileEntryModal({
  type,
  onClose,
}: {
  type: string;
  onClose: () => void;
}) {
  const renderModalContent = () => {
    switch (type) {
      case "Projects":
        return <EditProjectModal />;
      case "Work Experience":
        return <EditWorkModal />;
      case "Education":
        return <EditEducationModal />;
      case "Certifications / Courses":
        return <EditCourseModal />;
      default:
        return <EditProjectModal />; // fallback
    }
  };

  const handleAdd = () => {};

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-bgdark opacity-30 transition-opacity" />
      <form className="relative z-20 w-175 h-fit bg-bgdark border border-bglight flex flex-col p-10 gap-8">
        <h2 className="text-l">
          <span className="text-accent">Add </span>
          {type}
        </h2>
        <div className="flex flex-col gap-4 w-full">{renderModalContent()}</div>
        <div className="flex flex-row gap-4 justify-end">
          <button
            className="px-8 py-4 bg-accent w-fit text-bgdark font-semibold hover:opacity-75"
            onClick={handleAdd}
          >
            Add
          </button>
          <button
            onClick={onClose}
            className="px-8 py-4 bg-[#C32222] w-fit text-white font-semibold hover:opacity-75"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProfileEntryModal;
