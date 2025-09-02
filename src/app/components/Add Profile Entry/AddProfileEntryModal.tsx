import { SquarePlus } from "lucide-react";
import React from "react";

function SingleInput({ label }: { label: string }) {
  return (
    <label className="flex flex-col gap-2 w-full">
      {label}
      <input
        type="text"
        className={`py-4 px-8 bg-bglight focus:outline-none focus:ring-0 text-wrap justify-start items-start ${
          label == "Description" ? "h-40" : ""
        }`}
      />
    </label>
  );
}

function DoubleInput({ label1, label2 }: { label1: string; label2: string }) {
  return (
    <div className="flex flex-row gap-4">
      <label className="flex flex-col gap-2 w-full">
        {label1}
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        />
      </label>
      <label className="flex flex-col gap-2 w-full">
        {label2}
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        />
      </label>
    </div>
  );
}

function EditProjectModal() {
  return (
    <>
      <SingleInput label="Title" />
      <SingleInput label="Description" />
      <LinkInput />
    </>
  );
}
function EditWorkModal() {
  return (
    <>
      <SingleInput label="Position" />
      <SingleInput label="Company" />
      <SingleInput label="Description" />
      <DoubleInput label1="Start Date" label2="End Date" />
      <LinkInput />
    </>
  );
}
function EditEducationModal() {
  return (
    <>
      <SingleInput label="Degree" />
      <SingleInput label="Institution" />
      <DoubleInput label1="Score" label2="Max score" />
      <DoubleInput label1="Start Date" label2="End Date" />
      <LinkInput />
    </>
  );
}
function EditCourseModal() {
  return (
    <>
      <SingleInput label="Title" />
      <SingleInput label="Issuing Organization" />
      <SingleInput label="Description" />
      <DoubleInput label1="Start Date" label2="End Date" />
      <LinkInput />
    </>
  );
}

function LinkInput() {
  return (
    <div className="gap-2 flex flex-col">
      <DoubleInput label1="Link" label2="Label" />
      <div className="flex justify-end">
        <SquarePlus
          className="w-9 h-9 text-muted hover:text-white"
          strokeWidth={1}
        />
      </div>
    </div>
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
      <div className="relative z-20 w-175 h-fit bg-bgdark border border-bglight flex flex-col p-10 gap-8">
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
      </div>
    </div>
  );
}

export default AddProfileEntryModal;
