import React from "react";

function WorkCard({
  title,
  company,
  startDate,
  endDate,
  description,
  proofLink,
}: {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  proofLink: string;
}) {
  return (
    <div className="flex flex-col w-75 h-fit p-3 gap-3 border-2 border-bglight">
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
    </div>
  );
}

export default WorkCard;
