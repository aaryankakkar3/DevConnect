import React from "react";

function WorkCard({
  id,
  title,
  company,
  startDate,
  endDate,
  description,
  proofLink,
  onEdit,
}: {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  proofLink: string;
  onEdit?: (cardData: any) => void;
}) {
  const handleEdit = () => {
    onEdit?.({
      id,
      title,
      company,
      startDate,
      endDate,
      description,
      proofLink,
    });
  };

  return (
    <div className="flex flex-col h-full p-3 gap-3 border-2 border-bglight">
      <div className="text-accent ">
        {title}
        <br />@{company}
      </div>
      <div className="">{description}</div>
      <div className="text-muted2">
        From {startDate} to {endDate}.
      </div>
      <a
        className="text-softaccent"
        href={proofLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        Proof
      </a>
      {onEdit && (
        <button
          onClick={handleEdit}
          className="text-accent hover:text-white cursor-pointer text-left"
        >
          Edit
        </button>
      )}
    </div>
  );
}

export default WorkCard;
