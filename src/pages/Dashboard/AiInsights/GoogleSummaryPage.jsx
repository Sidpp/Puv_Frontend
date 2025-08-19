import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { FaEye } from "react-icons/fa";
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

// --- Mock Components for Standalone Execution ---

// A self-contained, reusable DoughnutChart component with custom labels
const DoughnutChart = ({ data }) => {
  const COLORS = ["#84cc16", "#60a5fa", "#facc15", "#ef4444"]; // Updated colors to match image

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
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
          fill="#8884d8"
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

// --- Main Responsive Component ---

const GoogleSummaryPage = () => {
  // Using useState for local state management instead of Redux for this standalone example
  const [projectData, setProjectData] = useState(null);
  const [activeSummaryId, setActiveSummaryId] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [activeSummary, setActiveSummary] = useState(null); // To track which summary is open

  // Dummy data for tasks and financials
  const tasks = [
    {
      id: 1,
      program: "Alpha",
      portfolio: "Growth",
      vendor: "Vendor X",
      projectmanager: "Cheryl28",
      contractid: "C-344",
      burnoutrisk: "70.98",
      aisummary:
        "Project Alpha is at high risk due to resource constraints and dependency conflicts.",
    },
    {
      id: 2,
      program: "Beta",
      portfolio: "Innovation",
      vendor: "Vendor Y",
      projectmanager: "JohnD45",
      contractid: "C-345",
      burnoutrisk: "45.50",
      aisummary:
        "Project Beta is on track but requires monitoring of team activity.",
    },
    {
      id: 3,
      program: "Gamma",
      portfolio: "Core",
      vendor: "Vendor Z",
      projectmanager: "JaneS12",
      contractid: "C-346",
      burnoutrisk: "20.15",
      aisummary: "Project Gamma is performing well with low burnout risk.",
    },
    {
      id: 4,
      program: "Delta",
      portfolio: "Growth",
      vendor: "Vendor X",
      projectmanager: "Cheryl28",
      contractid: "C-347",
      burnoutrisk: "85.20",
      aisummary:
        "Critical burnout risk detected for Project Delta. Immediate action recommended.",
    },
    {
      id: 5,
      program: "Epsilon",
      portfolio: "Maintenance",
      vendor: "Vendor Y",
      projectmanager: "JohnD45",
      contractid: "C-348",
      burnoutrisk: "33.75",
      aisummary: "Epsilon project is stable with moderate team activity.",
    },
  ];

  const monthlyFinancials = [
    { month: "Jan", planned: 4000, forecast: 3500, actual: 3000 },
    { month: "Feb", planned: 4200, forecast: 4000, actual: 3800 },
    { month: "Mar", planned: 4500, forecast: 4200, actual: 3900 },
    { month: "Apr", planned: 4600, forecast: 4300, actual: 4100 },
    { month: "May", planned: 4800, forecast: 4700, actual: 4500 },
    { month: "Jun", planned: 5000, forecast: 4900, actual: 4800 },
  ];

  const spendData = [
    { name: "Planned Cost", value: 42, color: "#84cc16" },
    { name: "Forcasted Cost", value: 30, color: "#60a5fa" },
    { name: "Actual Cost", value: 20, color: "#facc15" },
    { name: "Forecast Deviation", value: 10, color: "#ef4444" },
  ];

  // Simulate fetching data
  useEffect(() => {
    setStatus("loading");
    setTimeout(() => {
      setProjectData({
        name: "Google AI Summary",
        monthlyFinancials: monthlyFinancials,
      });
      setStatus("succeeded");
    }, 1000);
  }, []);

  if (status === "loading" || status === "idle") {
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
          className="text-blue-600 hover:underline mt-4 inline-flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!projectData) {
    return <div className="p-6 text-center">No project data available.</div>;
  }

  return (
    <div className="text-[#0B2545] bg-slate-50 min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        {projectData.name || "Project Summary"}
      </h1>

      {/* RESPONSIVENESS FIX: Changed grid to be 2 columns on medium screens and up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col">
          <h4 className="text-lg font-semibold mb-4">Monthly Financials</h4>
          <div className="w-full flex-grow h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectData.monthlyFinancials}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                barCategoryGap="30%"
              >
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar
                  dataKey="actual"
                  stackId="a"
                  fill="#00254b"
                  name="Actual"
                />
                <Bar
                  dataKey="planned"
                  stackId="a"
                  fill="#0a8e96"
                  name="Planned"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doughnut Chart + Spend List */}
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col">
          <h4 className="text-lg font-semibold mb-4">Spend Analysis</h4>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 ">
            <div className="w-full sm:w-1/2 h-[240px]">
              <DoughnutChart data={spendData} />
            </div>
            <ul className="text-sm space-y-3 w-full sm:w-1/2">
              {spendData.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="font-medium">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* --- RESPONSIVE TABLE --- */}
      <div className="mt-8">
        {/* Desktop Table (hidden on small screens) */}
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
              {tasks.map((task, index) => (
                <tr
                  key={task.id}
                  className={`h-[72px] ${
                    index % 2 === 0 ? "bg-white" : "bg-[#F9FBFA]"
                  }`}
                >
                  <td className="py-4 px-6 border-b border-[#E6E9E8] text-gray-600">
                    {task.program}
                  </td>
                  <td className="py-4 px-6 border-b border-[#E6E9E8]">
                    {task.portfolio}
                  </td>
                  <td className="py-4 px-6 border-b border-[#E6E9E8]">
                    {task.vendor}
                  </td>
                  <td className="py-4 px-6 border-b border-[#E6E9E8] text-gray-600">
                    {task.projectmanager}
                  </td>
                  <td className="py-4 px-6 border-b border-[#E6E9E8]">
                    {task.contractid}
                  </td>
                  <td className="py-4 px-6 border-b border-[#E6E9E8] text-center">
                    {task.burnoutrisk}
                  </td>
                  <td className="py-4 px-6 border-b border-[#E6E9E8] text-center">
                    {/* FIX: Eye icon is always visible. It is disabled if no summary exists. */}
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
                      to={`/dashboard/insights/google-details/${task.id}`}
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

        {/* Mobile Card List (visible on small screens) */}
        <div className="md:hidden space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-md p-4 border border-[#E6E9E8]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg">{task.program}</p>
                  <p className="text-sm text-gray-500">{task.portfolio}</p>
                </div>
                <Link
                  to="/dashboard/insights/google-details/1"
                  className="text-sm font-semibold text-[#006685] hover:underline"
                >
                  Detail View
                </Link>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Vendor</span>
                  <span className="font-medium">{task.vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Project Manager</span>
                  <span className="font-medium">{task.projectmanager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contract ID</span>
                  <span className="font-medium">{task.contractid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Burnout Risk</span>
                  <span className="font-medium">{task.burnoutrisk}%</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E6E9E8]">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">AI Summary</span>
                  <FaEye
                    className="text-[#00254D] cursor-pointer"
                    onClick={() =>
                      setActiveSummary(
                        activeSummary === task.id ? null : task.id
                      )
                    }
                  />
                </div>
                {activeSummary === task.id && (
                  <p className="mt-2 text-sm text-slate-700 bg-slate-100 p-3 rounded-md">
                    {task.aisummary}
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

export default GoogleSummaryPage;
