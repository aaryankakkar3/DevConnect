import React from "react";
import SingleInputField from "../Profile/Edit Profile Modals/SingleInputField";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ConfirmationModal from "./ConfirmationModal";

function PlaceBidModal({
  onClose,
  projectId,
}: {
  onClose: () => void;
  projectId: string;
}) {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    React.useState(false);
  const [bidData, setBidData] = React.useState({
    amount: "",
    completionTime: "",
    details: "",
  });
  const router = useRouter();
  const handleSubmit = async () => {
    // Validate form data
    if (!bidData.amount || !bidData.completionTime || !bidData.details.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const price = parseInt(bidData.amount);
    const time = parseInt(bidData.completionTime);

    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (isNaN(time) || time <= 0) {
      toast.error("Please enter a valid completion time");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          price: bidData.amount,
          details: bidData.details.trim(),
          time: bidData.completionTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to place bid");
        return;
      }

      toast.success("Bid placed successfully!");

      // Reload page to update token count
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("An error occurred while placing your bid");
    } finally {
      setIsLoading(false);
    }
  };
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-bg1 opacity-30 transition-opacity" />
      <form className="relative z-20 w-180 bg-bg1 border border-text2 flex flex-col p-10 gap-4 max-h-[90vh] overflow-y-auto">
        <h1 className="text-center text-5xl">Place Bid</h1>
        <SingleInputField
          label="Amount"
          value={bidData.amount}
          onChange={(e) => setBidData({ ...bidData, amount: e.target.value })}
          type="number"
        />
        <SingleInputField
          label="Completion Time"
          value={bidData.completionTime}
          onChange={(e) =>
            setBidData({ ...bidData, completionTime: e.target.value })
          }
          type="number"
        />
        <SingleInputField
          label="Details"
          value={bidData.details}
          onChange={(e) => setBidData({ ...bidData, details: e.target.value })}
          type="text"
        />
        <div className="flex flex-row gap-4 ml-auto">
          <button
            type="button"
            className="cursor-pointer px-6 py-3 rounded-xl bg-accent w-fit text-bg1 font-semibold hover:opacity-75 disabled:opacity-50"
            onClick={() => {
              setIsConfirmationModalOpen(true);
            }}
            disabled={isLoading}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
            }}
            className="cursor-pointer px-6 py-3 rounded-xl bg-bg1 w-fit text-text1 font-semibold hover:bg-bg2 disabled:opacity-50 border border-text2"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
      {isConfirmationModalOpen && (
        <ConfirmationModal
          type="project"
          onSubmit={handleSubmit}
          onClose={() => setIsConfirmationModalOpen(false)}
          loading={isLoading}
          setLoading={setIsLoading}
        />
      )}
    </div>
  );
}

export default PlaceBidModal;
