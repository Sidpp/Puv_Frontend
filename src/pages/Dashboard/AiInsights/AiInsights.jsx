import React, { useState, useEffect } from "react";
import JiraCard from "../../../components/Dashboard/AiInsights/JiraCard";
import GoogleCard from "../../../components/Dashboard/AiInsights/GoogleCard";
import { useDispatch, useSelector } from "react-redux";
import FilterTab from "../../../components/Dashboard/AiInsights/FilterTab";
import {
  getAllJiraIssues,
  getJiraIssueById,
} from "../../../services/oprations/jiraAPI";
import {
  getAllGoogleDetails,
  getGoogleSheetById,
} from "../../../services/oprations/googleAPI";
import { useNavigate } from "react-router-dom";

const AiInsights = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [jiraData, setJiraData] = useState([]);
  const [googleData, setGoogleData] = useState([]);
    const [loadingJira, setLoadingJira] = useState(true);
  const [loadingGoogle, setLoadingGoogle] = useState(true);
  const [selectedView, setSelectedView] = useState("google");
  const [selectedFilter, setSelectedFilter] = useState("All");
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
  //           // console.log("allData", allData);
  //         }

  //         setGoogleData(allData);
  //       } catch (error) {
  //         //console.error("Failed to fetch Google data:", error);
  //       }
  //     } else {
  //       try {
  //         const res = await dispatch(getAllGoogleDetails());
  //         setGoogleData(Array.isArray(res) ? res : []);
  //       } catch (error) {
  //         console.error("Failed to fetch Google data:", error);
  //       }
  //     }
  //   };

  //   fetchGoogle();
  //   console.log("GoogleData", googleData);
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
  //           // console.log("allData", allData);
  //         }

  //         setJiraData(allData);
  //       } catch (error) {
  //         console.error("Failed to fetch Jira issues:", error);
  //       }
  //     } else {
  //       try {
  //         const issues = await dispatch(getAllJiraIssues());
  //         setJiraData(Array.isArray(issues) ? issues : []);
  //       } catch (error) {
  //         console.error("Failed to fetch Jira issues:", error);
  //         setJiraData([]);
  //       }
  //     }
  //   };

  //   fetchJira();
  // }, [dispatch, user]);

   // --- Google Fetch ---
  useEffect(() => {
    const fetchGoogle = async () => {
      setLoadingGoogle(true);
      try {
        if (user?.projectrole === "Team Leader") {
          const ids = user?.assignGoogleProjects || [];
          let allData = [];
          for (const id of ids) {
            const res = await dispatch(getGoogleSheetById(id));
            if (res) allData.push(res);
          }
          setGoogleData(allData);
        } else {
          const res = await dispatch(getAllGoogleDetails());
          setGoogleData(Array.isArray(res) ? res : []);
        }
      } catch (error) {
        console.error("Failed to fetch Google data:", error);
        setGoogleData([]);
      } finally {
        setLoadingGoogle(false);
      }
    };

    fetchGoogle();
  }, [dispatch, user]);

  // --- Jira Fetch ---
  useEffect(() => {
    const fetchJira = async () => {
      setLoadingJira(true);
      try {
        if (user?.projectrole === "Team Leader") {
          const ids = user?.assignJiraProjects || [];
          let allData = [];
          for (const id of ids) {
            const res = await dispatch(getJiraIssueById(id));
            if (res) allData.push(res);
          }
          setJiraData(allData);
        } else {
          const issues = await dispatch(getAllJiraIssues());
          setJiraData(Array.isArray(issues) ? issues : []);
        }
      } catch (error) {
        console.error("Failed to fetch Jira issues:", error);
        setJiraData([]);
      } finally {
        setLoadingJira(false);
      }
    };

    fetchJira();
  }, [dispatch, user]);



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
    // 1. First filter issues normally
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

    // 2. Group issues by project_name
    const grouped = {};

    filteredIssues.forEach((item) => {
      const projectName = item.project_name || "Unknown";

      if (!grouped[projectName]) {
        grouped[projectName] = {
          project_name: projectName,
          ai_delay_scores: [],
          ai_summary: [],
          ids: [],
          priority: item.priority || "Default", // can decide priority rule later
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

    // 3. Convert grouped object → array
    return Object.values(grouped);
  };

  const filteredJira = applyFilterAndJiraGrouped(jiraData);

  // const groupByProject = (data) => {
  //   const grouped = {};

  //   data.forEach((item) => {
  //     const projectName = item.project_name || "Unknown";

  //     if (!grouped[projectName]) {
  //       grouped[projectName] = {
  //         project_name: projectName,
  //         ai_delay_scores: [],
  //         ai_summary: [],
  //         ids: [],
  //       };
  //     }

  //     // Collect scores and ids
  //     if (item.ai_delay_score !== undefined) {
  //       grouped[projectName].ai_delay_scores.push(item.ai_delay_score);
  //     }
  //     if (item.ai_summary !== undefined) {
  //       grouped[projectName].ai_summary.push(item.ai_summary);
  //     }
  //     if (item._id) {
  //       grouped[projectName].ids.push(item._id);
  //     }
  //   });

  //   // Convert back to array
  //   return Object.values(grouped);
  // };
  // // Usage
  // const filteredJira = applyFilter(jiraData);
  // const groupedJiraData = groupByProject(filteredJira);

  //console.log("group data ", groupedJiraData);
  const filteredGoogle = applyFilter(googleData);

  const isGoogleEmpty = !filteredGoogle || filteredGoogle.length === 0;
  const isJiraEmpty = !filteredJira || filteredJira.length === 0;

  // --- Count calculation ---
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

        {/* View Switcher */}
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
      </div>

      {/* Data Grid */}
      {selectedView === "jira" && isJiraEmpty && (
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

      {selectedView === "google" && isGoogleEmpty && (
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

      {!(
        (selectedView === "jira" && isJiraEmpty) ||
        (selectedView === "google" && isGoogleEmpty)
      ) && (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            selectedView === "google" ? "lg:grid-cols-3" : "lg:grid-cols-4"
          } gap-6`}
        >
          {selectedView === "jira"
            ? filteredJira.map((item) => <JiraCard key={item._id} {...item} />)
            : filteredGoogle.map((item) => (
                <GoogleCard key={item._id} {...item} />
              ))}
        </div>
      )}
    </div>
  );
};

export default AiInsights;
