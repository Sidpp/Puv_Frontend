import React, { useEffect, useState } from "react";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import { FaCheck, FaRegCircle, FaExclamationTriangle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  approveGoogleSumary,
  getGoogleSheetById,
} from "../../../services/oprations/googleAPI";
import { createFeedback } from "../../../services/oprations/feedbackAPI";
import toast from "react-hot-toast";

const GoogleDetails = () => {
  const [selectedLabel, setSelectedLabel] = useState(null);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await dispatch(getGoogleSheetById(id));
        // console.log("Fetched issue1:", res);
        console.log("res payload", res?.ai_predictions);
        // console.log("status_transition_log", res?.status_transition);
        setIssue(res);
        console.log("Fetched issue:", res);
      } catch (error) {
        console.error("Failed to fetch Jira issues:", error);
      }
    };

    fetchIssues();
  }, [dispatch, issue]);

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      toast.error("Feedback cannot be empty");
      return;
    }

    const res = await dispatch(
      createFeedback({
        userid: user._id,
        feedback: feedbackText,
        for: `Jira AI Predictive Summary - id ${id}`,
      })
    );

    if (res.success) {
      toast.success("Feedback submitted successfully!");
      setFeedbackText("");
      setIsModalOpen(false);
    } else {
      toast.error("Failed to submit feedback");
    }
  };

  // ✅ Handle Approve
  const handleApprove = async () => {
    try {
      await dispatch(approveGoogleSumary(issue._id, "approved"));
      setIssue((prev) => ({ ...prev, approved: true }));
    } catch (error) {
      console.error(error);
      toast.error("Error approving issue");
    }
  };

  // ✅ Handle Reject (open modal → feedback → reject)
  const handleReject = () => {
    setIsModalOpen(true); // first open feedback modal
  };

  const confirmReject = async () => {
    try {
      await dispatch(approveGoogleSumary(issue._id, "rejected"));
      setIssue((prev) => ({ ...prev, rejected: true }));

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error rejecting issue");
    }
  };

  if (!issue || Object.keys(issue).length === 0) {
    return <p className="text-center py-10">Loading...</p>;
  }

  const data = [
    { label: "Vendor", value: issue?.source_data?.["Vendor"] },
    {
      label: "Allocated Hours",
      value: issue?.source_data?.["Allocated Hours"],
    },
    {
      label: "Actual Hours",
      value: issue?.source_data?.["Actual Hours"],
      align: "text-right",
    },
  ];

  function getStatusIcon(status) {
    switch (status) {
      case "Completed":
        return <FaCheck className="text-green-600" />;
      case "On Track":
        return <FaRegCircle className="text-blue-600" />;
      case "Delayed":
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return null;
    }
  }

  function getNeedleAngle(rag) {
    switch (rag) {
      case "Red":
        return -60; // left
      case "Yellow":
        return 0; // middle
      case "Green":
        return 60; // right
      default:
        return 0;
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="bg-white text-gray-900 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-300 pb-3 mb-6">
        <h1 className="text-[17px] font-normal text-[#0B2E56]">
          {issue?.source_data?.Project}
        </h1>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full">
        {/* Left Section */}
        <section className="space-y-6 flex flex-col">
          <h2 className="bg-[#00294D] text-white text-[18px] font-semibold rounded-md px-6 py-3">
            Program - {issue?.source_data?.Program}
          </h2>

          {/* Project Manager */}
          <div className="bg-[#F7FAF9] p-4 rounded-md space-y-2">
            {[
              ["Project Manager", issue?.source_data?.["Project Manager"]],
              ["Contract ID", issue?.source_data?.["Contract ID"]],
              [
                "Contract Start Date",
                formatDate(issue?.source_data?.["Contract Start Date"]),
              ],
              [
                "Contract End Date",
                formatDate(issue?.source_data?.["Contract End Date"]),
              ],
            ].map(([label, value], i) => (
              <div
                key={i}
                className="flex justify-between items-center px-4 py-2 rounded-md transition group hover:bg-[#D9E6F0] hover:border hover:border-dashed hover:border-gray-400"
              >
                <span className="font-semibold text-[14px] text-gray-700 group-hover:text-[#0B7B8A]">
                  {label}
                </span>
                <span className="font-semibold text-[14px] text-[#0B2E56] group-hover:text-[#0B7B8A]">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Price Bars */}
          <div className="bg-[#F7FAF9] p-4 rounded-md space-y-6">
            {[
              [
                "Contract Ceiling Price",
                issue?.source_data?.["Contract Ceiling Price"],
              ],
              [
                "Contract Target Price",
                issue?.source_data?.["Contract Target Price"],
              ],
              [
                "Actual Contract Spend",
                issue?.source_data?.["Actual Contract Spend"],
              ],
            ].map(([label, amount], i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-semibold text-[14px] w-40 text-gray-700">
                  {label}
                </span>
                <div className="flex-1 mx-4"></div>
                <span className="font-bold text-[15px] text-[#0B2E56]">
                  {amount}
                </span>
              </div>
            ))}
          </div>

          {/* Expiry & Burnout + Circular Chart */}
          <div className="flex gap-6 items-stretch">
            {/* Left Column: Expiry and Burnout stacked */}
            <div className="flex flex-col gap-4 flex-1">
              {/* Expiry */}
              <div className="bg-yellow-300 rounded-md p-6 flex flex-col justify-center items-center flex-1">
                <div className="flex items-center gap-2 font-semibold text-[14px] text-yellow-900">
                  <FaCheckCircle />
                  <span>Expiring soon</span>
                </div>
                <span className="font-bold text-[20px] mt-2">
                  {issue?.source_data?.["Expiring Soon"]}
                </span>
              </div>

              {/* Burnout */}
              <div className="bg-[#FDEDED] rounded-md p-6 flex flex-col justify-center items-center flex-1">
                <p className="text-red-700 font-semibold text-[16px]">
                  Burnout Risk (%)
                </p>
                <p className="text-red-700 font-bold text-[28px] mt-2">
                  {issue?.ai_predictions?.["Burnout_Risk"]}
                </p>
              </div>
            </div>

            {/* Right Column: Circular Progress */}
            <div className="bg-[#F7FAF9] rounded-md p-4 flex items-center justify-center w-56 h-full">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                {(() => {
                  const risk = issue?.ai_predictions?.["Burnout_Risk"] || 0;
                  const radius = 54;
                  const circumference = 2 * Math.PI * radius;
                  const progress = (risk / 100) * circumference;

                  return (
                    <>
                      <circle cx="60" cy="60" r="42" fill="white" />
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke="#F7D130"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke="#F47E2B"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                        transform="rotate(-90 60 60)"
                      />
                      <text
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="22"
                        fontWeight="700"
                        fill="#7B8FA4"
                      >
                        {risk}%
                      </text>
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
        </section>

        {/* Right Section */}
        <section className="space-y-6 w-full min-w-0 flex flex-col">
          <h2 className="bg-[#0B7B8A] text-white text-[18px] font-semibold rounded-md px-6 py-3">
            Portfolio - Growth
          </h2>

          {/* Resource and Vendor */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="bg-[#F7FAF9] rounded-md p-4 flex-1 min-w-[200px]">
              <p className="text-[14px] text-gray-600 font-semibold">
                Resource Name
              </p>
              <p className="font-bold text-[15px] text-[#0B2E56]">
                {issue?.source_data?.["Resource Name"]}
              </p>
              <p className="text-[14px] text-gray-600 font-semibold mt-2">
                Role
              </p>
              <p className="font-bold text-[15px] text-[#0B2E56]">
                {issue?.source_data?.["Role"]}
              </p>
            </div>

            <div className="bg-[#F7FAF9] rounded-md px-4 py-4 space-y-2 flex-1 min-w-[200px]">
              {data.map(({ label, value, align }, i) => {
                const isSelected = selectedLabel === label;

                return (
                  <div
                    key={i}
                    onClick={() => setSelectedLabel(label)}
                    className={`flex items-center justify-between rounded-md px-3 py-2 cursor-pointer transition-all duration-200 group
                hover:bg-[#D9E6F0] hover:border hover:border-dashed hover:border-gray-400
                ${
                  isSelected
                    ? "border border-dashed border-red-600 bg-white"
                    : ""
                }`}
                  >
                    <span className="font-semibold text-[14px] text-gray-700 group-hover:text-[#0B7B8A]">
                      {label}
                    </span>
                    <span
                      className={`text-[14px] text-[#0B2E56] group-hover:text-[#0B7B8A] ${
                        isSelected ? "font-bold text-[15px]" : "font-bold"
                      } ${align || ""}`}
                    >
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-[#F7FAF9] rounded-md px-4 py-4 space-y-2 flex-1">
            {[
              {
                label: "Planned Cost",
                amount: issue?.source_data?.["Planned Cost"],
              },
              {
                label: "Forecasted Cost",
                amount: issue?.ai_predictions?.["Forecasted_Cost"],
              },
              {
                label: "Actual Cost",
                amount: issue?.source_data?.["Actual Cost"],
              },
              {
                label: "Forecasted Deviation",
                amount: issue?.ai_predictions?.["Forecasted_Deviation"],
              },
              {
                label: "Variance At Completion",
                amount: issue?.ai_predictions?.["Variance_At_Completion"],
              },
            ].map(({ label, amount, color }, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-[#D9E6F0] hover:border hover:border-dashed hover:border-gray-400 group"
              >
                <span className="font-semibold text-[14px] text-gray-700 group-hover:text-[#0B7B8A]">
                  {label}
                </span>
                <div className="flex-1 mx-4 max-w-[140px]">
                  <div className={`h-3 rounded-full w-full ${color}`}></div>
                </div>
                <span className="font-bold text-[15px] text-[#0B2E56]">
                  {amount}
                </span>
              </div>
            ))}
          </div>

          {/* Project Status + Gauge */}
          <div className="flex flex-wrap gap-4 flex-1">
            {issue?.ai_predictions?.["Project_Status"] && (
              <div className="bg-[#F7FAF9] rounded-md flex flex-col items-center justify-center p-4 w-[200px]">
                <svg width="200" height="120" viewBox="0 0 200 120">
                  <path
                    d="M40 100 A60 60 0 0 1 100 40"
                    fill="none"
                    stroke="#E52E2E"
                    strokeWidth="20"
                  />
                  <path
                    d="M100 40 A60 60 0 0 1 160 100"
                    fill="none"
                    stroke="#F7D130"
                    strokeWidth="20"
                  />
                  <path
                    d="M160 100 A60 60 0 0 1 40 100"
                    fill="none"
                    stroke="#3ED400"
                    strokeWidth="20"
                  />
                  <g
                    transform={`rotate(${getNeedleAngle(
                      issue?.ai_predictions?.["Project_Status"]
                    )}, 100, 100)`}
                  >
                    <line
                      x1="100"
                      y1="100"
                      x2="100"
                      y2="40"
                      stroke="#2F2F2F"
                      strokeWidth="4"
                    />
                  </g>
                  <circle cx="100" cy="100" r="5" fill="#2F2F2F" />
                </svg>
                <p className="font-semibold mt-2 text-[14px]">
                  Project Status (RAG)
                </p>
              </div>
            )}

            <div className="bg-[#F7FAF9] rounded-md p-4 flex-1 min-w-[200px] space-y-3">
              {[
                ["Updated Date", formatDate(issue?.["last_processed_at"])],
                ["Risk", issue?.ai_predictions?.["Risk"]],
                ["Issues", issue?.ai_predictions?.["Issues"]],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className="flex justify-between text-[14px] font-semibold"
                >
                  <span>{label}</span>
                  <span className="font-bold text-[#0B2E56]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Below Section */}

      {/* AI Prediction + Milestone Section */}
      <section className="flex flex-col md:flex-row gap-6 w-full mt-6">
        {/* AI Prediction Data (80%) */}
        <div className="w-full md:w-4/5 bg-gradient-to-br from-[#E6F7F7] to-[#F0FAFA] p-5 rounded-xl shadow border border-[#BEE3E3] relative">
          <h3 className="text-[#0B2E56] font-bold text-[16px] mb-4">
            AI Predictive Summary
          </h3>
          {issue?.ai_predictions?.ai_summary && (
            <span className="text-[13px] font-semibold text-gray-700 leading-relaxed">
              {issue.ai_predictions.ai_summary}
            </span>
          )}

          {/* Feedback button */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* If approved → show Approved */}
            {issue?.ai_predictions?.approved ? (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium text-white shadow 
      bg-gradient-to-r from-green-500 via-green-600 to-green-700"
              >
                Approved
              </span>
            ) : issue?.ai_predictions?.rejected ? (
              // If rejected → show Rejected
              <span
                className="px-3 py-1 rounded-full text-xs font-medium text-white shadow 
      bg-gradient-to-r from-red-500 via-red-600 to-red-700"
              >
                Rejected
              </span>
            ) : (
              // If neither → show both action buttons
              <>
                <button
                  onClick={handleApprove}
                   className="px-3 py-1 rounded-full text-xs font-medium text-white shadow 
  bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 hover:opacity-90 transition"
                >
                  Approve
                </button>
                <button
                  onClick={handleReject}
                 className="px-3 py-1 rounded-full text-xs font-medium text-white shadow 
  bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 hover:opacity-90 transition"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>

        {/* Milestone Status (20%) */}
        <div className="w-full flex flex-col md:w-1/5 bg-[#D4F0C0] rounded-md px-4 py-4 gap-6 items-center shadow font-semibold text-[#3CA52B] text-[15px]">
          <span className="mt-3">Milestone Status</span>
          <div className="flex items-center">
            {getStatusIcon(issue?.ai_predictions?.["Milestone_Status"])}
            <span className="ml-2">
              {issue?.ai_predictions?.["Milestone_Status"] || "N/A"}
            </span>
          </div>
        </div>
      </section>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-[400px] p-6 relative">
            <h2 className="text-lg font-bold mb-4">Submit Feedback</h2>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write your feedback here..."
              className="w-full h-32 p-2 border border-gray-300 rounded mb-4 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleSubmitFeedback();
                  await confirmReject();
                }}
                className="px-5 py-2 rounded-full text-white font-medium shadow-md 
             bg-gradient-to-r from-red-500 via-red-600 to-red-700 
             hover:from-red-600 hover:via-red-700 hover:to-red-800 
             transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Submit & Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleDetails;
