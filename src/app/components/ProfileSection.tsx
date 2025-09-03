"use client";

import React, { useState } from "react";
import PortfolioProjectCard from "./Profile Cards/PortfolioProjectCard";
import WorkCard from "./Profile Cards/WorkCard";
import EducationCard from "./Profile Cards/EducationCard";
import CertificationCard from "./Profile Cards/CertificationCard";
import ReviewCard from "./Profile Cards/ReviewCard";
import { CirclePlus } from "lucide-react";
import AddProfileEntryModal from "./Add Profile Entry/AddProfileEntryModal";

function ProfileSection({
  type,
  data,
  onDataUpdate,
}: {
  type: string;
  data: any[];
  onDataUpdate?: (newData: any) => void;
}) {
  // Handle empty data gracefully
  const safeData = data || [];
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5 justify-start items-start w-full">
      <div className="text-l w-fit">{type}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-5">
        {type === "Projects" &&
          safeData.map((card) => (
            <PortfolioProjectCard
              key={card.id}
              title={card.title}
              description={card.description}
              images={card.images}
              links={card.links}
              linkLabels={card.linkLabels}
            />
          ))}
        {type === "Work Experience" &&
          safeData.map((card) => (
            <WorkCard
              key={card.id}
              title={card.title}
              company={card.company}
              startDate={card.startDate}
              endDate={card.endDate}
              description={card.description}
              proofLink={card.proofLink}
            />
          ))}
        {type === "Education" &&
          safeData.map((card) => (
            <EducationCard
              key={card.id}
              degree={card.degree}
              institution={card.institution}
              startDate={card.startDate}
              endDate={card.endDate}
              score={card.score}
              maxScore={card.maxScore}
              proofLink={card.proofLink}
            />
          ))}
        {type === "Certifications / Courses" &&
          safeData.map((card) => (
            <CertificationCard
              key={card.id}
              title={card.title}
              issuingOrganization={card.issuingOrganization}
              startDate={card.startDate}
              endDate={card.endDate}
              description={card.description}
              proofUrl={card.proofLink}
            />
          ))}
        {type === "Reviews" &&
          safeData.map((card) => (
            <ReviewCard
              key={card.id}
              reviewerName={card.giver}
              reviewText={card.comment}
              rating={card.rating}
              imageUrl={card.profilePicture}
            />
          ))}
        {type != "Reviews" && (
          <div className="w-full h-full min-h-50 border-2 border-dashed border-bglight flex justify-center items-center">
            <CirclePlus
              className="w-15 h-15 text-bglight hover:text-muted"
              strokeWidth={1}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        )}
      </div>
      {isModalOpen && (
        <AddProfileEntryModal
          type={type}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(newData) => {
            setIsModalOpen(false);
            onDataUpdate?.(newData);
          }}
        />
      )}
    </div>
  );
}

export default ProfileSection;
