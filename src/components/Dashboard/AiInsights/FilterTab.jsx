import React from "react";

const StatusFilter = () => {
  return (
    <div className="flex space-x-4">
      <div className="relative inline-block border border-gray-300 rounded-xl shadow-sm">
        <select
          aria-label="Program filter"
          className="block appearance-none bg-transparent text-gray-700 mt-1 font-semibold text-sm py-2 pl-4 pr-10 focus:outline-none cursor-pointer"
        >
          <option value="">Program</option>
          <option value="portfolio">Portfolio</option>
          <option value="project">Project</option>
          <option value="campaign">Campaign</option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {[
        { label: "On Track", color: "text-blue-600" },
        { label: "Delay", color: "text-red-600" },
        { label: "Completed", color: "text-green-400" },
      ].map((status, idx) => (
        <div
          key={idx}
          className="flex items-center space-x-2 border border-gray-300 rounded-xl py-2 px-4 shadow-sm cursor-default"
        >
          <svg
            className={`w-5 h-5 ${status.color}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
          </svg>
          <span className="text-gray-700 font-semibold text-sm">
            {status.label}
          </span>
          <span className="ml-2 bg-gray-100 text-gray-700 font-semibold text-sm rounded-full px-3 py-1">
            4
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatusFilter;
