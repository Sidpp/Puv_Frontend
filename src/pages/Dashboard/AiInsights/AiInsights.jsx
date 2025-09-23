import React, { useState, useEffect } from "react";
import JiraCard from "../../../components/Dashboard/AiInsights/JiraCard";
import GoogleCard from "../../../components/Dashboard/AiInsights/GoogleCard";
import { useDispatch, useSelector } from "react-redux";
import FilterTab from "../../../components/Dashboard/AiInsights/FilterTab";
import {
  getAllJiraIssues,
  getAssignJiraIssues,
  getJiraAllIssuesByAssign,
  getJiraIssueById,
} from "../../../services/oprations/jiraAPI";
import {
  getAllGoogleDetails,
  getAssignGoogleDetails,
} from "../../../services/oprations/googleAPI";
import { useNavigate } from "react-router-dom";

const AiInsights = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [jiraData, setJiraData] = useState([]);
  const [googleData, setGoogleData] = useState([]);
  const [loadingJira, setLoadingJira] = useState(true);
  const [loadingGoogle, setLoadingGoogle] = useState(true);
  const [selectedView, setSelectedView] = useState();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    const fetchGoogle = async () => {
      setLoadingGoogle(true);
      try {
        if (
          [
            "Portfolio Manager",
            "Project Manager",
            "Program Manager",
            // "Executive",
          ].includes(user?.projectrole)
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
        // setLoadingGoogle(false);
      }
    };

    fetchGoogle();
  }, [dispatch, user]);

  // --- Jira Fetch ---

  useEffect(() => {
    const fetchJira = async () => {
      setLoadingJira(true);
      try {
        if (
          (user?.projectrole === "Team Leader" && user?.source === "Jira" ) ||
          (user?.projectrole === "Project Manager" && user?.source === "Jira")
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
          // console.log("data",issues)
          setJiraData(Array.isArray(issues) ? issues : []);
        } else {
          const issues = await dispatch(getAllJiraIssues());
          setJiraData(Array.isArray(issues) ? issues : []);
        }
      } catch (error) {
        //console.error("Failed to fetch Jira issues:", error);
        setJiraData([]);
      } finally {
        setLoadingJira(false);
        setLoadingGoogle(false);
      }
    };

    fetchJira();
  }, [dispatch, user]);

  useEffect(() => {
    // Use presence of raw data (not filtered) to set default view
    if (jiraData.length > 0 && googleData.length > 0) {
      if (selectedView !== "jira" && selectedView !== "google") {
        setSelectedView("google");
      }
    } else if (jiraData.length > 0) {
      setSelectedView("jira");
    } else if (googleData.length > 0) {
      setSelectedView("google");
    }
  }, [jiraData, googleData]);

  const handleViewChange = (e) => {
    const value = e.target.value;
    if (value === "jira" || value === "google") {
      setSelectedView(value);
      setSelectedFilter("All");
    }
  };

  // --- Normalize Jira statuses into categories ---
  const mapJiraStatus = (status) => {
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
  };

  // --- Filtering logic ---
  const applyFilter = (data) => {
    if (selectedFilter === "All") return data;

    return data.filter((item) => {
      if (selectedView === "jira") {
        const mapped = mapJiraStatus(item.status);
        return mapped.toLowerCase() === selectedFilter.toLowerCase();
      } else {
        const status = item.ai_predictions?.["Milestone_Status"] || "";
        return status.toLowerCase() === selectedFilter.toLowerCase();
      }
    });
  };

  const applyFilterAndJiraGrouped = (data) => {
    let filteredIssues = data;

    if (selectedFilter !== "All") {
      filteredIssues = data.filter((item) => {
        if (selectedView === "jira") {
          const mapped = mapJiraStatus(item.status);
          return mapped.toLowerCase() === selectedFilter.toLowerCase();
        } else {
          const status = item.source_data?.["Milestone Status"] || "";
          return status.toLowerCase() === selectedFilter.toLowerCase();
        }
      });
    }

    const grouped = {};

    filteredIssues.forEach((item) => {
      const projectName = item.project_name || "Unknown";

      if (!grouped[projectName]) {
        grouped[projectName] = {
          project_name: projectName,
          ai_delay_scores: [],
          ai_summary: [],
          ids: [],
          priority: item.priority || "Default",
          issueKey: item.key || "",
        };
      }

      if (item.ai_delay_score !== undefined) {
        grouped[projectName].ai_delay_scores.push(item.ai_delay_score);
      }
      if (item.ai_summary) {
        grouped[projectName].ai_summary.push(item.ai_summary);
      }
      if (item._id) {
        grouped[projectName].ids.push(item._id);
      }
    });

    return Object.values(grouped);
  };

  const filteredJira = applyFilterAndJiraGrouped(jiraData);
  const filteredGoogle = applyFilter(googleData);

  // --- Distinguish global presence vs filtered emptiness ---
  const hasJiraData = Array.isArray(jiraData) && jiraData.length > 0;
  const hasGoogleData = Array.isArray(googleData) && googleData.length > 0;

  const isJiraFilteredEmpty = !filteredJira || filteredJira.length === 0;
  const isGoogleFilteredEmpty = !filteredGoogle || filteredGoogle.length === 0;

  // --- Count calculation (based on raw data) ---
  const getCounts = (data, source) => {
    const counts = {
      All: data.length,
      "In Progress": 0,
      Completed: 0,
      Delayed: 0,
      "On Track": 0,
    };

    data.forEach((item) => {
      if (source === "jira") {
        const mapped = mapJiraStatus(item.status);
        if (counts[mapped] !== undefined) {
          counts[mapped]++;
        }
      } else {
        const status = item.ai_predictions?.["Milestone_Status"];
        if (status && counts[status] !== undefined) {
          counts[status]++;
        }
      }
    });

    return counts;
  };

  const counts =
    selectedView === "jira"
      ? getCounts(jiraData, "jira")
      : getCounts(googleData, "google");

  // --- Loading checks ---
  if (loadingGoogle && loadingJira) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-lg font-semibold">Loading Data...</p>
      </div>
    );
  }

  // <-- GLOBAL empty check: only true when BOTH sources have no data at all -->
  if (!hasJiraData && !hasGoogleData) {
    if (user?.role === "Admin") {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl font-semibold mb-4">No data found.</p>
          <button
            className="px-6 py-3 bg-[#00254D] text-white rounded-md hover:bg-[#003366] transition"
            onClick={() => {
              navigate("/dashboard/settings/profile-management");
            }}
          >
            Connect
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl font-semibold mb-4">
            You haven't assigned with any Projects
          </p>
        </div>
      );
    }
  }

  if (selectedView === "jira" && loadingJira) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-lg font-semibold">Loading Jira data...</p>
      </div>
    );
  }

  if (selectedView === "google" && loadingGoogle) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-lg font-semibold">Loading Google data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <FilterTab
          id="all"
          label="All"
          count={counts.All}
          color="#6b7280"
          selectedFilter={selectedFilter}
          onClick={setSelectedFilter}
        />
        {selectedView === "jira" ? (
          <>
            <FilterTab
              id="inprogress"
              label="In Progress"
              count={counts["In Progress"]}
              color="#3b82f6"
              selectedFilter={selectedFilter}
              onClick={setSelectedFilter}
            />
            <FilterTab
              id="completed"
              label="Completed"
              count={counts.Completed}
              color="#22c55e"
              selectedFilter={selectedFilter}
              onClick={setSelectedFilter}
            />
            <FilterTab
              id="delayed"
              label="Delayed"
              count={counts.Delayed}
              color="#ef4444"
              selectedFilter={selectedFilter}
              onClick={setSelectedFilter}
            />
          </>
        ) : (
          <>
            <FilterTab
              id="ontrack"
              label="In Progress"
              count={counts["In Progress"]}
              color="#3b82f6"
              selectedFilter={selectedFilter}
              onClick={setSelectedFilter}
            />
            <FilterTab
              id="completed"
              label="Completed"
              count={counts.Completed}
              color="#22c55e"
              selectedFilter={selectedFilter}
              onClick={setSelectedFilter}
            />
            <FilterTab
              id="delayed"
              label="Delayed"
              count={counts.Delayed}
              color="#ef4444"
              selectedFilter={selectedFilter}
              onClick={setSelectedFilter}
            />
          </>
        )}

        {/* View Switcher - only show if both have data */}
        {hasJiraData && hasGoogleData && (
          <div className="ml-auto">
            <select
              value={selectedView}
              onChange={handleViewChange}
              className="appearance-none border border-blue-300 rounded-full px-6 py-2 shadow-md"
            >
              <option value="jira">Jira View</option>
              <option value="google">Google View</option>
            </select>
          </div>
        )}
      </div>

      {/* If the selected view has NO global data at all, show Connect buttons.
          NOTE: this uses hasJiraData / hasGoogleData (global check), not the filtered emptiness.
      */}
      {selectedView === "jira" && !hasJiraData && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl font-semibold mb-4">No Jira data found.</p>
          <button
            className="px-6 py-3 bg-[#00254D] text-white rounded-md hover:bg-[#003366] transition"
            onClick={() => {
              navigate("/dashboard/settings/profile-management");
            }}
          >
            Connect Jira
          </button>
        </div>
      )}

      {selectedView === "google" && !hasGoogleData && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl font-semibold mb-4">No Google data found.</p>
          <button
            className="px-6 py-3 bg-[#00254D] text-white rounded-md hover:bg-[#003366] transition"
            onClick={() => {
              navigate("/dashboard/settings/profile-management");
            }}
          >
            Add Google Credentials
          </button>
        </div>
      )}

      {/* Data Grid — always render the grid (so tabs remain visible).
          Only render cards when filtered lists are non-empty; when filter yields zero items,
          the grid will be blank but filter tabs remain, so user can switch filters/views.
      */}
      {!(selectedView === "jira" && !hasJiraData) &&
        !(selectedView === "google" && !hasGoogleData) && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              selectedView === "google" ? "lg:grid-cols-3" : "lg:grid-cols-4"
            } gap-6`}
          >
            {selectedView === "jira"
              ? isJiraFilteredEmpty
                ? null
                : filteredJira.map((item) => (
                    <JiraCard
                      key={item.project_name || item.issueKey}
                      {...item}
                    />
                  ))
              : isGoogleFilteredEmpty
              ? null
              : filteredGoogle.map((item) => (
                  <GoogleCard key={item._id || item.project_name} {...item} />
                ))}
          </div>
        )}
    </div>
  );
};

export default AiInsights;
