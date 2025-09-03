import { SquareMinus, SquarePlus } from "lucide-react";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function EditProjectModal({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: (data: any) => void;
}) {
  const [linkInputs, setLinkInputs] = useState([{ id: 1 }]);

  const addLinkInput = () => {
    const newId =
      linkInputs.length > 0
        ? Math.max(...linkInputs.map((input) => input.id)) + 1
        : 1;
    setLinkInputs([...linkInputs, { id: newId }]);
    setFormData({
      ...formData,
      links: [...formData.links, ""],
      linkLabels: [...formData.linkLabels, ""],
    });
  };

  const removeLinkInput = () => {
    if (linkInputs.length > 1) {
      setLinkInputs(linkInputs.slice(0, -1));
      setFormData({
        ...formData,
        links: formData.links.slice(0, -1),
        linkLabels: formData.linkLabels.slice(0, -1),
      });
    }
  };

  return (
    <>
      <label className="flex flex-col gap-2 w-full">
        Project Name
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </label>
      {/* Insert multiple images */}
      <label className="flex flex-col gap-2 w-full">
        Description
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </label>
      <div className="flex flex-col gap-2">
        {linkInputs.map((linkInput, index) => (
          <div key={linkInput.id} className="flex flex-row gap-4">
            <label className="flex flex-col gap-2 w-full">
              Proof Link
              <input
                type="text"
                className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
                value={formData.links[index] || ""}
                onChange={(e) => {
                  const newLinks = [...formData.links];
                  newLinks[index] = e.target.value;
                  setFormData({ ...formData, links: newLinks });
                }}
              />
            </label>
            <label className="flex flex-col gap-2 w-full">
              Link Label
              <input
                type="text"
                className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
                value={formData.linkLabels[index] || ""}
                onChange={(e) => {
                  const newLinkLabels = [...formData.linkLabels];
                  newLinkLabels[index] = e.target.value;
                  setFormData({ ...formData, linkLabels: newLinkLabels });
                }}
              />
            </label>
          </div>
        ))}
        <div className="w-full flex justify-end gap-2">
          {linkInputs.length > 1 && (
            <SquareMinus
              strokeWidth={1}
              className="w-9 h-9 text-muted hover:text-white cursor-pointer"
              onClick={removeLinkInput}
            />
          )}
          <SquarePlus
            strokeWidth={1}
            className="w-9 h-9 text-muted hover:text-white cursor-pointer"
            onClick={addLinkInput}
          />
        </div>
      </div>
    </>
  );
}
function EditWorkModal({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: (data: any) => void;
}) {
  return (
    <>
      <label className="flex flex-col gap-2 w-full">
        Position
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </label>
      <label className="flex flex-col gap-2 w-full">
        Company Name
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
        />
      </label>
      <label className="flex flex-col gap-2 w-full">
        Description
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </label>
      <div className="flex flex-row gap-4">
        <label className="flex flex-col gap-2 w-full">
          From
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          To
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 w-full">
        Proof Link
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.proofLink}
          onChange={(e) =>
            setFormData({ ...formData, proofLink: e.target.value })
          }
        />
      </label>
    </>
  );
}
function EditEducationModal({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: (data: any) => void;
}) {
  return (
    <>
      <label className="flex flex-col gap-2 w-full">
        Degree
        <select
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.degree}
          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
        >
          <option value="">Select Degree</option>
          <option value="highschool">High School</option>
          <option value="diploma">Diploma</option>
          <option value="bachelors">Bachelors</option>
          <option value="masters">Masters</option>
          <option value="phd">PhD</option>
        </select>
      </label>
      <label className="flex flex-col gap-2 w-full">
        Institution
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.institution}
          onChange={(e) =>
            setFormData({ ...formData, institution: e.target.value })
          }
        />
      </label>
      <div className="flex flex-row gap-4">
        <label className="flex flex-col gap-2 w-full">
          Score
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
            value={formData.score}
            onChange={(e) =>
              setFormData({ ...formData, score: e.target.value })
            }
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          Max Score
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
            value={formData.maxScore}
            onChange={(e) =>
              setFormData({ ...formData, maxScore: e.target.value })
            }
          />
        </label>
      </div>
      <div className="flex flex-row gap-4">
        <label className="flex flex-col gap-2 w-full">
          From
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          To
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 w-full">
        Proof Link
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.proofLink}
          onChange={(e) =>
            setFormData({ ...formData, proofLink: e.target.value })
          }
        />
      </label>
      {/* Upload Picture Proof */}
    </>
  );
}
function EditCourseModal({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: (data: any) => void;
}) {
  return (
    <>
      <label className="flex flex-col gap-2 w-full">
        Title
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </label>
      <label className="flex flex-col gap-2 w-full">
        Granting Organization
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.issuingOrganization}
          onChange={(e) =>
            setFormData({ ...formData, issuingOrganization: e.target.value })
          }
        />
      </label>
      <label className="flex flex-col gap-2 w-full">
        Description
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </label>
      <div className="flex flex-row gap-4">
        <label className="flex flex-col gap-2 w-full">
          Start Date
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          End Date
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 w-full">
        Proof Link
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.proofLink}
          onChange={(e) =>
            setFormData({ ...formData, proofLink: e.target.value })
          }
        />
      </label>
      {/* Insert image proof */}
    </>
  );
}

function AddProfileEntryModal({
  type,
  onClose,
  onSuccess,
}: {
  type: string;
  onClose: () => void;
  onSuccess?: (newData: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    issuingOrganization: "",
    proofLink: "",
    company: "",
    startDate: "",
    endDate: "",
    links: [""],
    linkLabels: [""],
    images: [""],
    degree: "",
    institution: "",
    score: "",
    maxScore: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    console.log("Frontend Form Data", formData);
    setIsLoading(true);

    // Show loading toast
    const loadingToast = toast.loading(`Adding ${type}...`);

    try {
      let endpoint = "";
      let payload = {};

      // Prepare data based on form type (userId will be extracted by middleware)
      switch (type) {
        case "Projects":
          endpoint = `/api/portfolio-projects`;
          payload = {
            title: formData.title,
            description: formData.description,
            links: formData.links.filter((link) => link.trim() !== ""),
            linkLabels: formData.linkLabels.filter(
              (label) => label.trim() !== ""
            ),
            images: formData.images.filter((img) => img.trim() !== ""),
          };
          break;

        case "Work Experience":
          endpoint = `/api/work-experiences`;
          payload = {
            title: formData.title,
            description: formData.description,
            company: formData.company,
            startDate: formData.startDate,
            endDate: formData.endDate,
            proofLink: formData.proofLink,
          };
          break;

        case "Education":
          endpoint = `/api/educations`;
          payload = {
            degree: formData.degree,
            institution: formData.institution,
            score: formData.score,
            maxScore: formData.maxScore,
            startDate: formData.startDate,
            endDate: formData.endDate,
            proofLink: formData.proofLink,
          };
          break;

        case "Certifications / Courses":
          endpoint = `/api/certifications`;
          payload = {
            title: formData.title,
            description: formData.description,
            issuingOrganization: formData.issuingOrganization,
            startDate: formData.startDate,
            endDate: formData.endDate,
            proofLink: formData.proofLink,
          };
          break;

        default:
          throw new Error("Unknown form type");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This ensures cookies are sent
        body: JSON.stringify(payload),
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          `Error adding ${type}: ${errorData.error || response.statusText}`
        );
        return;
      }

      const result = await response.json();
      console.log("Success:", result);
      toast.success(`${type} added successfully!`);

      // Pass the created data to onSuccess for optimistic updates
      onSuccess?.(result.data);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      toast.error(`Error adding ${type}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderModalContent = () => {
    switch (type) {
      case "Projects":
        return (
          <EditProjectModal formData={formData} setFormData={setFormData} />
        );
      case "Work Experience":
        return <EditWorkModal formData={formData} setFormData={setFormData} />;
      case "Education":
        return (
          <EditEducationModal formData={formData} setFormData={setFormData} />
        );
      case "Certifications / Courses":
        return (
          <EditCourseModal formData={formData} setFormData={setFormData} />
        );
      default:
        return (
          <EditProjectModal formData={formData} setFormData={setFormData} />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-bgdark opacity-30 transition-opacity" />
      <form className="relative z-20 w-175 h-fit bg-bgdark border border-bglight flex flex-col p-10 gap-8">
        <h2 className="text-l">
          <span className="text-accent">Add </span>
          {type}
        </h2>
        <div className="flex flex-col gap-4 w-full">{renderModalContent()}</div>
        <div className="flex flex-row gap-4 justify-end">
          <button
            type="button"
            className="cursor-pointer px-8 py-4 bg-accent w-fit text-bgdark font-semibold hover:opacity-75 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-8 py-4 bg-[#C32222] w-fit text-white font-semibold hover:opacity-75"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}

export default AddProfileEntryModal;
