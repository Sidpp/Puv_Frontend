import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { FaEye } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getAllGoogleDetails,
  getGoogleSheetById,
} from "../../../services/oprations/googleAPI";
// Doughnut Chart Component
const DoughnutChart = ({ data }) => {
  const COLORS = ["#84cc16", "#60a5fa", "#facc15", "#ef4444"];
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
  }) => {
    const radius = outerRadius + 15; // push label outside the slice
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""}
        {/* show only if >5% */}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Main Component
const GoogleSummaryPageById = () => {
  const { id } = useParams();
  const [projectData, setProjectData] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [activeSummaryId, setActiveSummaryId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (id) {
          const ids = id.split(","); // split comma-separated ids
          if (ids.length > 1) {
            // Fetch multiple
            const results = await Promise.all(
              ids.map((singleId) => dispatch(getGoogleSheetById(singleId)))
            );
            setProjectData(results.filter(Boolean)); // remove null/undefined
          } else {
            // Fetch single
            res = await dispatch(getGoogleSheetById(ids[0]));
            setProjectData(res ? [res] : []);
          }
        } else {
          // Fetch all projects
          res = await dispatch(getAllGoogleDetails());
          setProjectData(Array.isArray(res) ? res : []);
        }
        setStatus("succeeded");
      } catch (err) {
        console.error("Failed to fetch Google data:", err);
        setError(err.message);
        setStatus("failed");
      }
    };

    fetchData();
  }, [dispatch, id]);

  if (status === "loading") {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading project data...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Error: {error}</h2>
        <Link
          to="/dashboard"
          className="text-blue-600 hover:underline mt-4 inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!projectData.length) {
    return <div className="p-6 text-center">No project data available.</div>;
  }

  // Prepare charts data dynamically
  // Aggregate projects by month
  const monthlyTotals = {};

  projectData.forEach((proj) => {
    const rawDate = proj.sync_timestamp;
    if (!rawDate) return;

    const dateObj = new Date(rawDate);
    const monthLabel = dateObj.toLocaleString("default", {
      month: "short",
      year: "numeric",
    }); // e.g. "Jun 2025"

    if (!monthlyTotals[monthLabel]) {
      monthlyTotals[monthLabel] = { planned: 0, actual: 0, forecast: 0 };
    }

    monthlyTotals[monthLabel].planned += Number(
      proj.source_data["Planned Cost"] || 0
    );
    monthlyTotals[monthLabel].actual += Number(
      proj.source_data["Actual Cost"] || 0
    );
    monthlyTotals[monthLabel].forecast += Number(
      proj.ai_predictions?.Forecasted_Cost || 0
    );
  });

  // Convert to array for chart
  const monthlyFinancials = Object.entries(monthlyTotals).map(
    ([month, values]) => ({
      month,
      ...values,
    })
  );

  const spendData = [
    {
      name: "Planned Cost",
      value: Number(projectData[0].source_data["Planned Cost"] || 0),
      color: "#84cc16",
    },
    {
      name: "Forecasted Cost",
      value: Number(projectData[0].ai_predictions?.Forecasted_Cost || 0),
      color: "#60a5fa",
    },
    {
      name: "Actual Cost",
      value: Number(projectData[0].source_data["Actual Cost"] || 0),
      color: "#facc15",
    },
    {
      name: "Forecast Deviation",
      value: Number(projectData[0].ai_predictions?.Forecasted_Deviation || 0),
      color: "#ef4444",
    },
  ];

  return (
    <div className="text-[#0B2545] bg-slate-50 min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Google Projects Summary
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col">
          <h4 className="text-lg font-semibold mb-4">Monthly Financials</h4>

          {/* Scroll only if more than 6 months */}
          <div className="w-full flex-grow h-[300px] overflow-x-auto">
            <ResponsiveContainer
              width={
                monthlyFinancials.length > 6
                  ? monthlyFinancials.length * 120
                  : "100%"
              }
              height="100%"
            >
              <BarChart
                data={monthlyFinancials}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                barCategoryGap="20%"
              >
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar
                  dataKey="actual"
                  stackId="a"
                  fill="#00254b"
                  name="Actual"
                  barSize={40}
                />
                <Bar
                  dataKey="planned"
                  stackId="a"
                  fill="#0a8e96"
                  name="Planned"
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col">
          <h4 className="text-lg font-semibold mb-4">Spend Analysis</h4>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full sm:w-1/2 h-[240px]">
              <DoughnutChart data={spendData} />
            </div>
            <ul className="text-sm space-y-3 w-full sm:w-1/2">
              {spendData.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8">
        <div className="hidden md:block overflow-x-auto shadow-lg rounded-xl border border-[#E6E9E8]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F0F3F2] text-[#0B2545] font-bold text-sm sticky top-0 z-10">
              <tr>
                {[
                  "Program",
                  "Portfolio",
                  "Vendor",
                  "Project Manager",
                  "Contract ID",
                  "Burnout Risk (%)",
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
            <tbody className="text-[#0B2545] font-medium text-sm">
              {projectData.map((task) => (
                <tr key={task._id} className="h-[72px] bg-white">
                  <td className="py-4 px-6 border-b border-[#E6E9E8] text-gray-600">
                    {task.source_data.Program}
                    {(task.ai_predictions.marker === true ||
                      task.ai_predictions.marker === "true" ||
                      task.ai_predictions.marker === "True" ||
                      task.ai_predictions.marker === 1) && (
                      <FaExclamationTriangle className="inline text-red-500 ml-1" />
                    )}
                  </td>
                  <td className="py-4 px-6 border-b border-[#E6E9E8]">
                    {task.source_data.Portfolio}
                  </td>
                  <td className="py-4 px-6 border-b border-[#E6E9E8]">
                    {task.source_data.Vendor}
                  </td>
                  <td className="py-4 px-6 border-b border-[#E6E9E8] text-gray-600">
                    {task.source_data["Project Manager"]}
                  </td>
                  <td className="py-4 px-6 border-b border-[#E6E9E8]">
                    {task.source_data["Contract ID"]}
                  </td>
                  <td className="py-4 px-6 border-b border-[#E6E9E8] text-center">
                    {task.ai_predictions?.Burnout_Risk || 0}
                  </td>
                  <td className="py-4 px-6 border-b border-[#E6E9E8] text-center">
                    <div className="relative flex justify-center items-center">
                      <button
                        disabled={!task.ai_predictions?.ai_summary}
                        onClick={() =>
                          setActiveSummaryId(
                            activeSummaryId === task._id ? null : task._id
                          )
                        }
                        className="disabled:cursor-not-allowed"
                      >
                        <FaEye
                          className={
                            task.ai_predictions?.ai_summary
                              ? "text-[#00254D] hover:scale-110 transition-transform duration-200"
                              : "text-gray-300"
                          }
                        />
                      </button>
                      {activeSummaryId === task._id &&
                        task.ai_predictions?.ai_summary && (
                          <div className="mt-2 text-xs text-slate-600 text-left p-3 bg-slate-100 rounded-md absolute top-full right-0 w-64 z-10 shadow-lg border border-gray-200">
                            {task.ai_predictions.ai_summary}
                          </div>
                        )}
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-[#E6E9E8] text-[#0B2545] font-semibold">
                    <Link
                      to={`/dashboard/insights/google-details/${task._id}`}
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

        {/* Mobile */}
        <div className="md:hidden space-y-4">
          {projectData.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-xl shadow-md p-4 border border-[#E6E9E8]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg">
                    {task.source_data.Project}
                  </p>
                  <p className="text-sm text-gray-500">
                    {task.source_data.Portfolio}
                  </p>
                </div>
                <Link
                  to={`/dashboard/insights/google-details/${task._id}`}
                  className="text-sm font-semibold text-[#006685] hover:underline"
                >
                  Detail View
                </Link>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Vendor</span>
                  <span className="font-medium">{task.source_data.Vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Project Manager</span>
                  <span className="font-medium">
                    {task.source_data["Project Manager"]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contract ID</span>
                  <span className="font-medium">
                    {task.source_data["Contract ID"]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Burnout Risk</span>
                  <span className="font-medium">
                    {task.ai_predictions?.Burnout_Risk || 0}%
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E6E9E8]">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">AI Summary</span>
                  <FaEye
                    className="text-[#00254D] cursor-pointer"
                    onClick={() =>
                      setActiveSummaryId(
                        activeSummaryId === task._id ? null : task._id
                      )
                    }
                  />
                </div>
                {activeSummaryId === task._id && (
                  <p className="mt-2 text-sm text-slate-700 bg-slate-100 p-3 rounded-md">
                    {task.ai_predictions?.Issues}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleSummaryPageById;
