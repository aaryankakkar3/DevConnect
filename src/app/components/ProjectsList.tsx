import React from "react";
import { Star } from "lucide-react";
import ProjectBid from "./Project/ProjectBid";

interface Project {
  id: string;
  title: string;
  budget: string;
  bidCount: string;
  postedTime: string;
  skills: string[];
  shortDesc: string;
  clientRating: string;
  ratingCount: string;
  status: string;
  bidData?: any | null;
}

function ProjectsList({
  project,
  isMyBids,
}: {
  project: Project;
  isMyBids?: boolean;
}) {
  return (
    <div
      key={project.id}
      className="p-6 flex flex-col gap-2 border-b border-text2 last:border-b-0 "
    >
      <div className="flex flex-row justify-between">
        <a
          className="text-accent text-2xl hover:underline"
          href={`/project/${project.id}`}
        >
          {project.title}
        </a>
        <p className="">
          {project.bidCount} bids | Posted {project.postedTime}
        </p>
      </div>
      <p>Budget - {project.budget}</p>
      <p className="font-semibold">{project.skills.join(" | ")}</p>
      <p className="">{project.shortDesc}</p>
      <div className="flex flex-row gap-1 items-center ">
        <div className="flex flex-row gap-0 items-center">
          {Array.from({ length: 5 }, (_, i) => {
            const rating = parseFloat(project.clientRating);
            const isFilled = i < Math.floor(rating);
            return (
              <Star
                key={i}
                strokeWidth={1}
                fill={isFilled ? "#F7DA00" : "none"}
                size={16}
              />
            );
          })}
        </div>
        ({project.ratingCount})
      </div>
      {isMyBids && (
        <div className="p-5 bg-bg2 rounded-xl">
          <ProjectBid bidsInstance={project.bidData} isMyBids={isMyBids} />
        </div>
      )}
    </div>
  );
}

export default ProjectsList;
