import React from "react";

function CertificationCard({
  id,
  title,
  issuingOrganization,
  startDate,
  endDate,
  description,
  proofUrl,
  onEdit,
}: {
  id: string;
  title: string;
  issuingOrganization: string;
  startDate: string;
  endDate: string;
  description: string;
  proofUrl: string;
  onEdit?: (cardData: any) => void;
}) {
  const handleEdit = () => {
    onEdit?.({
      id,
      title,
      issuingOrganization,
      startDate,
      endDate,
      description,
      proofLink: proofUrl,
    });
  };

  return (
    <div className="flex flex-col h-full p-3 gap-3 border-2 border-bg2">
      <div className="text-accent">
        {title}
        <br />
        by {issuingOrganization}
      </div>
      <div className="">{description}</div>
      <div className="text-text2">
        From {startDate} to {endDate}
      </div>
      <div className="flex justify-between">
        <a
          className="text-accent2"
          href={proofUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Proof
        </a>
        {onEdit && (
          <button
            onClick={handleEdit}
            className="text-text2 hover:text-text1 cursor-pointer text-left"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default CertificationCard;
