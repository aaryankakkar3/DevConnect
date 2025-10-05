import React from "react";
import { Star } from "lucide-react";

function ProjectBid({
  bidsInstance,
  isMyBids,
}: {
  bidsInstance: any;
  isMyBids?: boolean;
}) {
  return (
    <div
      key={bidsInstance.id}
      className="w-full bg-bg1 rounded-xl p-5 flex flex-col gap-3"
    >
      {!isMyBids && (
        <div className="text-xl flex flex-row gap-3">
          <a
            href={`/profile/${bidsInstance.bidder.username}`}
            className="font-bold hover:underline"
          >
            {bidsInstance.bidder.name}
          </a>
          <div className="flex flex-row gap-1 items-center">
            <div className="flex flex-row gap-0.5 items-center">
              {bidsInstance.bidder.rating}
              <Star className="w-4 h-4 mb-0.5" strokeWidth={1.5} />
            </div>
            ({bidsInstance.bidder.ratingCount})
          </div>
        </div>
      )}
      <div className="text-xl flex flex-row gap-3">
        <p className="font-semibold text-accent">${bidsInstance.price}</p>
        <p className="">{bidsInstance.completionTime} day delivery</p>
      </div>
      <p className="">{bidsInstance.details}</p>
      <p className="">
        Created at: {new Date(bidsInstance.bidTime).toLocaleString()}
      </p>
    </div>
  );
}

export default ProjectBid;
