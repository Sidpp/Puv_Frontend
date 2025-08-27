import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { globalSearch } from "../../../services/oprations/authAPI";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch results automatically when query changes (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await dispatch(globalSearch(query));
        setResults(response);
      } catch (err) {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 400); // debounce 400ms

    return () => clearTimeout(timeoutId);
  }, [query, dispatch]);

  const handleSelect = (type, id, isSummary = false) => {
    if (type === "jira") {
      if (isSummary) {
        navigate(`/dashboard/insights/jira-summary`);
      } else {
        navigate(`/dashboard/insights/jira-details/${id}`);
      }
    } else if (type === "google") {
      if (isSummary) {
        navigate(`/dashboard/insights/google-summary`);
      } else {
        navigate(`/dashboard/insights/google-details/${id}`);
      }
    }
    setQuery("");
    setResults(null);
  };

  const handleProjectSummary = (type, ids) => {
    if (type === "jira") {
      navigate(`/dashboard/insights/jira-summary/${ids.join(",")}`);
    } else if (type === "google") {
      navigate(`/dashboard/insights/google-summary/${ids.join(",")}`);
    }
    setQuery("");
    setResults(null);
  };

  const handleClear = () => {
    setQuery("");
    setResults(null);
  };

  const noResults =
    results && (!results.jira?.length && !results.google?.length);

  // Build project-level matches
  const projectMatch = [];
  if (results) {
    // JIRA
    const matchedJiraProjects = results.jira?.filter((item) =>
      item.project_name?.toLowerCase().includes(query.toLowerCase())
    );
    if (matchedJiraProjects?.length) {
      projectMatch.push({
        type: "jira",
        label: "All Jira Projects",
        projects: matchedJiraProjects,
      });
    }

    // Google
    const matchedGoogleProjects = results.google?.filter((item) =>
      item.source_data?.Project?.toLowerCase().includes(query.toLowerCase())
    );
    if (matchedGoogleProjects?.length) {
      projectMatch.push({
        type: "google",
        label: "All Google Projects",
        projects: matchedGoogleProjects,
      });
    }
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Here..."
          className="pl-10 pr-8 py-2 rounded-full border bg-gray-50 w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {(loading || results) && (
        <div className="absolute mt-2 w-96 bg-white border rounded-lg shadow-lg max-h-72 overflow-y-auto z-50">
          {loading && (
            <div className="p-3 text-sm text-gray-500">Searching...</div>
          )}

          {/* No Results */}
          {noResults && !loading && (
            <div className="p-3 text-sm text-gray-500">No match found</div>
          )}

          {/* Project-Level Matches */}
          {projectMatch.length > 0 && (
            <div className="p-2 border-b">
              <h4 className="text-sm font-semibold text-gray-600">Projects</h4>
              {projectMatch.map((pm) => (
                <div key={pm.type}>
                  {/* All Projects */}
                  <div
                    onClick={() => handleSelect(pm.type, null, true)}
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <p className="text-sm font-bold">{pm.label}</p>
                  </div>

                  {/* Project-specific summaries */}
                  {[...new Set(pm.projects.map((p) =>
                    pm.type === "jira" ? p.project_name : p.source_data?.Project
                  ))].map((projectName) => {
                    const ids = pm.projects
                      .filter((p) =>
                        (pm.type === "jira"
                          ? p.project_name
                          : p.source_data?.Project) === projectName
                      )
                      .map((p) => p._id);

                    return (
                      <div
                        key={projectName}
                        onClick={() => handleProjectSummary(pm.type, ids)}
                        className="p-2 hover:bg-gray-100 rounded cursor-pointer ml-4"
                      >
                        <p className="text-sm font-medium">
                          {projectName} Project
                        </p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Jira Results */}
          {results?.jira?.length > 0 && (
            <div className="p-2 border-b">
              <h4 className="text-sm font-semibold text-gray-600">Jira Issues</h4>
              {results.jira.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSelect("jira", item._id)}
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <p className="text-sm font-medium">{item.summary || "No Summary"}</p>
                  <p className="text-xs text-gray-500">{item.project_name}</p>
                </div>
              ))}
            </div>
          )}

          {/* GoogleSheet Results */}
          {results?.google?.length > 0 && (
            <div className="p-2">
              <h4 className="text-sm font-semibold text-gray-600">Google Sheets</h4>
              {results.google.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSelect("google", item._id)}
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <p className="text-sm font-medium">
                    {item.source_data?.Project || "Unnamed Project"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.source_data?.Program}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
