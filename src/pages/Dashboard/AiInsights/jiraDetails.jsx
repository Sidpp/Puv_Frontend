import React, { useEffect, useState } from "react";
import {
  FaFlag,
  FaThumbsUp,
  FaExclamationCircle,
} from "react-icons/fa";
import { useDispatch } from "react-redux";

import { getJiraIssueById } from "../../../services/oprations/jiraAPI";
import { useParams } from "react-router-dom";

const JiraDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [issue, setIssue] = useState(null);

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
    status_transition,
    project_name,
    reporter,
    executive_summary,
    burnout_flag,
  } = issue;

  return (
    <div className="bg-white text-gray-900 max-w-[1200px] mx-auto p-6">
      <header className="flex items-center justify-between border-b border-gray-300 pb-3 mb-6">
        <h1 className="text-[17px] font-normal text-[#0B2E56]">{project_name}</h1>
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
                {assignee}
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
              {executive_summary}
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
            <div className="flex justify-between mt-2">
              <p className="font-semibold text-[14px]">
                Days in Current Status
              </p>
              <p className="font-bold text-[15px]">{days_in_current_status}</p>
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
              <time dateTime={value} className="font-bold text-[15px]">
                {new Date(value).toLocaleDateString()}
              </time>
            </div>
          ))}
        </section>

        {/* AI Scores + Status Log + Team Info */}
        <section className="flex flex-col lg:flex-row gap-4">
          {/* AI Scores */}
          <div className="flex-1 bg-[#F7FAF9] rounded-lg flex justify-around items-center py-6">
            {[
              { label: "AI Priority Score", value: ai_priority_score, stroke: "#4A6B8A" },
              { label: "AI Delay Score", value: ai_delay_score, stroke: "#3B9B2F" },
            ].map((item, idx) => {
              const circleLength = 276.46;
              const offset = circleLength - item.value * circleLength;

              return (
                <div key={idx} className="text-center">
                  <p className="font-semibold text-[14px] mb-2">{item.label}</p>
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
                        stroke={item.stroke}
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
                      style={{ color: item.stroke }}
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
            <p className="font-semibold text-[14px] mb-2">Status Transition Log</p>
            <div className="overflow-y-auto max-h-[140px] pr-2 scrollbar-thin text-[14px]">
              {(status_transition || []).map((log, idx) => (
                <p key={idx} className="mb-2 font-semibold">
                  From {log.fromString} → {log.toString} on{" "}
                  {new Date(log.created).toLocaleDateString()}
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
        <section className="bg-[#F7FAF9] rounded-lg p-6">
          <p className="font-bold text-[14px] mb-2">AI Summary</p>
          <p className="text-[16px] leading-relaxed">{ai_summary}</p>
        </section>
      </div>
    </div>
  );
};

export default JiraDetails;
