import React from "react";
import { Link } from "react-router-dom";

const JiraCard = ({
  _id,
  priority,
  issueKey,
  project_name,
  summary,
  ai_delay_score,
}) => {
  const priorityStyles = {
    Highest: "bg-red-200 text-red-800",
    High: "bg-orange-200 text-orange-800",
    Medium: "bg-yellow-200 text-yellow-800",
    Low: "bg-green-200 text-green-800",
    Lowest: "bg-blue-200 text-blue-800",
    Default: "bg-gray-200 text-gray-800",
  };
  //console.log("jiracard",id, priority, key, project_name, summary, ai_delay_score)

  return (
    <div className="bg-[#F9FAFB] rounded-lg p-4 shadow-sm max-w-[280px]">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
          <span className="text-red-500">🦠</span>
          <span>{issueKey}</span>
        </div>
        <div
          className={`${priorityStyles[priority]} text-xs font-semibold rounded-md px-2 py-0.5`}
        >
          {priority}
        </div>
      </div>
      <h3 className="text-[#002E5D] font-bold text-sm mb-1">{project_name}</h3>
      <p className="text-gray-600 text-xs mb-2">{summary}.</p>

      <div className="text-[10px] text-gray-500 font-semibold mb-1">
        Ai Delay Score{" "}
        <span className="ml-1 font-bold text-[11px]">{ai_delay_score}</span>
      </div>

      <div className="w-full h-2 bg-gray-300 rounded-full mb-2 overflow-hidden">
        <div
          className="h-2 bg-yellow-300 rounded-full transition-all duration-300"
          style={{ width: `${ai_delay_score * 100}%` }}
        ></div>
      </div>

      <Link
        to={`/dashboard/insights/jira-summary`}
        className="text-[#004C8C] text-xs font-semibold hover:underline"
      >
        Detail view
      </Link>
    </div>
  );
};

export default JiraCard;
