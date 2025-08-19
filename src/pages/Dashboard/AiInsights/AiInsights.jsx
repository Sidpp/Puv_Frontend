import React, { useState, useEffect } from "react";
import JiraCard from "../../../components/Dashboard/AiInsights/JiraCard";
import GoogleCard from "../../../components/Dashboard/AiInsights/GoogleCard";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FilterTab from "../../../components/Dashboard/AiInsights/FilterTab";


import { getAllJiraIssues } from "../../../services/oprations/jiraAPI";
// import { getAllGoogleDetails } from "../../../services/oprations/googleAPI";



const AiInsights = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [jiraData, setJiraData] = useState([]);
  const [googleData, setGoogleData] = useState([]);
  const [selectedView, setSelectedView] = useState("google");


  // useEffect(() => {
  //   // Dummy Google data
  //   const dummyGoogleData = [
  //     {
  //       _id: "1",
  //       index: 0,
  //       project_identifier: "G-001",
  //       source_data: {
  //         Program: "Cloud Migration",
  //         Role: "Cloud Architect",
  //         Issues: 12,
  //         ["Project Manager"]: "Alice",
  //         ["Contract Start Date"]: "2024-06-01",
  //         ["Contract End Date"]: "2024-12-31",
  //         ["Burnout Risk (%)"]: 15,
  //         ["Resource Name"]: "Bob",
  //         ["Contract ID"]: "C-12345",
  //         ["Milestone Status"]: "On Track",
  //       },
  //     },
  //     {
  //       _id: "2",
  //       index: 1,
  //       project_identifier: "G-002",
  //       source_data: {
  //         Program: "AI Development",
  //         Role: "ML Engineer",
  //         Issues: 5,
  //         ["Project Manager"]: "Charlie",
  //         ["Contract Start Date"]: "2024-05-01",
  //         ["Contract End Date"]: "2024-11-30",
  //         ["Burnout Risk (%)"]: 20,
  //         ["Resource Name"]: "Dave",
  //         ["Contract ID"]: "C-67890",
  //         ["Milestone Status"]: "Delayed",
  //       },
  //     },
  //     {
  //       _id: "3",
  //       index: 0,
  //       project_identifier: "G-001",
  //       source_data: {
  //         Program: "Cloud Migration",
  //         Role: "Cloud Architect",
  //         Issues: 12,
  //         ["Project Manager"]: "Alice",
  //         ["Contract Start Date"]: "2024-06-01",
  //         ["Contract End Date"]: "2024-12-31",
  //         ["Burnout Risk (%)"]: 15,
  //         ["Resource Name"]: "Bob",
  //         ["Contract ID"]: "C-12345",
  //         ["Milestone Status"]: "On Track",
  //       },
  //     },
  //     {
  //       _id: "4",
  //       index: 1,
  //       project_identifier: "G-002",
  //       source_data: {
  //         Program: "AI Development",
  //         Role: "ML Engineer",
  //         Issues: 5,
  //         ["Project Manager"]: "Charlie",
  //         ["Contract Start Date"]: "2024-05-01",
  //         ["Contract End Date"]: "2024-11-30",
  //         ["Burnout Risk (%)"]: 20,
  //         ["Resource Name"]: "Dave",
  //         ["Contract ID"]: "C-67890",
  //         ["Milestone Status"]: "Delayed",
  //       },
  //     },
  //   ];

  //   setGoogleData(dummyGoogleData);
  // }, []);

  // useEffect(() => {
  //   // Dummy Jira data
  //   const dummyJiraData = [
  //     {
  //       _id: "J-1",
  //       priority: "High",
  //       issueKey: "JIRA-101",
  //       project_name: "Website Revamp",
  //       summary: "Update landing page design",
  //       ai_delay_score: 0.75,
  //     },
  //     {
  //       _id: "J-2",
  //       priority: "Medium",
  //       issueKey: "JIRA-102",
  //       project_name: "Mobile App",
  //       summary: "Fix login bug on Android",
  //       ai_delay_score: 0.5,
  //     },
  //     {
  //       _id: "J-3",
  //       priority: "High",
  //       issueKey: "JIRA-101",
  //       project_name: "Website Revamp",
  //       summary: "Update landing page design",
  //       ai_delay_score: 0.75,
  //     },
  //     {
  //       _id: "J-4",
  //       priority: "Medium",
  //       issueKey: "JIRA-102",
  //       project_name: "Mobile App",
  //       summary: "Fix login bug on Android",
  //       ai_delay_score: 0.5,
  //     },
  //   ];

  //   setJiraData(dummyJiraData);
  // }, []);


  // useEffect(() => {
  //   const fetchGoogle = async () => {
  //     try {
  //       const res = await dispatch(getAllGoogleDetails());
  //       setGoogleData(Array.isArray(res) ? res : []);
  //       console.log("google:", res);
  //     } catch (error) {
  //       console.error("Failed to fetch google issues:", error);
  //       setGoogleData([]); 
  //     }
  //   };

  //   fetchGoogle();
  // }, [dispatch]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const issues = await dispatch(getAllJiraIssues());
        setJiraData(Array.isArray(issues) ? issues : []);
        console.log("jiraData:", issues);
      } catch (error) {
        console.error("Failed to fetch Jira issues:", error);
        setJiraData([]); // fallback
      }
    };

    fetchIssues();
  }, [dispatch]);

  const handleViewChange = (e) => {
    const value = e.target.value;

    if (value === "jira" || value === "google") {
      setSelectedView(value);
     
    }
  };



  const isGoogleEmpty = !googleData || googleData.length === 0;
  const isJiraEmpty = !jiraData || jiraData.length === 0;



  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <FilterTab
          id="1"
          label="In Progress"
          count={5}
          color="#3b82f6"
          selectedFilter="In Progress"
        />

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

      {selectedView === "jira" && isJiraEmpty && <div>No Jira data</div>}
      {selectedView === "google" && isGoogleEmpty && <div>No Google data</div>}

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
            ? jiraData.map((item) => <JiraCard key={item._id} {...item} />)
            : googleData.map((item) => <GoogleCard key={item._id} {...item} />)}
        </div>
      )}
    </div>
  );
};

export default AiInsights;
