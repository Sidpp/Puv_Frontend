import React, { useEffect, useState } from "react";
import {
  CheckSquare,
  Users,
  GitPullRequestArrow,
  Flame,
  ChevronDown,
} from "lucide-react";
import { AlertTriangle, Clock } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/Dashboard/Home/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/Dashboard/Home/Card";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllGoogleDetails,
  getAssignGoogleDetails,
  getGoogleSheetById,
} from "../../../services/oprations/googleAPI";
import {
  getAllJiraIssues,
  getAssignJiraIssues,
  getJiraAllIssuesByAssign,
  getJiraIssueById,
} from "../../../services/oprations/jiraAPI";

const BudgetUtilizationView = ({ data }) => {
  const utilization =
    data.contractTargetPrice > 0
      ? ((data.actualContractSpend / data.contractTargetPrice) * 100).toFixed(1)
      : 0;

  return (
    <Card className="bg-[#f3f7f6] h-[430px] flex flex-col">
      <CardHeader>
        <CardTitle>Budget Utilization %</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <div className="grid grid-cols-2 gap-4">
          <DataBox
            label="Contract Target Price"
            value={`$${data.contractTargetPrice.toLocaleString()}`}
          />
          <DataBox
            label="Actual Contract Spend"
            value={`$${data.actualContractSpend.toLocaleString()}`}
          />
        </div>
        <SummaryBanner label="Budget Utilization %" value={`${utilization}%`} />
      </CardContent>
    </Card>
  );
};

const CostToCompleteForecastView = ({ data }) => {
  const costToComplete = data.forecastedCost - data.actualCost;

  return (
    <Card className="bg-[#f3f7f6] h-[430px] flex flex-col">
      <CardHeader>
        <CardTitle>Cost to Complete Forecast</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <div className="grid grid-cols-2 gap-4">
          <DataBox
            label="Forecasted Cost"
            value={`$${data.forecastedCost.toLocaleString()}`}
          />
          <DataBox
            label="Actual Cost"
            value={`$${data.actualCost.toLocaleString()}`}
          />
        </div>
        <SummaryBanner
          label="Cost to Complete"
          value={`$${costToComplete.toLocaleString()}`}
        />
      </CardContent>
    </Card>
  );
};

const VarianceByProjectView = ({ data }) => (
  <Card className="bg-[#f3f7f6] h-[430px] flex flex-col">
    <CardHeader>
      <CardTitle>Variance by Project and Program</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col flex-grow gap-4">
      <div className="grid grid-cols-2 gap-4">
        <DataBox
          label="Forecasted Deviation"
          value={`$${data.forecastDeviation.toLocaleString()}`}
        />
        <DataBox
          label="Variance at Completion"
          value={`$${data.varianceAtCompletion.toLocaleString()}`}
        />
      </div>
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex-grow">
        <h4 className="font-semibold text-slate-700 mb-2">AI Summary</h4>
        <p className="text-sm text-slate-600">
          {/* TODO: Insert AI-generated text if available */}
          Aggregated variance analysis across all projects.
        </p>
      </div>
    </CardContent>
  </Card>
);

const DataBox = ({ label, value, className = "" }) => (
  <div
    className={`bg-white border border-slate-200 rounded-lg p-2 md:p-4 text-center flex flex-col justify-center h-full ${className}`}
  >
    <div className="text-xs md:text-sm font-semibold text-slate-600 mb-2">
      {label}
    </div>
    <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 break-words">
      {value}
    </div>
  </div>
);

const SummaryBanner = ({ label, value, valueColor = "text-[#006685]" }) => (
  <div className="bg-gray-200 rounded-lg p-3 md:p-4 flex justify-between items-center mt-auto">
    <div className="text-sm md:text-md font-semibold text-slate-700 text-left">
      {label}
    </div>
    <div className={`text-xl md:text-xl  ${valueColor}`}>{value}</div>
  </div>
);

const VendorContractOverviewView = ({ data }) => (
  <Card className="bg-[#f3f7f6] h-[430px] flex flex-col">
    <CardHeader>
      <CardTitle>Vendor Contract Overview + Variance at Completion</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col flex-grow">
      <div className="bg-white border rounded-lg p-4 text-xs md:text-sm">
        <div className="space-y-2 mt-2">
          <div className="flex justify-between border-b pb-1">
            <span className="text-slate-600">Contract Ceiling Price</span>
            <span className="font-medium text-slate-800">
              ${data.contractCeilingPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span className="text-slate-600">Contract Target Price</span>
            <span className="font-medium text-slate-800">
              ${data.contractTargetPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span className="text-slate-600">Actual Contract Spend</span>
            <span className="font-medium text-slate-800">
              ${data.actualContractSpend.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <SummaryBanner
        label="Variance at Completion"
        value={`$${data.varianceAtCompletion.toLocaleString()}`}
        valueColor="text-red-600"
      />
    </CardContent>
  </Card>
);

const BurnRateAnalysisView = ({ data }) => (
  <Card className="bg-[#f3f7f6] h-[430px] flex flex-col">
    <CardHeader>
      <CardTitle>Burn Rate Analysis</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col flex-grow">
      <div className="grid grid-cols-2 gap-4">
        <DataBox
          label="Planned Cost"
          value={`$${data.plannedCost.toLocaleString()}`}
        />
        <DataBox
          label="Actual Cost"
          value={`$${data.actualCost.toLocaleString()}`}
        />
      </div>
      <SummaryBanner
        label="Forecasted Cost"
        value={`$${data.forecastedCost.toLocaleString()}`}
      />
    </CardContent>
  </Card>
);

const SpendAndAccrualsView = ({ data }) => (
  <Card className="bg-[#f3f7f6] h-[430px] flex flex-col">
    <CardHeader>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <CardTitle>Spend and Accruals</CardTitle>
        <span className="text-xs text-slate-500 flex-shrink-0">
          Update Date: {data.updateDate || "-"}
        </span>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col flex-grow">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="w-full sm:w-[calc(50%-0.5rem)]">
          <DataBox
            label="Actual Cost"
            value={`$${data.actualCost.toLocaleString()}`}
          />
        </div>
        <div className="w-full sm:w-[calc(50%-0.5rem)]">
          <DataBox
            label="Forecasted Cost"
            value={`$${data.forecastedCost.toLocaleString()}`}
          />
        </div>
        <div className="w-full sm:w-[calc(50%-0.5rem)]">
          <DataBox
            label="Planned Cost"
            value={`$${data.plannedCost.toLocaleString()}`}
          />
        </div>
      </div>
      <SummaryBanner
        label="Forecasted Deviation"
        value={`$${data.forecastDeviation.toLocaleString()}`}
      />
    </CardContent>
  </Card>
);

//New function
function mapJiraStatus(status) {
  if (!status) return "";
  switch (status) {
    case "Done":
      return "Completed";
    case "To Do":
      return "Delayed";
    case "In Progress":
      return "In Progress";
    default:
      return status;
  }
}

function getPortfolioStatusData(source, googleData = [], jiraData = []) {
  let delayed = 0;
  let completed = 0;
  let inProgress = 0;

  const statusBuckets = {
    Delayed: [],
    Completed: [],
    "In Progress": [],
  };

  if (source === "Google") {
    googleData.forEach((project) => {
      const status = project.ai_predictions?.["Milestone_Status"];
      if (status === "Delayed") {
        delayed++;
        statusBuckets.Delayed.push(project._id);
      } else if (status === "Completed") {
        completed++;
        statusBuckets.Completed.push(project._id);
      } else if (status === "In Progress") {
        inProgress++;
        statusBuckets["In Progress"].push(project._id);
      }
    });

    const total = googleData.length || 1;
    return [
      {
        name: "Delayed",
        value: Math.round((delayed / total) * 100),
        barColor: "#ef4444",
        ids: statusBuckets.Delayed,
      },
      {
        name: "Completed",
        value: Math.round((completed / total) * 100),
        barColor: "#3b82f6",
        ids: statusBuckets.Completed,
      },
      {
        name: "In Progress",
        value: Math.round((inProgress / total) * 100),
        barColor: "#f59e0b",
        ids: statusBuckets["In Progress"],
      },
    ];
  } else {
    const jiraStatusMap = {
      Done: "Completed",
      "To Do": "Delayed",
      "In Progress": "In Progress",
    };

    // Group Jira issues by project
    const groupedProjects = groupByJiraProject(jiraData);

    groupedProjects.forEach((project) => {
      // Count issue statuses for this project
      const issueStatuses = project.ids.map((id) => {
        const issue = jiraData.find((i) => i._id === id);
        return jiraStatusMap[issue.status] || "In Progress";
      });

      const counts = issueStatuses.reduce(
        (acc, status) => {
          if (status === "Delayed") acc.Delayed++;
          else if (status === "Completed") acc.Completed++;
          else if (status === "In Progress") acc["In Progress"]++;
          return acc;
        },
        { Delayed: 0, Completed: 0, "In Progress": 0 }
      );

      // Determine project status based on majority
      let projectStatus = "In Progress"; // default
      if (
        counts.Delayed >= counts.Completed &&
        counts.Delayed >= counts["In Progress"]
      ) {
        projectStatus = "Delayed";
      } else if (
        counts.Completed >= counts.Delayed &&
        counts.Completed >= counts["In Progress"]
      ) {
        projectStatus = "Completed";
      }

      // Increment counters & add project ids
      if (projectStatus === "Delayed") {
        delayed++;
        statusBuckets.Delayed.push(...project.ids);
      } else if (projectStatus === "Completed") {
        completed++;
        statusBuckets.Completed.push(...project.ids);
      } else {
        inProgress++;
        statusBuckets["In Progress"].push(...project.ids);
      }
    });

    const total = groupedProjects.length || 1;
    return [
      {
        name: "Delayed",
        value: Math.round((delayed / total) * 100),
        barColor: "#ef4444",
        ids: statusBuckets.Delayed,
      },
      {
        name: "Completed",
        value: Math.round((completed / total) * 100),
        barColor: "#3b82f6",
        ids: statusBuckets.Completed,
      },
      {
        name: "In Progress",
        value: Math.round((inProgress / total) * 100),
        barColor: "#f59e0b",
        ids: statusBuckets["In Progress"],
      },
    ];
  }
}

function parseNumberSafe(value) {
  if (!value) return 0; // null, undefined, empty string
  const cleaned = value.toString().replace(/,/g, ""); // remove commas
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

function getBudgetBarsData(googleData = []) {
  if (googleData.length === 0) return [];

  let totalApprovedBudget = 0;
  let totalActualSpend = 0;

  googleData.forEach((project) => {
    const data = project.source_data || {};

    const planned = parseNumberSafe(data["Planned Cost"]);
    const actual = parseNumberSafe(data["Actual Contract Spend"]);

    //console.log("log", planned, actual);

    totalApprovedBudget += planned;
    totalActualSpend += actual;
  });

  //console.log("data", totalApprovedBudget, totalActualSpend);

  const barWidthPercent =
    totalApprovedBudget > 0
      ? Math.min((totalActualSpend / totalApprovedBudget) * 100, 100)
      : 0;

  return [
    {
      label: "Approved Budget",
      value: `$${totalApprovedBudget.toLocaleString()}`,
      barWidthPercent: 100,
      barColorClass: "bg-teal-600",
    },
    {
      label: "Actual Spend",
      value: `$${totalActualSpend.toLocaleString()}`,
      barWidthPercent: Math.round(barWidthPercent),
      barColorClass: "bg-blue-500",
    },
  ];
}

function getForecastsData(googleData = []) {
  if (googleData.length === 0) return [];

  let totalDeviation = 0;
  let totalPlanned = 0;
  let totalForecasted = 0;

  googleData.forEach((project) => {
    const data = project.source_data || {};
    const ai = project.ai_predictions || {};

    // Safely parse numbers
    const planned = parseFloat(data["Planned Cost"]);
    const forecasted = parseFloat(ai["Forecasted_Cost"]);

    const safePlanned = isNaN(planned) ? 0 : planned;
    const safeForecasted = isNaN(forecasted) ? 0 : forecasted;

    totalPlanned += safePlanned;
    totalForecasted += safeForecasted;

    // Calculate deviation (use Forecast Deviation if exists)
    const deviation =
      data["Forecast Deviation"] !== undefined
        ? Number(data["Forecast Deviation"]) || 0
        : safeForecasted - safePlanned;

    totalDeviation += deviation;

    // console.log("logss", safePlanned, safeForecasted);
  });

  // Percentage deviation
  const deviationPercent =
    totalPlanned > 0 ? (totalDeviation / totalPlanned) * 100 : 0;

  //console.log("logs", deviationPercent, totalDeviation);

  return [
    {
      label: `${
        totalDeviation < 0 ? "" : "+"
      }$${totalDeviation.toLocaleString()}`,
      needleRotation: Math.max(0, Math.min(180, 90 + deviationPercent)),
      sections: [{ color: "#22c55e", percentage: 100, offset: 0 }],
      isPositive: totalDeviation >= 0,
    },
    {
      label: `${deviationPercent.toFixed(1)}%`,
      needleRotation: Math.max(0, Math.min(180, 90 + deviationPercent)),
      sections: [
        { color: "#22c55e", percentage: 50, offset: 0 },
        { color: "#facc15", percentage: 25, offset: 50 },
        { color: "#ef4444", percentage: 25, offset: 75 },
      ],
      isPositive: totalDeviation >= 0,
    },
  ];
}

function getGoogleRiskFactors(googleData = []) {
  let taskDelay = { count: 0, ids: [] };
  let teamInactivity = { count: 0, ids: [] };
  let dependencyConflict = { count: 0, ids: [] };
  let burnoutRisk = { count: 0, ids: [] };

  googleData.forEach((project) => {
    const data = project.source_data || {};
    const ai = project.ai_predictions || {};

    // ✅ Task Delay (from ai.Milestone_Status)
    if (ai["Milestone_Status"]?.toLowerCase().includes("delayed")) {
      taskDelay.count++;
      taskDelay.ids.push(project._id);
    }

    // ✅ Team Inactivity (from source_data)
    if (
      Number(data["Actual Hours"] || 0) <
      0.5 * Number(data["Allocated Hours"] || 0)
    ) {
      teamInactivity.count++;
      teamInactivity.ids.push(project._id);
    }

    // ✅ Dependency Conflict (from source_data)
    if (
      data["Dependency Type"] &&
      data["Dependency Type"].toLowerCase() !== "none"
    ) {
      dependencyConflict.count++;
      dependencyConflict.ids.push(project._id);
    }

    // ✅ Burnout Risk (from ai.Burnout_Risk)
    if (Number(ai["Burnout_Risk"] || 0) > 50) {
      burnoutRisk.count++;
      burnoutRisk.ids.push(project._id);
    }
  });

  //console.log("risk factor",taskDelay,teamInactivity,dependencyConflict,burnoutRisk)

  return [
    {
      icon: CheckSquare,
      label: "Task Delay",
      sublabel:
        taskDelay.count > 3 ? "High" : taskDelay.count > 1 ? "Moderate" : "Low",
      count: taskDelay.count,
      ids: taskDelay.ids,
      color:
        taskDelay.count > 3
          ? "text-red-500"
          : taskDelay.count > 1
          ? "text-amber-500"
          : "text-green-500",
    },
    {
      icon: Users,
      label: "Team Inactivity",
      sublabel:
        teamInactivity.count > 3
          ? "High"
          : teamInactivity.count > 1
          ? "Moderate"
          : "Low",
      count: teamInactivity.count,
      ids: teamInactivity.ids,
      color:
        teamInactivity.count > 3
          ? "text-red-500"
          : teamInactivity.count > 1
          ? "text-amber-500"
          : "text-green-500",
    },
    {
      icon: GitPullRequestArrow,
      label: "Dependency Conflict",
      sublabel:
        dependencyConflict.count > 3
          ? "Critical"
          : dependencyConflict.count > 1
          ? "Moderate"
          : "Low",
      count: dependencyConflict.count,
      ids: dependencyConflict.ids,
      color:
        dependencyConflict.count > 3
          ? "text-red-600"
          : dependencyConflict.count > 1
          ? "text-amber-500"
          : "text-green-500",
    },
    {
      icon: Flame,
      label: "Burnout Risk",
      sublabel:
        burnoutRisk.count > 3
          ? "High"
          : burnoutRisk.count > 1
          ? "Moderate"
          : "Low",
      count: burnoutRisk.count,
      ids: burnoutRisk.ids,
      color:
        burnoutRisk.count > 3
          ? "text-red-500"
          : burnoutRisk.count > 1
          ? "text-amber-500"
          : "text-green-500",
    },
  ];
}

function getJiraRiskFactors(jiraData = []) {
  let taskDelay = { count: 0, ids: [] };
  let highPriority = { count: 0, ids: [] };
  let burnoutRisk = { count: 0, ids: [] };
  let inactivity = { count: 0, ids: [] };

  jiraData.forEach((issue) => {
    if (issue.status?.toLowerCase().includes("to do")) {
      taskDelay.count++;
      taskDelay.ids.push(issue._id);
    }

    if (
      issue.priority?.toLowerCase() === "highest" ||
      Number(issue.ai_priority_score || 0) > 0.8
    ) {
      highPriority.count++;
      highPriority.ids.push(issue._id);
    }

    //  Burnout Risk (from burnout_flag)
    if (issue.burnout_flag === "true") {
      burnoutRisk.count++;
      burnoutRisk.ids.push(issue._id);
    }

    //  Inactivity (only if due_date has passed by 3+ days)
    if (issue.due_date) {
      const dueDate = new Date(issue.due_date);
      const today = new Date();

      // difference in days (positive only if overdue)
      const diffDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

      if (diffDays >= 1) {
        inactivity.count++;
        inactivity.ids.push(issue._id);
      }
    }
  });

  return [
    {
      icon: Clock,
      label: "Task Delay",
      sublabel:
        taskDelay.count > 3 ? "High" : taskDelay.count > 1 ? "Moderate" : "Low",
      count: taskDelay.count,
      ids: taskDelay.ids,
      color:
        taskDelay.count > 3
          ? "text-red-500"
          : taskDelay.count > 1
          ? "text-amber-500"
          : "text-green-500",
    },
    {
      icon: AlertTriangle,
      label: "High Priority Risks",
      sublabel:
        highPriority.count > 3
          ? "Critical"
          : highPriority.count > 1
          ? "Moderate"
          : "Low",
      count: highPriority.count,
      ids: highPriority.ids,
      color:
        highPriority.count > 3
          ? "text-red-600"
          : highPriority.count > 1
          ? "text-amber-500"
          : "text-green-500",
    },
    {
      icon: Flame,
      label: "Burnout Risk",
      sublabel:
        burnoutRisk.count > 3
          ? "High"
          : burnoutRisk.count > 1
          ? "Moderate"
          : "Low",
      count: burnoutRisk.count,
      ids: burnoutRisk.ids,
      color:
        burnoutRisk.count > 3
          ? "text-red-500"
          : burnoutRisk.count > 1
          ? "text-amber-500"
          : "text-green-500",
    },
    {
      icon: Users,
      label: "Team Inactivity",
      sublabel:
        inactivity.count > 3
          ? "High"
          : inactivity.count > 1
          ? "Moderate"
          : "Low",
      count: inactivity.count,
      ids: inactivity.ids,
      color:
        inactivity.count > 3
          ? "text-red-500"
          : inactivity.count > 1
          ? "text-amber-500"
          : "text-green-500",
    },
  ];
}

function getSlippageData(projects = []) {
  const monthMap = {};

  projects.forEach((project) => {
    const ai = project.ai_predictions || {};
    const src = project.source_data || {};

    // --- Pick month (from Contract Start Date or fallback) ---
    const rawDate = src["Contract Start Date"] || src["Contract End Date"];
    const date = rawDate ? new Date(rawDate) : null;
    const month =
      date && !isNaN(date)
        ? date.toLocaleString("default", { month: "short" })
        : "Unknown";

    // --- Planned, Actual, Forecast values ---
    const planned = Number(src["Planned Cost"] || 0);
    const actual = Number(src["Actual Cost"] || 0);
    const forecast = Number(ai.Forecasted_Cost || src["Forecasted Cost"] || 0);

    // --- Forecast Deviation ---
    let deviation = null;
    if (ai.Forecasted_Deviation !== undefined) {
      deviation = Number(ai.Forecasted_Deviation);
    } else if (forecast && planned) {
      deviation = forecast - planned;
    }

    // --- Aggregate by month ---
    if (!monthMap[month]) {
      monthMap[month] = {
        month,
        plan: 0,
        actual: 0,
        forecast: 0,
        deviation: 0,
        count: 0,
      };
    }

    monthMap[month].plan += planned;
    monthMap[month].actual += actual;
    monthMap[month].forecast += forecast;
    monthMap[month].deviation += deviation || 0;
    monthMap[month].count += 1;
  });

  // --- Average values per month across projects ---
  return Object.values(monthMap).map((m) => ({
    month: m.month,
    plan: m.count ? Math.round(m.plan / m.count) : 0,
    actual: m.count ? Math.round(m.actual / m.count) : 0,
    forecast: m.count ? Math.round(m.forecast / m.count) : 0,
    deviation: m.count ? Math.round(m.deviation / m.count) : 0,
  }));
}

function getGoogleRagPieData(googleData = []) {
  const statusCounts = {
    Red: 0,
    Yellow: 0,
    Green: 0,
  };

  googleData.forEach((project) => {
    const status = project.ai_predictions?.["Project_Status"]?.trim();
    if (status && statusCounts[status] !== undefined) {
      statusCounts[status] += 1;
    }
  });

  const labelMap = {
    Red: "High",
    Yellow: "Medium",
    Green: "Low",
  };

  const colorMap = {
    Red: "#ef4444", // Tailwind red-500
    Yellow: "#facc15", // Tailwind yellow-400
    Green: "#22c55e", // Tailwind green-500
  };

  return Object.keys(statusCounts).map((key) => ({
    name: `Open Issues (${statusCounts[key]} - ${labelMap[key]})`,
    value: statusCounts[key],
    fill: colorMap[key],
  }));
}

function getJiraRagPieData(jiraData = []) {
  const statusCounts = {
    Red: 0,
    Yellow: 0,
    Green: 0,
  };

  jiraData.forEach((issue) => {
    const status = issue.status?.trim();

    if (status === "Done") {
      statusCounts.Green += 1;
    } else if (status === "To Do") {
      statusCounts.Red += 1;
    } else if (status === "In Progress") {
      statusCounts.Yellow += 1;
    }
  });

  const labelMap = {
    Red: "High",
    Yellow: "Medium",
    Green: "Low",
  };

  const colorMap = {
    Red: "#ef4444", // Tailwind red-500
    Yellow: "#facc15", // Tailwind yellow-400
    Green: "#22c55e", // Tailwind green-500
  };

  return Object.keys(statusCounts).map((key) => ({
    name: `Open Issues (${statusCounts[key]} - ${labelMap[key]})`,
    value: statusCounts[key],
    fill: colorMap[key],
  }));
}

const aggregateFinancials = (projects) => {
  return projects.reduce(
    (acc, p) => {
      const s = p.source_data || {};
      const a = p.ai_predictions || {};

      acc.contractTargetPrice += Number(s["Contract Target Price"]) || 0;
      acc.actualContractSpend += Number(s["Actual Contract Spend"]) || 0;
      acc.contractCeilingPrice += Number(s["Contract Ceiling Price"]) || 0;

      acc.forecastedCost += Number(a["Forecasted_Cost"]) || 0;
      acc.actualCost += Number(s["Actual Cost"]) || 0;
      acc.plannedCost += Number(s["Planned Cost"]) || 0;

      acc.forecastDeviation +=
        Number(s["Forecast Deviation"]) || Number(a.Forecasted_Deviation) || 0;

      acc.varianceAtCompletion += Number(a["Variance_At_Completion"]) || 0;

      // latest update date
      const updateDate = s["Update Date"];
      if (
        updateDate &&
        (!acc.updateDate || new Date(updateDate) > new Date(acc.updateDate))
      ) {
        acc.updateDate = updateDate;
      }

      return acc;
    },
    {
      contractTargetPrice: 0,
      actualContractSpend: 0,
      contractCeilingPrice: 0,
      forecastedCost: 0,
      actualCost: 0,
      plannedCost: 0,
      forecastDeviation: 0,
      varianceAtCompletion: 0,
      updateDate: null,
    }
  );
};

const groupByJiraProject = (data) => {
  const grouped = {};

  data.forEach((item) => {
    const projectName = item.project_name || "Unknown";

    if (!grouped[projectName]) {
      grouped[projectName] = {
        project_name: projectName,
        ai_delay_scores: [],
        ai_summaries: [],
        ai_delay_labels: [],
        ai_priority_scores: [],
        ids: [],
      };
    }

    // Collect fields
    if (item.ai_delay_score !== undefined) {
      grouped[projectName].ai_delay_scores.push(item.ai_delay_score);
    }
    if (item.ai_summary !== undefined) {
      grouped[projectName].ai_summaries.push(item.ai_summary);
    }
    if (item.ai_delay_label !== undefined) {
      grouped[projectName].ai_delay_labels.push(item.ai_delay_label);
    }
    if (item.ai_priority_score !== undefined) {
      grouped[projectName].ai_priority_scores.push(item.ai_priority_score);
    }
    if (item._id) {
      grouped[projectName].ids.push(item._id);
    }
  });

  // Convert to array & compute averages for numeric fields + most common label
  return Object.values(grouped).map((proj) => {
    // --- Average scores ---
    const avg_delay_score =
      proj.ai_delay_scores.length > 0
        ? proj.ai_delay_scores.reduce((a, b) => a + b, 0) /
          proj.ai_delay_scores.length
        : null;

    const avg_priority_score =
      proj.ai_priority_scores.length > 0
        ? proj.ai_priority_scores.reduce((a, b) => a + b, 0) /
          proj.ai_priority_scores.length
        : null;

    // --- Most frequent delay label ---
    let avg_delay_label = null;
    if (proj.ai_delay_labels.length > 0) {
      const counts = proj.ai_delay_labels.reduce((acc, label) => {
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {});

      // pick the label with max count
      avg_delay_label = Object.entries(counts).sort(
        (a, b) => b[1] - a[1]
      )[0][0];
    }

    return {
      ...proj,
      avg_delay_score,
      avg_priority_score,
      avg_delay_label,
    };
  });
};

function calculateConfidence(doc) {
  let score = 1.0; // start at 100%

  // If Project_Status is Red → reduce confidence
  if (doc.Project_Status === "Red") score -= 0.3;
  if (doc.Project_Status === "Yellow") score -= 0.15;

  // Burnout_Risk: higher means lower confidence in success
  score -= (doc.Burnout_Risk / 100) * 0.2;

  // Variance at completion very negative → reduce confidence
  if (doc.Variance_At_Completion < 0) {
    score -= Math.min(Math.abs(doc.Variance_At_Completion) / 10_000_000, 0.3);
  }

  // Deviation > 0 → reduce confidence
  if (doc.Forecasted_Deviation > 0) {
    score -= Math.min(doc.Forecasted_Deviation / 100_000, 0.2);
  }

  // Keep score between 0–1
  return Math.max(0, Math.min(1, score));
}

// --- Main Dashboard Component ---

const Home = () => {
  const [portfolioSource, setPortfolioSource] = useState("Google");
  const [isPortfolioDropdownOpen, setIsPortfolioDropdownOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState("Project A");
  const [aiSource, setAiSource] = useState("Google");
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);

  const [googleData, setGoogleData] = useState([]);
  const [jiraData, setJiraData] = useState([]);
  const [financialData, setFinancialData] = useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);

  // useEffect(() => {
  //   const fetchGoogle = async () => {
  //     if (user?.projectrole === "Team Leader") {
  //       try {
  //         const ids = user?.assignGoogleProjects || [];
  //         let allData = [];

  //         for (const id of ids) {
  //           const res = await dispatch(getGoogleSheetById(id));
  //           if (res) {
  //             allData.push(res);
  //           }
  //           //console.log("allData", allData);
  //         }

  //         setGoogleData(allData);
  //       } catch (error) {
  //         // .error("Failed to fetch Google data:", error);
  //       }
  //     } else {
  //       try {
  //         const res = await dispatch(getAllGoogleDetails());
  //         setGoogleData(Array.isArray(res) ? res : []);
  //       } catch (error) {
  //         //console.error("Failed to fetch Google data:", error);
  //       }
  //     }
  //   };

  //   fetchGoogle();
  //   //console.log("GoogleData", googleData);
  // }, [dispatch, user]);

  // useEffect(() => {
  //   const fetchJira = async () => {
  //     if (user?.projectrole === "Team Leader") {
  //       try {
  //         const ids = user?.assignJiraProjects || [];
  //         let allData = [];

  //         for (const id of ids) {
  //           const res = await dispatch(getJiraIssueById(id));
  //           if (res) {
  //             allData.push(res);
  //           }
  //          // console.log("allData", allData);
  //         }

  //         setJiraData(allData);
  //       } catch (error) {
  //        // console.error("Failed to fetch Jira issues:", error);
  //       }
  //     } else {
  //       try {
  //         const issues = await dispatch(getAllJiraIssues());
  //         setJiraData(Array.isArray(issues) ? issues : []);
  //       } catch (error) {
  //         //console.error("Failed to fetch Jira issues:", error);
  //         setJiraData([]);
  //       }
  //     }
  //   };

  //   fetchJira();
  // }, [dispatch, user]);

  useEffect(() => {
    const fetchGoogle = async () => {
      // setLoadingGoogle(true);
      try {
        if (
          ["Portfolio Manager", "Project Manager", "Program Manager"].includes(
            user?.projectrole
          )
        ) {
          const assignSheet = await dispatch(
            getAssignGoogleDetails(user?.googleProjectAuthor)
          );
          //  console.log("sheet",assignSheet)

          const roleKey = user?.projectrole?.trim();
          // console.log("role",roleKey)
          // console.log("name",user?.name)

          const filteredData = assignSheet.filter(
            (proj) => proj?.source_data?.[roleKey] === user?.name
          );
          setGoogleData(filteredData);
          //console.log("google data", filteredData);
        } else {
          const allProjects = await dispatch(getAllGoogleDetails());
          if (!Array.isArray(allProjects)) {
            setGoogleData([]);
            return;
          }
          setGoogleData(allProjects);
        }
      } catch (err) {
        // console.error("Failed to fetch Google projects:", err);
        setGoogleData([]);
      } finally {
        //  setLoadingGoogle(false);
      }
    };

    fetchGoogle();
  }, [dispatch, user]);

  // --- Jira Fetch ---

  useEffect(() => {
    const fetchJira = async () => {
      // setLoadingJira(true);
      try {
        if (
          user?.projectrole === "Team Leader" ||
          user?.projectrole === "Project Manager"
        ) {
          const projects = user?.assignJiraProject || [];
          try {
            const results = await Promise.all(
              projects.map((proj) =>
                dispatch(getJiraAllIssuesByAssign(user?.assignJiraProject))
              )
            );

            const allData = results.flat().filter(Boolean);

            setJiraData(allData);
          } catch (error) {
            // console.error("Failed to fetch Jira issues:", error);
            setJiraData([]);
          }
        } else if (user?.projectrole === "Portfolio Manager") {
          const issues = await dispatch(
            getAssignJiraIssues(user?.jiraProjectAuthor)
          );
          // console.log("data", issues);
          setJiraData(Array.isArray(issues) ? issues : []);
        } else {
          const issues = await dispatch(getAllJiraIssues());
          setJiraData(Array.isArray(issues) ? issues : []);
        }
      } catch (error) {
        //console.error("Failed to fetch Jira issues:", error);
        setJiraData([]);
      } finally {
        // setLoadingJira(false);
      }
    };

    fetchJira();
  }, [dispatch, user]);

  //Check data
  const availableSources = [];
  if (googleData.length > 0) availableSources.push("Google");
  if (jiraData.length > 0) availableSources.push("Jira");

  useEffect(() => {
    //console.log("Google data", googleData);
    // console.log("Jira data", jiraData);
    if (availableSources.length === 1) {
      setPortfolioSource(availableSources[0]);
    }
    setFinancialData(aggregateFinancials(googleData));
  }, [googleData, jiraData]);

  const jiraProjectGroupedData = groupByJiraProject(jiraData);

  const aiAvailableSources = React.useMemo(() => {
    const sources = [];
    if (googleData?.length > 0) sources.push("Google");
    if (jiraProjectGroupedData?.length > 0) sources.push("Jira");
    return sources;
  }, [googleData, jiraProjectGroupedData]);

  useEffect(() => {
    if (aiAvailableSources.length === 1) {
      setAiSource(aiAvailableSources[0]);
    } else if (!aiSource && aiAvailableSources.length > 1) {
      setAiSource(aiAvailableSources[0]); // default to first if both exist
    }
  }, [aiAvailableSources]);

  const financialOverviewItems = [
    "Budget Utilization %",
    "Cost to complete Forecast",
    "Variance by Project and program",
    "Vendor Contract Overview",
    "Burn Rate Analysis",
    "Spend and Accruals",
  ];

  const [selectedFinancialOverview, setSelectedFinancialOverview] = useState(
    financialOverviewItems[0]
  );

  // Data for charts and tables
  const portfolioStatusData = getPortfolioStatusData(
    portfolioSource,
    googleData,
    jiraData
  );

  const budgetBarsData = getBudgetBarsData(googleData);

  const forecastsData = getForecastsData(googleData);

  const googleRiskFactors = getGoogleRiskFactors(googleData);
  const jiraRiskFactors = getJiraRiskFactors(jiraData);

  const slippageData = getSlippageData(googleData);

  const googlePieData = getGoogleRagPieData(googleData);
  const jiraPieData = getJiraRagPieData(jiraData);

  const PIE_COLORS = ["#ef4444", "#facc15", "#22c55e", "#6b7280"];

  const Gauge = ({ label, needleRotation, sections, isPositive }) => {
    const radius = 40;
    const circumference = Math.PI * radius;
    const center = 50;

    return (
      <div className="flex flex-col items-center">
        <svg width="120" height="65" viewBox="0 0 100 55" className="mb-1">
          {/* Background arc */}
          <path
            d={`M ${center - radius} 50 A ${radius} ${radius} 0 0 1 ${
              center + radius
            } 50`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          {/* Sections */}
          {sections.map((section, index) => {
            const dash = (section.percentage / 100) * circumference;
            const offset = (section.offset / 100) * circumference;
            return (
              <path
                key={index}
                d={`M ${center - radius} 50 A ${radius} ${radius} 0 0 1 ${
                  center + radius
                } 50`}
                fill="none"
                stroke={section.color}
                strokeWidth="10"
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={-offset}
              />
            );
          })}
          {/* Needle */}
          <g
            style={{
              transform: `rotate(${needleRotation}deg)`,
              transformOrigin: `${center}px ${center}px`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            <path
              d={`M ${center} 50 L ${center} 15`}
              strokeWidth="2"
              stroke="black"
            />
            <circle cx={center} cy={50} r="4" fill="black" />
          </g>
        </svg>
        <span
          className={`text-sm font-bold ${
            isPositive ? "text-red-600" : "text-green-600"
          }`}
        >
          {label}
        </span>
      </div>
    );
  };

  // Renders the correct financial detail card based on state
  const renderFinancialDetailCard = () => {
    // if (!allProject) return null;
    if (!financialData) return null;

    switch (selectedFinancialOverview) {
      case "Budget Utilization %":
        return <BudgetUtilizationView data={financialData} />;
      case "Cost to complete Forecast":
        return <CostToCompleteForecastView data={financialData} />;
      case "Variance by Project and program":
        return <VarianceByProjectView data={financialData} />;

      case "Vendor Contract Overview":
        return <VendorContractOverviewView data={financialData} />;
      case "Burn Rate Analysis":
        return <BurnRateAnalysisView data={financialData} />;
      case "Spend and Accruals":
        return <SpendAndAccrualsView data={financialData} />;

      default:
        return <BudgetUtilizationView data={financialData} />;
    }
  };

  //console.log("databnn",jiraProjectGroupedData)

  return (
    <div className="flex min-h-screen font-sans">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="mb-4">
            <p className="text-xl text-[#00254D] font-bold">
              Portfolio Health Scorecard
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* --- LEFT COLUMN --- */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Projects On Track/Delayed/At Risk */}
              <Card className="bg-[#f3f7f6]">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      % of Projects On Track/Delayed/At Risk
                    </CardTitle>
                    <div className="relative">
                      {availableSources.length > 1 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-28 justify-between"
                          onClick={() =>
                            setIsPortfolioDropdownOpen(!isPortfolioDropdownOpen)
                          }
                        >
                          <span>{portfolioSource}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              isPortfolioDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      ) : (
                        <span className="text-sm font-medium">
                          {portfolioSource}
                        </span>
                      )}

                      {isPortfolioDropdownOpen &&
                        availableSources.length > 1 && (
                          <div className="absolute top-full right-0 mt-1 w-28 bg-white border rounded-md shadow-lg z-10">
                            <ul className="py-1">
                              {availableSources.map((src) => (
                                <li
                                  key={src}
                                  className="px-3 py-1 text-sm hover:bg-slate-100 cursor-pointer"
                                  onClick={() => {
                                    setPortfolioSource(src);
                                    setIsPortfolioDropdownOpen(false);
                                  }}
                                >
                                  {src}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-4">
                    {portfolioStatusData.map((item) => (
                      <div
                        key={item.name}
                        onClick={() => {
                          if (item.ids.length > 0) {
                            const joinedIds = item.ids.join(",");
                            if (portfolioSource === "Google") {
                              navigate(
                                `/dashboard/insights/google-summary/${joinedIds}`
                              );
                            } else {
                              navigate(
                                `/dashboard/insights/jira-summary/${joinedIds}`
                              );
                            }
                          }
                        }}
                        className="cursor-pointer"
                      >
                        <div
                          className="h-10 flex items-center rounded-sm px-3"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor: item.barColor,
                          }}
                        >
                          <span className="text-sm font-medium text-gray-800">
                            {item.value}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="relative h-4 mt-8">
                    {" "}
                    <div className="absolute inset-0 border-t border-gray-300 mt-2"></div>{" "}
                    <div className="absolute inset-0 flex justify-between text-xs text-gray-500">
                      {" "}
                      {[
                        "0",
                        "10",
                        "20",
                        "30",
                        "40",
                        "50",
                        "60",
                        "70",
                        "80",
                        "90",
                        "100",
                      ].map((val) => (
                        <div key={val} className="flex flex-col items-center">
                          {" "}
                          <span className="h-1 w-px bg-gray-300"></span>{" "}
                          <span>{val}</span>{" "}
                        </div>
                      ))}{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-12 md:gap-24 text-sm text-gray-600 mt-6">
                    {" "}
                    {portfolioStatusData.map((item) => (
                      <div key={item.name} className="flex items-center">
                        {" "}
                        <span
                          className="w-3 h-3 rounded-sm mr-2"
                          style={{ backgroundColor: item.barColor }}
                        ></span>{" "}
                        <span>{item.name}</span>{" "}
                      </div>
                    ))}{" "}
                  </div>{" "}
                </CardContent>
              </Card>

              {/* AI Predicted Portfolio Risk Score */}
              <Card className="flex flex-col bg-[#f3f7f6] w-full max-w-4xl mx-auto h-[640px]">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>AI Predicted Portfolio Risk Score</CardTitle>
                    <div className="relative">
                      {aiAvailableSources.length > 1 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-28 justify-between"
                          onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
                        >
                          <span>{aiSource}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              isAiDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      ) : (
                        <span className="text-sm font-medium">{aiSource}</span>
                      )}

                      {isAiDropdownOpen && aiAvailableSources.length > 1 && (
                        <div className="absolute top-full right-0 mt-1 w-28 bg-white border rounded-md shadow-lg z-10">
                          <ul className="py-1">
                            {aiAvailableSources.map((src) => (
                              <li
                                key={src}
                                className="px-3 py-1 text-sm hover:bg-slate-100 cursor-pointer"
                                onClick={() => {
                                  setAiSource(src);
                                  setIsAiDropdownOpen(false);
                                }}
                              >
                                {src}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {/* Pagination Logic */}
                  {(() => {
                    const data =
                      aiSource === "Google"
                        ? googleData
                        : jiraProjectGroupedData;

                    const itemsPerPage = 4;
                    const totalPages = Math.ceil(data.length / itemsPerPage);

                    const paginatedData = data.slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    );

                    return (
                      <div className="flex flex-col h-full">
                        {/* Project Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pb-2">
                          {paginatedData.length > 0 ? (
                            paginatedData.map((project) => {
                              const ai = project.ai_predictions || {};
                              const s = project.source_data || {};
                              const isGoogle = aiSource === "Google";

                              const predictedDelay = isGoogle
                                ? ai.AI_Delay_Score
                                : (project.avg_delay_score ?? 0) * 100;

                              const confidence = calculateConfidence(ai);

                              return (
                                <div
                                  key={project._id}
                                  className="border rounded-lg p-3 flex flex-col bg-slate-50/50 shadow-sm h-[220px] max-h-[220px]" // fixed height
                                >
                                  <h3 className="font-semibold mb-2 text-left w-fit text-slate-800 text-sm truncate">
                                    {project.project_identifier ||
                                      project.project_name ||
                                      "Untitled Project"}
                                  </h3>

                                  <div className="space-y-3 text-xs flex-grow overflow-hidden">
                                    {/* Predicted Delay% */}
                                    <div className="flex flex-col gap-1">
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                          Predicted Delay%
                                        </span>
                                        <span className="font-medium text-slate-800">
                                          {`${Math.abs(predictedDelay).toFixed(
                                            1
                                          )}%`}
                                        </span>
                                      </div>
                                      <div className="relative w-full h-1.5 bg-slate-200 rounded-full">
                                        <div
                                          className="absolute top-0 left-0 h-full bg-[#00254D] rounded-full"
                                          style={{
                                            width: `${Math.min(
                                              Math.abs(predictedDelay),
                                              100
                                            )}%`,
                                          }}
                                        >
                                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-[#00254D] border-2 border-white rounded-full shadow"></div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Source-specific fields */}
                                    {isGoogle ? (
                                      <>
                                        <div className="grid grid-cols-3 items-center">
                                          <span className="text-slate-600">
                                            Confidence
                                          </span>
                                          <span className="col-span-2 font-medium text-slate-800">
                                            {confidence != null
                                              ? `${confidence.toFixed(1)}%`
                                              : "N/A"}
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-3 items-center">
                                          <span className="text-slate-600">
                                            Risk
                                          </span>
                                          <span className="col-span-2 font-medium text-slate-800">
                                            {ai.Risk || "N/A"}
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="grid grid-cols-3 items-center">
                                          <span className="text-slate-600">
                                            Delay Label
                                          </span>
                                          <span className="col-span-2 font-medium text-slate-800">
                                            {project.avg_delay_label || "N/A"}
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-3 items-center">
                                          <span className="text-slate-600">
                                            Priority Score
                                          </span>
                                          <span className="col-span-2 font-medium text-slate-800">
                                            {project.avg_priority_score != null
                                              ? `${(
                                                  project.avg_priority_score *
                                                  100
                                                ).toFixed(0)}%`
                                              : "N/A"}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  <Link
                                    to={
                                      isGoogle
                                        ? `/dashboard/insights/google-details/${project._id}`
                                        : `/dashboard/insights/jira-summary/${project.ids.join(
                                            ","
                                          )}`
                                    }
                                    className="mt-auto px-3 py-1.5 rounded-md bg-[#00254D] text-white text-center text-xs font-semibold transition hover:bg-opacity-90"
                                  >
                                    Show Summary
                                  </Link>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-center text-slate-500 col-span-2">
                              No project data available
                            </p>
                          )}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="flex justify-center items-center gap-3 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={currentPage === 1}
                              onClick={() => setCurrentPage((p) => p - 1)}
                            >
                              Prev
                            </Button>
                            <span className="text-sm text-slate-600">
                              Page {currentPage} of {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={currentPage === totalPages}
                              onClick={() => setCurrentPage((p) => p + 1)}
                            >
                              Next
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Budget vs. Spend Summary */}
              <Card className="bg-[#f3f7f6]">
                <CardHeader>
                  <CardTitle>Budget vs. Spend Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-4">
                    {budgetBarsData.map((bar) => (
                      <div
                        key={bar.label}
                        className="flex justify-between items-center gap-4"
                      >
                        <div className="w-3/5 bg-gray-200 rounded-sm">
                          <div
                            className={`text-white text-xs font-semibold text-left py-2 px-3 rounded-sm whitespace-nowrap ${bar.barColorClass}`}
                            style={{ width: `${bar.barWidthPercent}%` }}
                          >
                            {bar.label}
                          </div>
                        </div>
                        <div className="text-right font-bold text-lg text-gray-800">
                          {bar.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-100 border-t border-b border-blue-200 text-center py-1.5 my-5">
                    <h3 className="text-sm font-semibold text-blue-700">
                      Forecasted Spend
                    </h3>
                  </div>
                  <div className="flex justify-around items-start pt-2">
                    {forecastsData.map((forecast) => (
                      <Gauge key={forecast.label} {...forecast} />
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Risk Factors */}
              <Card className="bg-[#f3f7f6]">
                <CardHeader>
                  <CardTitle>Risk Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(googleData.length > 0
                      ? googleRiskFactors
                      : jiraRiskFactors
                    ).map((factor) => {
                      const Icon = factor.icon;
                      return (
                        <div
                          key={factor.label}
                          className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/50 cursor-pointer hover:bg-gray-100"
                          onClick={() =>
                            navigate(
                              googleData.length > 0
                                ? `/dashboard/insights/google-summary/${factor.ids.join(
                                    ","
                                  )}`
                                : `/dashboard/insights/jira-summary/${factor.ids.join(
                                    ","
                                  )}`
                            )
                          }
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-6 h-6 ${factor.color}`} />
                            <div>
                              <div className="font-medium text-sm text-gray-800">
                                {factor.label}
                              </div>
                              <div className="text-xs text-gray-500">
                                {factor.sublabel}
                              </div>
                            </div>
                          </div>
                          <span className="font-bold text-lg text-gray-800">
                            {factor.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              {/* Historical Slippage Trend */}
              <Card className="bg-[#f3f7f6]">
                <CardHeader>
                  <CardTitle>Historical Slippage Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={slippageData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} unit="%" />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Line
                          type="monotone"
                          dataKey="plan"
                          name="Planned"
                          stroke="#006685"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="actual"
                          name="Actual"
                          stroke="#34D399"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="forecast"
                          name="Forecasted"
                          stroke="#006685"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-2 font-medium">
                    Actual Slippage
                  </div>
                </CardContent>
              </Card>
            </div>

            {/*--- Lower Crads --- */}

            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Financial Overview */}
              <Card className="h-[430px] bg-[#f3f7f6]">
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {financialOverviewItems.map((item) => {
                      const isSelected = selectedFinancialOverview === item;
                      return (
                        <div
                          key={item}
                          onClick={() => setSelectedFinancialOverview(item)}
                          className={`flex justify-between items-center p-3 rounded-md transition-all duration-200 cursor-pointer bg-white ${
                            isSelected
                              ? "shadow-lg  border-b-4 border-[#006685]"
                              : "hover:shadow-md border-l-4 border-transparent"
                          }`}
                        >
                          <span
                            className={`text-sm ${
                              isSelected
                                ? "text-black font-semibold"
                                : "text-gray-700"
                            }`}
                          >
                            {item}
                          </span>
                          <button
                            className={`text-xl font-light rounded-full h-6 w-6 flex items-center justify-center ${
                              isSelected ? "text-blue-600" : "text-gray-500"
                            }`}
                          >
                            {isSelected ? "−" : "+"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              {renderFinancialDetailCard()}
              {/* Project Status (RAG) */}
              <Card className="bg-[#f3f7f6]">
                <CardHeader>
                  <CardTitle>Project Status (RAG)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={
                            googleData.length > 0 ? googlePieData : jiraPieData
                          }
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          paddingAngle={5}
                          labelLine={false}
                          label={({ cx, cy, midAngle, outerRadius, value }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = outerRadius * 0.6;
                            const x =
                              cx + radius * Math.cos(-midAngle * RADIAN);
                            const y =
                              cy + radius * Math.sin(-midAngle * RADIAN);
                            return (
                              <text
                                x={x}
                                y={y}
                                fill="white"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="text-base font-bold"
                              >
                                {value}
                              </text>
                            );
                          }}
                        >
                          {(googleData.length > 0
                            ? googlePieData
                            : jiraPieData
                          ).map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PIE_COLORS[index]}
                              stroke="white"
                              strokeWidth={4}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    {(googleData.length > 0 ? googlePieData : jiraPieData).map(
                      (entry, index) => (
                        <div key={entry.name} className="flex items-center">
                          <span
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: PIE_COLORS[index] }}
                          ></span>
                          <span className="text-gray-700">{entry.name}</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
