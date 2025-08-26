import React, { useEffect, useState } from "react";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import { FaCheck, FaRegCircle, FaExclamationTriangle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getGoogleSheetById } from "../../../services/oprations/googleAPI";

const GoogleDetails = () => {
  const [selectedLabel, setSelectedLabel] = useState(null);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [issue, setIssue] = useState(null);

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
  }, [dispatch]);

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

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start w-full">
        {/* Left Section */}
        <section className="space-y-6">
          <h2 className="bg-[#00294D] text-white text-[18px] font-semibold rounded-md px-6 py-3">
            Program - {issue?.source_data?.Program}
          </h2>

          {/* Project Manager */}
          <div className="bg-[#F7FAF9] p-4 space-y-4 rounded-md">
            <div className="flex justify-between items-center px-4 py-2 rounded-md transition group hover:bg-[#D9E6F0] hover:border hover:border-dashed hover:border-gray-400">
              <span className="font-semibold text-[14px] text-gray-700 group-hover:text-[#0B7B8A]">
                Project Manager
              </span>
              <span className="font-semibold text-[14px] text-[#0B2E56] group-hover:text-[#0B7B8A]">
                {issue?.source_data?.["Project Manager"]}
              </span>
            </div>
            <div className="space-y-2">
              {[
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
          </div>

          {/* Price Bars */}
          <div className="bg-[#F7FAF9] p-4 rounded-md space-y-4">
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
            ].map(([label, amount, color], i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-semibold text-[14px] w-40 text-gray-700">
                  {label}
                </span>
                <div className="flex-1 mx-4">
                  <div className={`h-3 rounded-full ${color} w-full`}></div>
                </div>
                <span className="font-bold text-[15px] text-[#0B2E56]">
                  {amount}
                </span>
              </div>
            ))}
          </div>

          {/* Expiry and Burnout with Circular Chart */}
          <div className="flex flex-wrap justify-between gap-4">
            {/* Expiry & Burnout */}
            <div className="space-y-4 flex-1 min-w-[240px] max-w-[520px]">
              <div className="bg-yellow-300 rounded-md px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2 font-semibold text-[14px] text-yellow-900">
                  <FaCheckCircle />
                  <span>Expiring soon</span>
                </div>
                <span className="font-bold text-[15px]">
                  {issue?.source_data?.["Expiring Soon"]}
                </span>
              </div>

              <div className="bg-[#FDEDED] rounded-md px-6 py-6 text-center">
                <p className="text-red-700 font-semibold text-[15px]">
                  Burnout Risk (%)
                </p>
                <p className="text-red-700 font-bold text-[20px] mt-1">
                  {issue?.ai_predictions?.["Burnout_Risk"]}
                </p>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="bg-[#F7FAF9] rounded-md p-4 flex items-center justify-center w-[180px] h-[180px]">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* White inner circle */}
                <circle cx="60" cy="60" r="42" fill="white" />

                {/* Outer circular track */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="#F7D130"
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Progress path */}
                <path
                  d="M114 60a54 54 0 0 1-54 54"
                  stroke="#F47E2B"
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Center value */}
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="700"
                  fill="#7B8FA4"
                >
                  70.98
                </text>
              </svg>
            </div>
          </div>

          {/* AI Prediction Data */}
          <div className="bg-gradient-to-br from-[#E6F7F7] to-[#F0FAFA] p-5 rounded-xl shadow border border-[#BEE3E3]">
            <div className="items-center mb-4">
              <h3 className="text-[#0B2E56] font-bold text-[16px]">
                AI Summary
              </h3>
            </div>

            {issue?.ai_predictions?.ai_summary && (
              
                <span className="text-[13px] font-semibold text-gray-700">
                  {issue.ai_predictions.ai_summary}
                </span>
              
            )}
          </div>
        </section>

        {/* Right Section */}
        <section className="space-y-6 w-full min-w-0">
          <h2 className="bg-[#0B7B8A] text-white text-[18px] font-semibold rounded-md px-6 py-3">
            Portfolio - Growth
          </h2>

          {/* Resource and Vendor */}
          <div className="flex flex-col sm:flex-row gap-4">
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
            <div className="bg-[#F7FAF9] rounded-md px-4 py-4 space-y-2">
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
                        isSelected ? "font-bold text-[15px]" : "font-semibold"
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
          <div className="bg-[#F7FAF9] rounded-md px-4 py-4 space-y-2">
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
          <div className="flex flex-wrap gap-4">
            {issue?.source_data?.["Project Status (RAG)"] && (
              <div className="bg-[#F7FAF9] rounded-md flex flex-col items-center justify-center p-4 w-[200px]">
                <svg width="200" height="120" viewBox="0 0 200 120">
                  {/* Red arc: left */}
                  <path
                    d="M40 100 A60 60 0 0 1 100 40"
                    fill="none"
                    stroke="#E52E2E"
                    strokeWidth="20"
                  />
                  {/* Yellow arc: middle */}
                  <path
                    d="M100 40 A60 60 0 0 1 160 100"
                    fill="none"
                    stroke="#F7D130"
                    strokeWidth="20"
                  />
                  {/* Green arc: right */}
                  <path
                    d="M160 100 A60 60 0 0 1 40 100"
                    fill="none"
                    stroke="#3ED400"
                    strokeWidth="20"
                  />

                  {/* Needle (rotating) */}
                  <g
                    transform={`rotate(${getNeedleAngle(
                      issue?.source_data?.["Project Status (RAG)"]
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

                  {/* Needle pivot */}
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

          {/* Milestone */}
          <div className="bg-[#D4F0C0] rounded-md px-4 py-3 h-24 flex items-center justify-between font-semibold text-[#3CA52B] text-[15px]">
            <span>Milestone Status</span>
            <div className="flex items-center">
              {getStatusIcon(issue?.source_data?.["Milestone Status"])}
              <span className="ml-2">
                {issue?.source_data?.["Milestone Status"] || "N/A"}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GoogleDetails;
