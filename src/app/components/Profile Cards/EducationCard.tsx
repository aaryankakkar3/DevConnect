import React from "react";

function EducationCard({
  id,
  degree,
  institution,
  startDate,
  endDate,
  score,
  maxScore,
  proofLink,
  onEdit,
}: {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  score: string;
  maxScore: string;
  proofLink: string;
  onEdit?: (cardData: any) => void;
}) {
  const handleEdit = () => {
    onEdit?.({
      id,
      degree,
      institution,
      startDate,
      endDate,
      score,
      maxScore,
      proofLink,
    });
  };

  return (
    <div className="flex flex-col h-full p-3 gap-3 border-2 border-bglight">
      <div className="text-accent">
        {degree}
        <br />@{institution}
      </div>
      <div className="">
        Score: {score} / {maxScore}
      </div>
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

export default EducationCard;
