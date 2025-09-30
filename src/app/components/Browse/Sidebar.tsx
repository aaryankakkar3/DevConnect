import React from "react";
import { ChevronDown } from "lucide-react";

interface SidebarProps {
  keywordFilter: { dropdownValue: string; keywords: string };
  setKeywordFilter: React.Dispatch<
    React.SetStateAction<{ dropdownValue: string; keywords: string }>
  >;
  skillsFilter: { dropdownValue: string; skills: string };
  setSkillsFilter: React.Dispatch<
    React.SetStateAction<{ dropdownValue: string; skills: string }>
  >;
  budgetFilter: { min: string; max: string };
  setBudgetFilter: React.Dispatch<
    React.SetStateAction<{ min: string; max: string }>
  >;
  bidsFilter: { min: string; max: string };
  setBidsFilter: React.Dispatch<
    React.SetStateAction<{ min: string; max: string }>
  >;
  clientRatingFilter: { min: string; max: string };
  setClientRatingFilter: React.Dispatch<
    React.SetStateAction<{ min: string; max: string }>
  >;
  onApplyFilters: () => void;
}

function Sidebar({
  keywordFilter,
  setKeywordFilter,
  skillsFilter,
  setSkillsFilter,
  budgetFilter,
  setBudgetFilter,
  bidsFilter,
  setBidsFilter,
  clientRatingFilter,
  setClientRatingFilter,
  onApplyFilters,
}: SidebarProps) {
  const [openKeywordsDropdown, setOpenKeywordsDropdown] = React.useState(false);
  const [openSkillsDropdown, setOpenSkillsDropdown] = React.useState(false);
  return (
    <div className="flex flex-col gap-6 w-80">
      <div className="p-6 gap-3 flex flex-col border border-text2 rounded-xl h-fit">
        <span className="font-semibold">Bid tokens available: </span>
        <button className="px-6 py-3 text-bg1 w-fit bg-accent rounded-xl hover:opacity-70 cursor-pointer">
          Buy bids
        </button>
      </div>
      <div className="p-6 gap-6 flex flex-col border border-text2 rounded-xl h-fit">
        <div className="flex flex-row justify-between items-center">
          <span className="text-xl text-center">Filters</span>
          <button
            onClick={onApplyFilters}
            className="px-2 py-1 bg-accent text-bg1 hover:opacity-70 cursor-pointer"
          >
            Apply
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <span className="font-semibold">Keywords / phrases</span>
            <button
              onClick={() => {
                setKeywordFilter({
                  dropdownValue: "AND",
                  keywords: "",
                });
              }}
              className="text-accent cursor-pointer hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-col gap-2 relative">
            <button
              onClick={() => {
                setOpenKeywordsDropdown(!openKeywordsDropdown);
              }}
              className="flex items-center p-2.5 cursor-pointer flex-row justify-between border border-text2 rounded-xl w-full"
            >
              {keywordFilter.dropdownValue == "AND" && "All of the following"}
              {keywordFilter.dropdownValue == "OR" && "Any of the following"}
              <ChevronDown
                className={`w-4 h-4 ${openKeywordsDropdown && "rotate-180"}`}
              />
            </button>
            {openKeywordsDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 flex flex-col gap-0 border border-text2 rounded-xl bg-bg1 z-10 shadow-lg">
                <button
                  onClick={() => [
                    setKeywordFilter({
                      ...keywordFilter,
                      dropdownValue: "AND",
                    }),
                    setOpenKeywordsDropdown(false),
                  ]}
                  className="p-2.5 cursor-pointer hover:bg-bg2 text-left rounded-t-xl"
                >
                  All of the following
                </button>
                <button
                  onClick={() => [
                    setKeywordFilter({
                      ...keywordFilter,
                      dropdownValue: "OR",
                    }),
                    setOpenKeywordsDropdown(false),
                  ]}
                  className="p-2.5 cursor-pointer hover:bg-bg2 text-left rounded-b-xl"
                >
                  Any of the following
                </button>
              </div>
            )}
            <input
              className="p-2.5 border border-text2 rounded-xl w-full"
              type="text"
              placeholder="Enter keywords..."
              value={keywordFilter.keywords}
              onChange={(e) =>
                setKeywordFilter({
                  ...keywordFilter,
                  keywords: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <span className="font-semibold">Budget</span>
            <button
              onClick={() => {
                setBudgetFilter({
                  min: "",
                  max: "",
                });
              }}
              className="text-accent cursor-pointer hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              Minimum
              <input
                type="number"
                value={budgetFilter.min}
                onChange={(e) =>
                  setBudgetFilter({
                    ...budgetFilter,
                    min: e.target.value,
                  })
                }
                className="p-2.5 border border-text2 rounded-xl w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              Maximum
              <input
                type="number"
                value={budgetFilter.max}
                onChange={(e) =>
                  setBudgetFilter({
                    ...budgetFilter,
                    max: e.target.value,
                  })
                }
                className="p-2.5 border border-text2 rounded-xl w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <span className="font-semibold">Skills</span>
            <button
              onClick={() => {
                setSkillsFilter({
                  dropdownValue: "AND",
                  skills: "",
                });
              }}
              className="text-accent cursor-pointer hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-col gap-2 relative">
            <button
              onClick={() => {
                setOpenSkillsDropdown(!openSkillsDropdown);
              }}
              className="flex items-center p-2.5 cursor-pointer flex-row justify-between border border-text2 rounded-xl w-full"
            >
              {skillsFilter.dropdownValue == "AND" && "All of the following"}
              {skillsFilter.dropdownValue == "OR" && "Any of the following"}
              <ChevronDown
                className={`w-4 h-4 ${openSkillsDropdown && "rotate-180"}`}
              />
            </button>
            {openSkillsDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 flex flex-col gap-0 border border-text2 rounded-xl bg-bg1 z-10 shadow-lg">
                <button
                  onClick={() => [
                    setSkillsFilter({
                      ...skillsFilter,
                      dropdownValue: "AND",
                    }),
                    setOpenSkillsDropdown(false),
                  ]}
                  className="p-2.5 cursor-pointer hover:bg-bg2 text-left rounded-t-xl"
                >
                  All of the following
                </button>
                <button
                  onClick={() => [
                    setSkillsFilter({
                      ...skillsFilter,
                      dropdownValue: "OR",
                    }),
                    setOpenSkillsDropdown(false),
                  ]}
                  className="p-2.5 cursor-pointer hover:bg-bg2 text-left rounded-b-xl"
                >
                  Any of the following
                </button>
              </div>
            )}
            <input
              className="p-2.5 border border-text2 rounded-xl w-full"
              type="text"
              placeholder="Enter keywords..."
              value={skillsFilter.skills}
              onChange={(e) =>
                setSkillsFilter({
                  ...skillsFilter,
                  skills: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <span className="font-semibold">Bids</span>
            <button
              onClick={() => {
                setBidsFilter({
                  min: "",
                  max: "",
                });
              }}
              className="text-accent cursor-pointer hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              Minimum
              <input
                type="number"
                value={bidsFilter.min}
                onChange={(e) =>
                  setBidsFilter({
                    ...bidsFilter,
                    min: e.target.value,
                  })
                }
                className="p-2.5 border border-text2 rounded-xl w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              Maximum
              <input
                type="number"
                value={bidsFilter.max}
                onChange={(e) =>
                  setBidsFilter({
                    ...bidsFilter,
                    max: e.target.value,
                  })
                }
                className="p-2.5 border border-text2 rounded-xl w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <span className="font-semibold">Client Rating</span>
            <button
              onClick={() => {
                setClientRatingFilter({
                  min: "",
                  max: "",
                });
              }}
              className="text-accent cursor-pointer hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              Minimum
              <input
                type="number"
                value={clientRatingFilter.min}
                onChange={(e) =>
                  setClientRatingFilter({
                    ...clientRatingFilter,
                    min: e.target.value,
                  })
                }
                className="p-2.5 border border-text2 rounded-xl w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              Maximum
              <input
                type="number"
                value={clientRatingFilter.max}
                onChange={(e) =>
                  setClientRatingFilter({
                    ...clientRatingFilter,
                    max: e.target.value,
                  })
                }
                className="p-2.5 border border-text2 rounded-xl w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
