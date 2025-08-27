import React from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import clsx from "clsx";

const GoogleCard = (props) => {
  const { _id, index, project_identifier } = props;

  const {
    Program,
    Role,
    Issues,
    ["Project Manager"]: assigneeName,
    ["Contract Start Date"]: startDate,
    ["Contract End Date"]: endDate,

    ["Resource Name"]: projectmanager,
    ["Contract ID"]: contractId,
  } = props.source_data || {};

  const { ["Milestone_Status"]: progress, ["Burnout_Risk"]: burnoutRisk } =
    props.ai_predictions || {};

  const phaseColor = ["red", "sky", "pink"][index % 3];
  const borderColor = ["red", "sky", "pink"][index % 3];
  // Dynamic colors using index
  function statusColor(progress) {
    const str = progress?.toString().toLowerCase().trim();

    if (str === "completed") return "green-500";
    if (str === "on track") return "blue-500";
    if (str === "delayed") return "yellow-400";

    return "gray-500";
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

  function progressValue(progress) {
    if (!progress) return 0;

    const str = progress.toString().toLowerCase().trim();

    if (str === "completed") return 100;
    if (str === "on track") return 70;
    if (str === "delayed") return 40;

    // fallback: try to parse numeric
    const num = parseFloat(str);
    if (!isNaN(num)) {
      return Math.max(0, Math.min(num, 100));
    }

    return 0;
  }

  function statusColorClass(progress) {
    const str = progress?.toString().toLowerCase().trim();

    if (str === "completed") return "bg-green-500";
    if (str === "on track") return "bg-blue-500";
    if (str === "delayed") return "bg-yellow-400";

    return "bg-gray-500";
  }

  function getInitial(name) {
    if (!name) return "";
    return name.trim().charAt(0).toUpperCase();
  }

  //console.log("gog", props);

  return (
    <div className="bg-[#F9FAFB] rounded-xl shadow-sm p-5 border border-transparent hover:border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <div className="text-xs text-gray-400 font-semibold">
          <span>{formatDate(startDate)}</span>
          <span className="mx-2">to</span>
          <span>{formatDate(endDate)}</span>
        </div>
        <div
          className={clsx("text-xs font-bold rounded-lg px-3 py-1", {
            "bg-red-200 text-red-600": phaseColor === "red",
            "bg-pink-200 text-pink-600": phaseColor === "pink",
            "bg-sky-200 text-sky-600": phaseColor === "sky",
          })}
        >
          {Program}
        </div>
      </div>
      <div className="border-b border-gray-300 pb-2 mb-3">
        <p className="font-bold text-gray-900 text-sm">{project_identifier}</p>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full bg-${phaseColor}-200 text-${phaseColor}-700 font-semibold`}
        >
          {getInitial(projectmanager)}
        </div>
        <p className="text-sm font-semibold text-gray-900">
          {projectmanager}{" "}
          <span className="font-normal text-gray-600">/ {contractId}</span>
        </p>
        <p className="ml-auto text-red-600 font-bold text-sm">{burnoutRisk}%</p>
      </div>
      <p className="text-xs text-gray-500 mb-2">{Role}</p>
      <div className="flex items-center justify-between mb-2">
        <p className={`text-${statusColor(progress)} font-bold text-sm`}>
          {progress}
        </p>
        <p className="text-xs text-gray-600">{progressValue(progress)}%</p>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${statusColorClass(progress)}`}
          style={{ width: `${progressValue(progress)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-600 mt-2 mb-4">
        <span>
          <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-1"></span>
          Issues
        </span>
        <span>{Issues}</span>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
        <div className="flex gap-1">
          <div
            className={clsx(
              "w-6 h-6 rounded-full border-2 font-semibold flex items-center justify-center",
              {
                "border-red-600 text-red-600": borderColor === "red",
                "border-pink-600 text-pink-600": borderColor === "pink",
                "border-sky-600 text-sky-600": borderColor === "sky",
              }
            )}
          >
            {getInitial(assigneeName)}
          </div>
          <p className="font-semibold mt-1 text-gray-900">{assigneeName}</p>
        </div>

        <div>
          <Link
            to={`/dashboard/insights/google-details/${_id}`}
            title="Detail View"
          >
            <div className="flex gap-1">
              <FaEye className="ml-auto mt-0.5 text-blue-900 cursor-pointer" />
              <span className="font-semibold text-blue-900 text-xs">
                Detail View
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GoogleCard;
