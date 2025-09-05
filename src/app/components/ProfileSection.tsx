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
  isOwner = false,
}: {
  type: string;
  data: any[];
  onDataUpdate?: (newData: any) => void;
  isOwner?: boolean;
}) {
  // Handle empty data gracefully
  const safeData = data || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEdit = (cardData: any) => {
    setEditData(cardData);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-5 justify-start items-start w-full">
      <div className="text-l w-fit">{type}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-5">
        {type === "Projects" &&
          safeData.map((card) => (
            <PortfolioProjectCard
              key={card.id}
              id={card.id}
              title={card.title}
              description={card.description}
              images={card.images}
              links={card.links}
              linkLabels={card.linkLabels}
              onEdit={isOwner ? handleEdit : undefined}
            />
          ))}
        {type === "Work Experience" &&
          safeData.map((card) => (
            <WorkCard
              key={card.id}
              id={card.id}
              title={card.title}
              company={card.company}
              startDate={card.startDate}
              endDate={card.endDate}
              description={card.description}
              proofLink={card.proofLink}
              onEdit={isOwner ? handleEdit : undefined}
            />
          ))}
        {type === "Education" &&
          safeData.map((card) => (
            <EducationCard
              key={card.id}
              id={card.id}
              degree={card.degree}
              institution={card.institution}
              startDate={card.startDate}
              endDate={card.endDate}
              score={card.score}
              maxScore={card.maxScore}
              proofLink={card.proofLink}
              onEdit={isOwner ? handleEdit : undefined}
            />
          ))}
        {type === "Certifications / Courses" &&
          safeData.map((card) => (
            <CertificationCard
              key={card.id}
              id={card.id}
              title={card.title}
              issuingOrganization={card.issuingOrganization}
              startDate={card.startDate}
              endDate={card.endDate}
              description={card.description}
              proofUrl={card.proofLink}
              onEdit={isOwner ? handleEdit : undefined}
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
        {type != "Reviews" && isOwner && (
          <div className="w-full h-full min-h-50 border-2 border-dashed border-bglight flex justify-center items-center">
            <CirclePlus
              className="w-15 h-15 text-bglight hover:text-muted"
              strokeWidth={1}
              onClick={handleAdd}
            />
          </div>
        )}
      </div>
      {isModalOpen && (
        <AddProfileEntryModal
          type={type}
          onClose={() => {
            setIsModalOpen(false);
            setEditData(null);
          }}
          onSuccess={(newData) => {
            setIsModalOpen(false);
            setEditData(null);
            onDataUpdate?.(newData);
          }}
          editData={editData}
        />
      )}
    </div>
  );
}

export default ProfileSection;
