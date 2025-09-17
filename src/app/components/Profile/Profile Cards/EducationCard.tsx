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
    <div className="relative flex flex-col h-full p-3 gap-1 border-2 border-bg2">
      <div className="font-semibold text-xl text-center leading-tight">
        {(() => {
          switch (degree) {
            case "highschool":
              return "High School";
              break;
            case "bachelors":
              return "Bachelor's";
              break;
            case "masters":
              return "Master's";
              break;
            case "phd":
              return "PhD";
              break;
            case "diploma":
              return "Diploma";
              break;
            default:
              return degree;
          }
        })()}
        <br />@{institution}
      </div>
      <div className="">
        Score: {score} / {maxScore}
      </div>
      <div className="text-text2">
        From {startDate} to {endDate}.
      </div>
      <div className="flex justify-between">
        <a
          className="text-accent hover:underline"
          href={proofLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Proof
        </a>
        {onEdit && (
          <button
            onClick={handleEdit}
            className="text-text2 hover:text-text1 cursor-pointer text-left hover:underline absolute bottom-2 right-2"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default EducationCard;
