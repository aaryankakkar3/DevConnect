import React from "react";

function EducationCard({
  degree,
  institution,
  startDate,
  endDate,
  score,
  maxScore,
  proofLink,
}: {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  score: string;
  maxScore: string;
  proofLink: string;
}) {
  return (
    <div className="flex flex-col w-75 h-fit p-3 gap-3 border-2 border-bglight">
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
    </div>
  );
}

export default EducationCard;
