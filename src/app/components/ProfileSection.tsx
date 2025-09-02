import React from "react";
import PortfolioProjectCard from "./PortfolioProjectCard";
import WorkCard from "./WorkCard";
import EducationCard from "./EducationCard";
import CertificationCard from "./CertificationCard";
import ReviewCard from "./ReviewCard";
import { CirclePlus } from "lucide-react";

function ProfileSection({ type, data }: { type: string; data: any[] }) {
  // Handle empty data gracefully
  const safeData = data || [];

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
              proofUrl={card.proofUrl}
            />
          ))}
        {type === "Reviews" &&
          safeData.map((card) => (
            <ReviewCard
              key={card.id}
              reviewerName={card.reviewerName}
              reviewText={card.reviewText}
              rating={card.rating}
              imageUrl={card.imageUrl}
            />
          ))}
        <div className="w-full h-full min-h-50 border-2 border-dashed border-bglight flex justify-center items-center">
          <CirclePlus
            className="w-15 h-15 text-bglight hover:text-muted"
            strokeWidth={1}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;
