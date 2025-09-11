import React from "react";

function ReviewCard({
  reviewerName,
  reviewText,
  rating,
  imageUrl,
}: {
  reviewerName: string;
  reviewText: string;
  rating: number;
  imageUrl: string;
}) {
  return (
    <div className="flex flex-col h-full p-3 gap-3 border-2 border-bg2">
      <div className="flex flex-row items-center gap-3">
        <img
          src={imageUrl}
          alt={`${reviewerName} profile`}
          className="w-19 h-19 rounded-full object-cover"
        />
        <div>
          <div className="text-accent font-semibold flex flex-col gap-3">
            {reviewerName}
          </div>
          <div className="text-yellow-500">
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </div>
        </div>
      </div>
      <div className="text-base italic">"{reviewText}"</div>
    </div>
  );
}

export default ReviewCard;
