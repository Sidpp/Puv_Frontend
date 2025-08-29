import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getJiraIssueById } from "../../../services/oprations/jiraAPI";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAllJiraIssues } from "../../../services/oprations/jiraAPI";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const JiraSummaryById = () => {
  const [activeSummaryId, setActiveSummaryId] = useState(null);
  const dispatch = useDispatch();
  const [jiraData, setJiraData] = useState([]);
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchIssuesByIds = async () => {
      try {
        const ids = id.split(","); // split into array
        const results = await Promise.all(
          ids.map(async (issueId) => {
            const res = await dispatch(getJiraIssueById(issueId.trim()));
            if (res) {
              return {
                _id: res._id,
                id: res.key,
                status: res.status || "Unknown",
                priority: res.priority || "Medium",
                assignee: res.assignee || "Unassigned",
                dueDate: res.due_date ? formatDate(res.due_date) : "N/A",
                lastInteraction: res.last_ai_interaction_day
                  ? formatDate(res.last_ai_interaction_day)
                  : "N/A",
                aisummary: res.ai_summary || null,
                originalEstimate: res.original_estimate || 0,
                timeSpent: res.time_logged
                  ? parseInt(res.time_logged.replace("h", ""), 10)
                  : 0,
                remainingEstimate: res.remaining_estimate || 0,
                summary: res.summary,
                labels: res.labels || [],
                projectName: res.project_name,
                marker: res.marker,
              };
            }
            return null;
          })
        );

        setJiraData(results.filter(Boolean)); // only valid issues
      } catch (error) {
        console.error("Failed to fetch Jira issues by IDs:", error);
        setJiraData([]);
      }finally {
      setLoading(false);
    }
    };

    if (id) fetchIssuesByIds();
  }, [dispatch, id]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!jiraData.length) {
    return <p className="text-center py-10">No Jira issues found.</p>;
  }

  // --- Derived Data from API ---
  const statusData = [
    {
      name: "In Progress",
      value: jiraData.filter((t) => t.status === "In Progress").length,
    },
    { name: "Done", value: jiraData.filter((t) => t.status === "Done").length },
  ];

  const hoursAnalysisData = [
    {
      name: "Original Estimated Hours",
      hours: jiraData.reduce((sum, t) => sum + (t.originalEstimate || 0), 0),
    },
    {
      name: "Time Spent Hours",
      hours: jiraData.reduce((sum, t) => sum + (t.timeSpent || 0), 0),
    },
    {
      name: "Remaining Estimated Hours",
      hours: jiraData.reduce((sum, t) => sum + (t.remainingEstimate || 0), 0),
    },
  ];

  // --- Helpers ---
  const renderCustomTick = ({ x, y, payload }) => {
    const words = payload.value.split(" ");
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={10} textAnchor="middle" fill="#0B2545" fontSize={12}>
          {words.map((word, index) => (
            <tspan x={0} dy={index === 0 ? 0 : 14} key={index}>
              {word}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-[#6DBE4A]/30 text-[#3E6B2E]";
      case "Done":
        return "bg-[#93C5FD]/70 text-[#2563EB]";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-[#FCA5A5]/70 text-[#B91C1C]";
      case "Medium":
        return "bg-[#FEF3C7]/70 text-[#B45309]";
      case "Low":
        return "bg-[#86EFAC]/70 text-[#15803D]";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <main className="text-[#0B2545] bg-slate-50 min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      <h3 className="font-bold text-2xl mb-6">{jiraData?.projectName}</h3>

      {/* --- Charts --- */}
      <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0 mb-8">
        {/* Status Pie */}
        <section className="bg-white rounded-xl p-6 flex-1 shadow-md min-w-[280px]">
          <h4 className="font-semibold mb-4 text-xl">Current Status</h4>
          <div className="flex flex-col sm:flex-row justify-around items-center gap-6">
            <div className="flex flex-col items-center flex-1 w-full">
              <div className="w-full h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "In Progress", value: statusData[0].value },
                        {
                          name: "Remaining",
                          value: jiraData.length - statusData[0].value,
                        },
                      ]}
                      dataKey="value"
                      innerRadius="40%"
                      outerRadius="60%"
                      paddingAngle={3}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      <Cell fill="#6DBE4A" />
                      <Cell fill="#E6E9E6" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="font-semibold text-lg mt-2">
                In Progress{" "}
                <span className="text-2xl font-extrabold">
                  {jiraData.length > 0
                    ? Math.round((statusData[0].value / jiraData.length) * 100)
                    : 0}
                  %
                </span>
              </p>
            </div>

            <div className="flex flex-col items-center flex-1 w-full">
              <div className="w-full h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Done", value: statusData[1].value },
                        {
                          name: "Remaining",
                          value: jiraData.length - statusData[1].value,
                        },
                      ]}
                      dataKey="value"
                      innerRadius="40%"
                      outerRadius="60%"
                      paddingAngle={3}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      <Cell fill="#4B55D2" />
                      <Cell fill="#E6E6E6" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="font-semibold text-lg mt-2">
                Done{" "}
                <span className="text-2xl font-extrabold">
                  {jiraData.length > 0
                    ? Math.round((statusData[1].value / jiraData.length) * 100)
                    : 0}
                  %
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Hours Analysis */}
        <section className="bg-white rounded-xl p-6 flex-1 shadow-md min-w-[280px]">
          <h4 className="font-semibold mb-4 text-xl">Hours Spend Analysis</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={hoursAnalysisData}
              margin={{ bottom: 30, top: 10, right: 10, left: -10 }}
            >
              <defs>
                <linearGradient id="gradDarkBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E3A8A" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
                <linearGradient id="gradDarkYellow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                tick={renderCustomTick}
                interval={0}
                height={50}
              />
              <YAxis />
              <Tooltip cursor={{ fill: "rgba(240, 243, 242, 0.5)" }} />
              <Bar dataKey="hours" radius={[5, 5, 0, 0]}>
                <Cell fill="url(#gradDarkBlue)" />
                <Cell fill="url(#gradBlue)" />
                <Cell fill="url(#gradDarkYellow)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* Table (Desktop) */}
      <div className="hidden md:block overflow-x-auto shadow-lg rounded-xl border border-[#E6E9E8] bg-white">
        <table className="w-full text-left text-base border-collapse">
          <thead className="bg-[#F0F3F2] text-[#0B2545] font-bold text-sm sticky top-0 z-10">
            <tr>
              {[
                "Task ID",
                "Status",
                "Priority",
                "Assignee",
                "Due Date",
                "Last Interaction",
                "AI Summary",
                "Action",
              ].map((col) => (
                <th
                  key={col}
                  className="py-4 px-6 border-b border-[#E6E9E8] whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[#0B2545] font-medium text-[15px]">
            {jiraData.map((task, index) => (
              <tr
                key={task.id}
                className={`h-[72px] ${
                  index % 2 === 0 ? "bg-white" : "bg-[#F9FBFA]"
                }`}
              >
                <td className="py-4 px-6 border-b border-[#E6E9E8] text-gray-600">
                  {task.id}{" "}
                  {(task.marker === true ||
                    task.marker === "true" ||
                    task.marker === 1) && (
                    <FaExclamationTriangle className="inline text-red-500 ml-1" />
                  )}
                </td>

                <td className="py-4 px-6 border-b border-[#E6E9E8]">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold text-sm inline-block ${getStatusStyle(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="py-4 px-6 border-b border-[#E6E9E8]">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold text-sm inline-block ${getPriorityStyle(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="py-4 px-6 border-b border-[#E6E9E8] text-gray-600">
                  {task.assignee}
                </td>
                <td className="py-4 px-6 border-b border-[#E6E9E8]">
                  {task.dueDate}
                </td>
                <td className="py-4 px-6 border-b border-[#E6E9E8]">
                  {task.lastInteraction}
                </td>
                <td className="py-4 px-6 border-b border-[#E6E9E8] text-center">
                  <div className="relative flex justify-center items-center">
                    <button
                      disabled={!task.aisummary}
                      onClick={() =>
                        setActiveSummaryId(
                          activeSummaryId === task.id ? null : task.id
                        )
                      }
                      className="disabled:cursor-not-allowed"
                    >
                      <FaEye
                        className={
                          task.aisummary
                            ? "text-[#00254D] hover:scale-110 transition-transform duration-200"
                            : "text-gray-300"
                        }
                      />
                    </button>
                    {activeSummaryId === task.id && task.aisummary && (
                      <div className="mt-2 text-xs text-slate-600 text-left p-3 bg-slate-100 rounded-md absolute top-full right-0 w-64 z-10 shadow-lg border border-gray-200">
                        {task.aisummary}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 border-b border-[#E6E9E8] text-[#0B2545] font-semibold">
                  <Link
                    to={`/dashboard/insights/jira-details/${task._id}`}
                    className="hover:underline text-[#006685]"
                  >
                    Detail View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card (Mobile) */}
      <div className="md:hidden space-y-4">
        {jiraData.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="font-bold text-lg text-gray-800">{task.id}</p>
              <Link
                to={`/dashboard/insights/jira-details/${task.id}`}
                className="text-sm font-semibold text-[#006685] hover:underline whitespace-nowrap"
              >
                Detail View
              </Link>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-xs ${getStatusStyle(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Priority</span>
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-xs ${getPriorityStyle(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assignee</span>
                <span className="font-medium">{task.assignee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium">{task.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Interaction</span>
                <span className="font-medium">{task.lastInteraction}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">AI Summary</span>
                <button
                  disabled={!task.aisummary}
                  onClick={() =>
                    setActiveSummaryId(
                      activeSummaryId === task.id ? null : task.id
                    )
                  }
                  className="disabled:cursor-not-allowed"
                >
                  <FaEye
                    className={
                      task.aisummary
                        ? "text-[#00254D] cursor-pointer"
                        : "text-gray-300"
                    }
                  />
                </button>
              </div>
              {activeSummaryId === task.id && task.aisummary && (
                <p className="mt-2 text-sm text-gray-600 bg-slate-100 p-3 rounded-md">
                  {task.aisummary}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default JiraSummaryById;
