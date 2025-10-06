import { ChevronDown } from "lucide-react";
import React from "react";

interface ResultsFoundAndSortProps {
  resultsCount: number;
  sortBy: string;
  onSortChange: (sortValue: string) => void;
  isdevs?: boolean;
}

function ResultsFoundAndSort({
  resultsCount,
  sortBy,
  onSortChange,
  isdevs,
}: ResultsFoundAndSortProps) {
  const [sortDropdownOpen, setSortDropdownOpen] = React.useState(false);

  function SortDropDownButton({
    forValue,
    forLabel,
  }: {
    forValue: string;
    forLabel: string;
  }) {
    return (
      <button
        onClick={() => {
          onSortChange(forValue);
          setSortDropdownOpen(false);
        }}
        className={`w-full px-4 py-2 text-left hover:bg-bg2 cursor-pointer ${
          sortBy === forValue
            ? "bg-accent text-bg1 hover:bg-accent"
            : "text-text1"
        }`}
      >
        {forLabel}
      </button>
    );
  }
  return (
    <div className="p-6 flex flex-row justify-between items-center border-b border-text2">
      <p className="">{resultsCount} results found</p>
      <div className="flex flex-row gap-1 items-center relative">
        <p className="">Sort by:</p>
        <div className="relative">
          {!isdevs && (
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="px-2 py-1 gap-2 w-fit hover:bg-bg2 hover:text-text1 border border-text2 flex justify-between items-center cursor-pointer"
            >
              {sortBy === "newest" && "Newest First"}
              {sortBy === "oldest" && "Oldest First"}
              {sortBy === "budget-high" && "Budget: High to Low"}
              {sortBy === "budget-low" && "Budget: Low to High"}
              {sortBy === "title" && "Title A-Z"}
              <ChevronDown
                className={`w-4 h-4 ${sortDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
          )}
          {isdevs && (
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="px-2 py-1 gap-2 w-fit hover:bg-bg2 hover:text-text1 border border-text2 flex justify-between items-center cursor-pointer"
            >
              {sortBy === "most-reviewed" && "Most Reviewed"}
              {sortBy === "least-reviewed" && "Least Reviewed"}
              <ChevronDown
                className={`w-4 h-4 ${sortDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
          )}
          {sortDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-bg1 border border-text2 z-10">
              {!isdevs && (
                <>
                  <SortDropDownButton
                    forLabel="Newest First"
                    forValue="newest"
                  />
                  <SortDropDownButton
                    forLabel="Oldest First"
                    forValue="oldest"
                  />
                  <SortDropDownButton
                    forLabel="Budget: High to Low"
                    forValue="budget-high"
                  />
                  <SortDropDownButton
                    forLabel="Budget: Low to High"
                    forValue="budget-low"
                  />
                  <SortDropDownButton
                    forLabel="Highest Bids"
                    forValue="bids-high"
                  />
                  <SortDropDownButton
                    forLabel="Lowest Bids"
                    forValue="bids-low"
                  />
                </>
              )}
              {isdevs && (
                <>
                  <SortDropDownButton
                    forLabel="Most Reviewed"
                    forValue="most-reviewed"
                  />
                  <SortDropDownButton
                    forLabel="Least Reviewed"
                    forValue="least-reviewed"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultsFoundAndSort;
