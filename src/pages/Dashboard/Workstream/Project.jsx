import React, { useState, useMemo } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

const ITEMS_PER_PAGE = 6;
const MAX_HOUR_SPEND = 200;

const statsData = [
  {
    title: "TechFlow Mobile Banking",
    value: 1,
    borderColor: "border-l-blue-500",
    valueColor: "text-blue-500",
  },
  {
    title: "MedCenter EHR Implementation",
    value: 2,
    borderColor: "border-l-red-500",
    valueColor: "text-red-500",
  },
  {
    title: "FlexTech Supply Chain Optimization",
    value: 2,
    borderColor: "border-l-yellow-400",
    valueColor: "text-yellow-400",
  },
  {
    title: "TechFlow AI Enhancement",
    value: 1,
    borderColor: "border-l-green-500",
    valueColor: "text-green-500",
   },
  // {
  //   title: "MedCenter AI Integration",
  //   value: 6,
  //   borderColor: "border-l-teal-500",
  //   valueColor: "text-teal-500",
  // },
  //   {
  //   title: "FlexTech AI Coordination",
  //   value: 1,
  //   borderColor: "border-l-green-500",
  //   valueColor: "text-green-500",
  // },
  // {
  //   title: "Global Cloud Transformation",
  //   value: 6,
  //   borderColor: "border-l-teal-500",
  //   valueColor: "text-teal-500",
  // },
  //   {
  //   title: "Customer Portal Redesign",
  //   value: 6,
  //   borderColor: "border-l-teal-500",
  //   valueColor: "text-teal-500",
  // },
];
const chartData = [
  { name: "Q1 2025", planned: 2005000, actual: 1939250, forecast: 2107000 },
  { name: "Q2 2025", planned: 19009877, actual: 8288756, forecast: 20085784 },
  { name: "Q3 2025", planned: 1236987, actual: 8328856, forecast: 10658784 },
];

const projectsData = [
  { id: 'CNT-2024-002', portfolio: 'Financial Services', project: 'TechFlow Mobile Banking', status: 'Green', updateDate: '7/1/2024', hourSpend: 58, burnoutRisk: 25, milestone: 'Completed' },
  { id: 'CNT-2024-003', portfolio: 'Medical Systems', project: 'MedCenter EHR Implementation', status: 'Red', updateDate: '7/2/2024', hourSpend: 87, burnoutRisk: 70, milestone: 'Delayed' },
  { id: 'CNT-2024-004', portfolio: 'Medical Systems', project: 'MedCenter EHR Implementation', status: 'Amber', updateDate: '7/3/2024', hourSpend: 66, burnoutRisk: 50, milestone: 'On Track' },
  { id: 'CNT-2024-005', portfolio: 'Supply Chain', project: 'FlexTech Supply Chain Optimization', status: 'Red', updateDate: '7/4/2024', hourSpend: 92, burnoutRisk: 75, milestone: 'Delayed' },
  { id: 'CNT-2024-006', portfolio: 'Supply Chain', project: 'FlexTech Supply Chain Optimization', status: 'Amber', updateDate: '7/5/2024', hourSpend: 71, burnoutRisk: 55, milestone: 'On Track' },
  { id: 'CNT-2024-007', portfolio: 'Financial Services', project: 'TechFlow AI Enhancement', status: 'Green', updateDate: '7/6/2024', hourSpend: 49, burnoutRisk: 30, milestone: 'Completed' },
  { id: 'CNT-2024-008', portfolio: 'Medical Systems', project: 'MedCenter AI Integration', status: 'Green', updateDate: '7/7/2024', hourSpend: 60, burnoutRisk: 35, milestone: 'Completed' },
  { id: 'CNT-2024-009', portfolio: 'Supply Chain', project: 'FlexTech AI Coordination', status: 'Green', updateDate: '7/8/2024', hourSpend: 52, burnoutRisk: 28, milestone: 'Completed' },
  { id: 'CNT-2024-010', portfolio: 'Cloud Migration', project: 'Global Cloud Transformation', status: 'Green', updateDate: '7/9/2024', hourSpend: 77, burnoutRisk: 20, milestone: 'Completed' },
  { id: 'CNT-2024-011', portfolio: 'Cloud Migration', project: 'Global Cloud Transformation', status: 'Amber', updateDate: '7/10/2024', hourSpend: 68, burnoutRisk: 45, milestone: 'On Track' },
  { id: 'CNT-2024-012', portfolio: 'Customer Experience', project: 'Customer Portal Redesign', status: 'Green', updateDate: '7/11/2024', hourSpend: 55, burnoutRisk: 30, milestone: 'Completed' }
];



const StatCard = React.memo(({ title, value, borderColor, valueColor }) => (
  <div
    className={`bg-[#f3f7f6] p-4 rounded-lg shadow-sm flex justify-between items-center border-l-4 ${borderColor}`}
  >
    <p className="text-gray-600 font-semibold">{title}</p>
    <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
  </div>
));

const ProgressBar = React.memo(({ value }) => {
  const getStatusProps = (status) => {
    switch (status) {
      case "Red":
        return { color: "bg-red-500", width: "30%" };
      case "Yellow":
        return { color: "bg-yellow-500", width: "60%" };
      case "Green":
        return { color: "bg-green-500", width: "100%" };
      default:
        return { color: "bg-amber-400", width: "60%" };
    }
  };

  const { color, width } = getStatusProps(value);

  return (
    <div
      className="w-full bg-gray-200 rounded-full h-2.5"
      role="progressbar"
      aria-valuenow={parseInt(width)}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div className={`${color} h-2.5 rounded-full`} style={{ width }}></div>
    </div>
  );
});

const BurnoutRiskIndicator = React.memo(({ value }) => {
  const getRiskColor = (val) =>
    val > 75 ? "text-red-500" : val > 50 ? "text-orange-500" : "text-green-500";
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 relative">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
            fill="none"
            className="stroke-current text-gray-200"
            strokeWidth="4"
          />
          <path
            d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
            fill="none"
            className={`stroke-current ${getRiskColor(value)}`}
            strokeWidth="4"
            strokeDasharray={`${value}, 100`}
          />
        </svg>
      </div>
      <span className="text-sm font-medium text-gray-600">{value}%</span>
    </div>
  );
});

const MilestoneStatus = React.memo(({ status }) => {
  const statusStyles = {
    Completed: "bg-green-100 text-green-800",
    "On Track": "bg-blue-100 text-blue-800",
    Delayed: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
});

const HourSpendBar = React.memo(({ hours }) => (
  <div
    className="w-24 bg-blue-100 rounded-md p-1"
    title={`${hours} hours spent`}
  >
    <div
      className="bg-blue-500 h-2 rounded-md"
      style={{ width: `${Math.min((hours / MAX_HOUR_SPEND) * 100, 100)}%` }}
    ></div>
    <span className="text-xs text-blue-800 font-semibold ml-1">{hours}</span>
  </div>
));

const PortfolioChart = () => (
  <div className="bg-[#f3f7f6] p-4 sm:p-6 rounded-lg shadow-sm h-full">
    <h3 className="font-semibold text-lg text-gray-800 mb-4">
      Planned vs Actual Forecast
    </h3>
    {/* This wrapper makes the chart horizontally scrollable on small screens, which is acceptable for complex charts. */}
    <div className="overflow-x-auto">
      <div className="h-[300px] min-w-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              tick={{ fontSize: 12 }}
              domain={[0, "dataMax + 1000000"]}
            />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(value)
              }
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="square"
              wrapperStyle={{ paddingBottom: "20px" }}
            />
            <Bar
              dataKey="actual"
              name="Actual Cost"
              fill="#3b82f6"
              barSize={30}
            />
            <Bar
              dataKey="planned"
              name="Planned Cost"
              fill="#1e293b"
              barSize={30}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Forecasted Cost"
              stroke="#2dd4bf"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const ProjectsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(projectsData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return projectsData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage]);

  const ProjectCard = ({ item }) => (
    <div className="bg-[#f3f7f6] rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-gray-800">{item.project}</p>
          <p className="text-sm text-gray-500">
            {item.id} &bull; {item.portfolio}
          </p>
        </div>
        <MilestoneStatus status={item.milestone} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">Project Status</p>
        <ProgressBar value={item.status} />
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-medium text-gray-500">Burnout Risk</p>
          <BurnoutRiskIndicator value={item.burnoutRisk} />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">Hour Spend</p>
          <HourSpendBar hours={item.hourSpend} />
        </div>
      </div>
      <p className="text-xs text-gray-400 text-right">
        Last updated: {item.updateDate}
      </p>
    </div>
  );

  return (
    <div className="bg-transparent mt-6">
      <div className="md:hidden space-y-4">
        {paginatedData.map((item) => (
          <ProjectCard key={item.id} item={item} />
        ))}
      </div>
      <div className="hidden bg-[#f3f7f6] md:block  p-4 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            <caption className="sr-only">
              List of Projects and their status
            </caption>
            <thead className="text-xs rounded-md text-gray-800 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Contract ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Portfolio
                </th>
                <th scope="col" className="px-6 py-3">
                  Project
                </th>
                <th scope="col" className="px-6 py-3">
                  Project Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Hour Spend
                </th>
                <th scope="col" className="px-6 py-3">
                  Burnout Risk
                </th>
                <th scope="col" className="px-6 py-3">
                  Milestone
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id} className=" border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4">{item.portfolio}</td>
                  <td className="px-6 py-4">{item.project}</td>
                  <td className="px-6 py-4">
                    <ProgressBar value={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    <HourSpendBar hours={item.hourSpend} />
                  </td>
                  <td className="px-6 py-4">
                    <BurnoutRiskIndicator value={item.burnoutRisk} />
                  </td>
                  <td className="px-6 py-4">
                    <MilestoneStatus status={item.milestone} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap justify-center sm:justify-end items-center mt-4 text-sm gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt;
        </button>
        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num + 1}
            onClick={() => setCurrentPage(num + 1)}
            aria-label={`Go to page ${num + 1}`}
            className={`px-3 py-1 rounded-md ${
              currentPage === num + 1
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {num + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
//----------------------------------------------------------------------
const Project = () => (
  <div className=" p-4 sm:p-6 lg:p-8 min-h-screen font-sans">
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* The stats cards use a responsive grid that adjusts columns automatically. */}
        <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
          {statsData.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
        <div className="lg:col-span-3">
          <PortfolioChart />
        </div>
      </div>
      <ProjectsTable />
    </main>
  </div>
);
export default Project;
