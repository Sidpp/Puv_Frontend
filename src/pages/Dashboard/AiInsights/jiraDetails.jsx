import React, { useEffect, useState } from "react";
import { FaFlag, FaThumbsUp, FaExclamationCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  approveJiraIssue,
  getJiraIssueById,
} from "../../../services/oprations/jiraAPI";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createFeedback } from "../../../services/oprations/feedbackAPI";

const JiraDetails = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // modal state
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await dispatch(getJiraIssueById(id));
        setIssue(res);
      } catch (error) {
        console.error("Failed to fetch Jira issue:", error);
      }
    };

    fetchIssue();
  }, [dispatch, id]);

  if (!issue) {
    return <p className="text-center py-10">Loading...</p>;
  }

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
        ai_summary:issue?.ai_summary,
        source:"Jira"
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
      await dispatch(approveJiraIssue(id, "approved"));
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
      await dispatch(approveJiraIssue(id, "rejected"));
      setIssue((prev) => ({ ...prev, rejected: true }));

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error rejecting issue");
    }
  };

  const {
    key,
    summary,
    assignee,
    priority,
    status,
    ai_priority_score,
    ai_delay_score,
    ai_summary,
    update_inactivity_days,
    days_in_current_status,
    due_date,
    last_status_change_date,
    last_ai_interaction_day,
    team,
    original_estimate,
    remaining_estimate,
    time_logged,
    worklog_enterie,
    status_transition_log,
    project_name,
    reporter,
    executive_summary,
    burnout_flag,
  } = issue;

  return (
    <div className="bg-white text-gray-900 max-w-[1200px] mx-auto p-6">
      <header className="flex items-center justify-between border-b border-gray-300 pb-3 mb-6">
        <h1 className="text-[17px] font-normal text-[#0B2E56]">
          {project_name}
        </h1>
      </header>

      <div className="space-y-4">
        {/* Task Overview */}
        <section className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-3/4 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-[#00607F] text-white font-semibold text-[17px] px-6 py-4">
              Task ID - <span className="font-bold">{key}</span>
            </div>
            <div className="bg-[#F7FAF9] px-6 py-5 flex-1">
              <p className="font-semibold mb-1 text-[15px]">Summary</p>
              <h2 className="font-bold text-[18px] lg:text-[20px] leading-tight">
                {summary}
              </h2>
            </div>
          </div>

          <div className="w-full lg:w-1/4 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-[#A9E79E] flex justify-between items-center px-6 py-4 font-semibold text-[15px] text-[#0B2E56]">
              <span>Status</span>
              <span className="flex items-center gap-2 font-bold">
                {status} <FaThumbsUp className="text-[#2F7D32]" />
              </span>
            </div>
            <div className="bg-[#F7FAF9] px-6 py-5 flex items-center justify-between flex-1">
              <p className="font-semibold">Priority</p>
              <p className="font-extrabold text-[20px] text-[#D31B2B] flex items-center gap-2">
                {priority} <FaExclamationCircle />
              </p>
            </div>
          </div>
        </section>

        {/* Assignee & Flags */}
        <section className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-[#F7FAF9] rounded-lg px-6 py-4 space-y-3">
            <div className="flex justify-between">
              <p className="font-semibold text-[14px]">Assignee</p>
              <p className="font-semibold text-[#0B2E56] text-[15px]">
                {assignee || "N/A"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-[14px]">Reporter</p>
              <p className="font-semibold text-[#0B2E56] text-[15px]">
                {reporter}
              </p>
            </div>
          </div>

          <div className="flex-1 bg-[#D3E3FB] rounded-lg flex justify-between items-center px-4 py-4">
            <p className="font-semibold text-[14px] flex items-center gap-1">
              Burnout Flag <FaFlag className="text-red-600 text-[14px]" />
            </p>
            <p className="font-bold text-[#006CA2] text-[16px]">
              {burnout_flag}
            </p>
          </div>
          <div className="flex-1 bg-[#F0D7E6] rounded-lg flex justify-between items-center px-4 py-4">
            <p className="font-semibold text-[14px] flex items-center gap-1">
              Executive Summary <FaFlag className="text-red-600 text-[14px]" />
            </p>
            <p className="font-bold text-[#D31B2B] text-[16px]">
              {executive_summary || "N/A"}
            </p>
          </div>
        </section>

        {/* Inactivity and Dates */}
        <section className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-[#F7FAF9] rounded-lg px-6 py-4 space-y-3">
            <div className="flex justify-between">
              <p className="font-semibold text-[14px]">
                Update Inactivity Days
              </p>
              <p className="font-bold text-[15px]">{update_inactivity_days}</p>
            </div>
            <div className="flex justify-between items-center mr-4 mt-2">
              <p className="font-semibold text-sm">Days in Current Status</p>
              <p className="font-bold text-base ml-3">
                {days_in_current_status}
              </p>
            </div>
          </div>

          {[
            ["Due Date", due_date],
            ["Last Status Change", last_status_change_date],
            ["Last AI Interaction", last_ai_interaction_day],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex-1 bg-[#F7FAF9] rounded-lg px-4 py-4 text-center"
            >
              <p className="font-semibold text-[14px] mb-1">{label}</p>
              <time dateTime={value || ""} className="font-bold text-[15px]">
                {value ? new Date(value).toLocaleDateString() : "N/A"}
              </time>
            </div>
          ))}
        </section>

        {/* AI Scores + Status Log + Team Info */}
        <section className="flex flex-col lg:flex-row gap-4">
          {/* AI Scores */}
          <div className="flex-1 bg-[#F7FAF9] rounded-lg flex justify-around items-center py-6">
            {[
              {
                label: "AI Priority Score",
                value: ai_priority_score,
                stroke: "",
              },
              {
                label: "AI Delay Score",
                value: ai_delay_score,
                stroke: "",
              },
            ].map((item, idx) => {
              const circleLength = 276.46;

              // ✅ Dynamic color logic
              let strokeColor = item.stroke;

              if (item.label === "AI Priority Score") {
                if (item.value < 0.4) strokeColor = "#A7C7E7"; // Light Blue
                else if (item.value < 0.7)
                  strokeColor = "#4A6B8A"; // Medium Blue
                else strokeColor = "#1E3A5F"; // Dark Blue
              }

              if (item.label === "AI Delay Score") {
                if (item.value < 0.4) strokeColor = "#3B9B2F"; // Green
                else if (item.value < 0.7) strokeColor = "#FFA500"; // Orange
                else strokeColor = "#FF0000"; // Red
              }

              const offset = circleLength - item.value * circleLength;

              return (
                <div key={idx} className="text-center">
                  {/* Label stays neutral */}
                  <p className="font-semibold text-[14px] mb-2 text-gray-700">
                    {item.label}
                  </p>

                  {/* Circle + Value */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        stroke="#CBD5E1"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        stroke={strokeColor}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={circleLength}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div
                      className="absolute inset-0 flex items-center justify-center font-semibold text-[22px] sm:text-[28px]"
                      style={{ color: strokeColor }}
                    >
                      {item.value.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Log */}
          <div className="flex-1 bg-[#F7FAF9] rounded-lg p-4">
            <p className="font-semibold text-[14px] mb-2">
              Status Transition Log
            </p>
            <div className="overflow-y-auto max-h-[140px] pr-2 scrollbar-thin text-[14px]">
              {(status_transition_log || []).map((log, idx) => (
                <p key={idx} className="mb-2 font-semibold">
                  From {log.from_status} → {log.to_status} on{" "}
                  {new Date(log.transition_time).toLocaleDateString()}
                </p>
              ))}
            </div>
          </div>

          {/* Team Info */}
          <div className="flex-1 bg-[#F7FAF9] rounded-lg p-6 space-y-3 text-[14px]">
            {[
              ["Team", team],
              ["Original Estimate", original_estimate],
              ["Time Logged", time_logged],
              ["Remaining Estimate", remaining_estimate],
              ["Worklog Entries", worklog_enterie],
            ].map(([label, value], idx) => (
              <p key={idx} className="text-gray-600 font-semibold">
                {label}
                <span className="float-right text-black ml-3 font-bold text-[15px]">
                  {value}
                </span>
              </p>
            ))}
          </div>
        </section>

        {/* AI Summary */}
        <section className="bg-[#F7FAF9] rounded-lg p-6 relative">
          <p className="font-bold text-[14px] mb-2">AI Predictive Summary</p>
          <p className="text-[16px] leading-relaxed">{ai_summary}</p>

          {/* Feedback button */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* If approved → show Approved */}
            {issue?.approved ? (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium text-white shadow 
      bg-gradient-to-r from-green-500 via-green-600 to-green-700"
              >
                Approved
              </span>
            ) : issue?.rejected ? (
              // If rejected → show Rejected
              <span
               className="px-3 py-1 rounded-full text-xs font-medium text-white shadow 
  bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 hover:opacity-90 transition"
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
    </div>
  );
};

export default JiraDetails;
