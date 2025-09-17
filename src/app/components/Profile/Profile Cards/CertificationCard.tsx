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
    <div className="relative flex flex-col h-full p-3 gap-1 border-2 border-bg2">
      <div className="text-xl text-center flex flex-col gap-0 font-semibold">
        {title}
        <span className="text-base">by {issuingOrganization}</span>
      </div>
      <div className="">{description}</div>
      <div className="text-text2">
        From {startDate} to {endDate}
      </div>
      <div className="flex justify-between">
        <a
          className="text-accent hover:underline"
          href={proofUrl}
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

export default CertificationCard;
