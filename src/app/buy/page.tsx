"use client";

import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import { ChevronDown } from "lucide-react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

function page() {
  const { currentUser, refreshUser, loading: userLoading } = useCurrentUser();
  const router = useRouter();
  const clearance = currentUser?.clearance == "dev" ? "dev" : "client";
  const tokenType = clearance == "dev" ? "bid" : "project";
  const [tokenPackage, setTokenPackage] = React.useState(
    clearance == "dev" ? 50 : 10
  );
  const [dropDownOpen, setDropDownOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Update token package when clearance changes
  React.useEffect(() => {
    if (currentUser?.clearance) {
      setTokenPackage(currentUser.clearance === "dev" ? 50 : 10);
    }
  }, [currentUser?.clearance]);

  const bidPackages: {
    [key: number]: { description: string; price: number };
  } = {
    10: { description: "10 bid tokens", price: 100 },
    25: { description: "25 bid tokens", price: 200 },
    50: { description: "50 bid tokens", price: 350 },
  };

  const projectPackages: {
    [key: number]: { description: string; price: number };
  } = {
    1: { description: "1 project token", price: 100 },
    5: { description: "5 project tokens", price: 400 },
    10: { description: "10 project tokens", price: 700 },
  };

  // Load Razorpay script
  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const getCurrentPackage = () => {
    if (clearance === "dev") {
      return bidPackages[tokenPackage as keyof typeof bidPackages];
    } else {
      return projectPackages[tokenPackage as keyof typeof projectPackages];
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const currentPackage = getCurrentPackage();

      // Create order
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: currentPackage.price,
          tokenCount: tokenPackage,
          tokenType: tokenType,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderResponse.json();

      // Configure Razorpay options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Dev Connect",
        description: `Purchase ${tokenPackage} ${tokenType} tokens`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                tokenCount: tokenPackage,
                tokenType: tokenType,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            toast.success("Payment successful! Tokens added to your account.");

            // Refetch user data to update token count
            refreshUser();
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: currentUser?.username || "",
          email: currentUser?.email || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function (response: any) {
        toast.error("Payment failed. Please try again.");
        console.error("Payment failed:", response.error);
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while user data is being fetched
  if (userLoading) {
    return (
      <ProtectedRoute requireAuth={true} redirectTo="/login">
        <div className="p-6 flex flex-col gap-6 min-h-screen">
          <Navbar />
          <div className="p-6 border border-text2 rounded-xl w-full h-full flex flex-col gap-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-text2">Loading...</div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} redirectTo="/login">
      <div className="p-6 flex flex-col gap-6 min-h-screen">
        <Navbar />
        <div className="p-6 border border-text2 rounded-xl w-full h-full flex flex-col gap-6">
          <h1 className="text-accent text-5xl">Buy {tokenType} tokens</h1>
          <div className="flex flex-col gap-1">
            Available {tokenType.charAt(0).toUpperCase() + tokenType.slice(1)}{" "}
            Tokens:<br></br>
            {currentUser?.tokenCount || 0}
          </div>
          <div className="flex flex-col gap-1">
            Select package:<br></br>
            <div className="relative">
              <button
                onClick={() => {
                  setDropDownOpen(!dropDownOpen);
                }}
                className="flex items-center p-2.5 cursor-pointer flex-row justify-between border border-text2 rounded-xl w-70"
              >
                {getCurrentPackage().description} - ₹{getCurrentPackage().price}
                <ChevronDown
                  className={`w-4 h-4 ${dropDownOpen && "rotate-180"}`}
                />
              </button>
              {dropDownOpen && (
                <div className="absolute top-full left-0 mt-1 flex flex-col gap-0 border border-text2 rounded-xl bg-bg1 z-10 shadow-lg w-70">
                  {clearance == "dev"
                    ? Object.entries(bidPackages).map(([tokens, pkg]) => (
                        <button
                          key={tokens}
                          onClick={() => {
                            setTokenPackage(parseInt(tokens));
                            setDropDownOpen(false);
                          }}
                          className="p-2.5 cursor-pointer hover:bg-bg2 text-left first:rounded-t-xl last:rounded-b-xl"
                        >
                          {pkg.description} - ₹{pkg.price}
                        </button>
                      ))
                    : Object.entries(projectPackages).map(([tokens, pkg]) => (
                        <button
                          key={tokens}
                          onClick={() => {
                            setTokenPackage(parseInt(tokens));
                            setDropDownOpen(false);
                          }}
                          className="p-2.5 cursor-pointer hover:bg-bg2 text-left first:rounded-t-xl last:rounded-b-xl"
                        >
                          {pkg.description} - ₹{pkg.price}
                        </button>
                      ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            Your new {tokenType.charAt(0).toUpperCase() + tokenType.slice(1)}{" "}
            Token Balance will be:<br></br>
            {(currentUser?.tokenCount || 0) + tokenPackage}
          </div>
          <button
            type="button"
            className="cursor-pointer ml-auto px-6 py-3 rounded-xl bg-accent w-fit text-bg1 font-semibold hover:opacity-75 disabled:opacity-50"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : `Buy Tokens for ₹${getCurrentPackage().price}`}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default page;
