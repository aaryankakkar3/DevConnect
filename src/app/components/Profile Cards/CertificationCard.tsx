import React from "react";

function CertificationCard({
  title,
  issuingOrganization,
  startDate,
  endDate,
  description,
  proofUrl,
}: {
  title: string;
  issuingOrganization: string;
  startDate: string;
  endDate: string;
  description: string;
  proofUrl: string;
}) {
  return (
    <div className="flex flex-col h-full p-3 gap-3 border-2 border-bglight">
      <div className="text-accent">
        {title}
        <br />
        by {issuingOrganization}
      </div>
      <div className="">{description}</div>
      <div className="text-muted2">
        From {startDate} to {endDate}
      </div>
      <a
        className="text-softaccent"
        href={proofUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Proof
      </a>
    </div>
  );
}

export default CertificationCard;
