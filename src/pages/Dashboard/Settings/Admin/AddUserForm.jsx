import React, { useState, useEffect } from "react";
import addUser from "../../../../assets/Add.png";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../../services/oprations/authAPI";
import toast from "react-hot-toast";
import { getAllJiraIssues } from "../../../../services/oprations/jiraAPI";

const AddUserForm = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [jiraData, setJiraData] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "User",
    source: "",
    projectrole: "",
    password: "",
    confirmPassword: "",
    assignJiraProjects: "",
    assignJiraProject: [],
  });

  useEffect(() => {
    const fetchJira = async () => {
      try {
        const issues = await dispatch(getAllJiraIssues());
        setJiraData(Array.isArray(issues) ? issues : []);
      } catch (error) {
        //console.error("Failed to fetch Jira issues:", error);
        setJiraData([]);
      }
    };

    fetchJira();
  }, [dispatch]);

  const applyJiraGrouped = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const projectName = item.project_name || "Unknown";

      if (!grouped[projectName]) {
        grouped[projectName] = {
          project_name: projectName,
          ids: [],
        };
      }

      if (item._id) {
        grouped[projectName].ids.push(item._id);
      }
    });
    // console.log("grouped",grouped)
    // Convert grouped object → array
    return Object.values(grouped);
  };

  const filteredJira = applyJiraGrouped(jiraData);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;
    return regex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      toast.error(
        "Password must be at least 12 characters long and include lowercase, uppercase, number, and special character"
      );
      return;
    }
   // console.log("formdata",form)

    dispatch(
      register(
        form.role,
        form.projectrole,
        form.name,
        form.source,
        form.email,
        form.password,
        form.confirmPassword,
        form.assignJiraProjects,
        form.source === "Google" ? user?._id : null, // googleProjectAuthor
        form.projectrole === "Portfolio Manager" ? user?._id : null, //jiraProjectAuthor
        form.assignJiraProject,
        navigate
      )
    );
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-4 pb-6 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold ">Add New User</h2>
        <p className="text-gray-500 text-md font-semibold mt-1">
          Create new user to this Portal
        </p>
        <div className="h-[2px] w-full bg-[#00254D] mt-2" />
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
        {/* Left Icon */}
        <img src={addUser} alt="addUser icon" />

        {/* Form */}
        <div className="bg-gray-100 rounded-xl shadow-md p-8 w-full max-w-md">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                type="email"
                placeholder="Enter email"
              />
            </div>

            {/* ✅ Show Source & Project Role only if role is User */}

            {/* Source Dropdown */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Plaform
              </label>
              <select
                name="source"
                value={form.source}
                onChange={(e) => {
                  handleChange(e);
                  // reset projectrole when source changes
                  setForm((prev) => ({ ...prev, projectrole: "" }));
                }}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 bg-white"
              >
                <option value="" disabled>
                  Select Source
                </option>
                <option value="Jira">Jira</option>
                <option value="Google">Google</option>
              </select>
            </div>

            {/* ✅ Project Role Dropdown depends on Source */}
            {form.source && (
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Role
                </label>
                <select
                  name="projectrole"
                  value={form.projectrole}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 bg-white"
                >
                  <option value="" disabled>
                    Select Project Role
                  </option>
                  {form.source === "Jira" ? (
                    <>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Team Leader">Team Leader </option>
                    </>
                  ) : (
                    <>
                      <option value="Portfolio Manager">
                        Portfolio Manager
                      </option>
                      <option value="Program Manager">Program Manager</option>
                      <option value="Project Manager">Project Manager</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* Assign Jira Projects */}
            {form.source === "Jira" && form.projectrole && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Jira Projects
                </label>
                <Select
                  isMulti
                  value={(form.assignJiraProject || []).map((proj) => ({
                    value: proj.jiraProjectName,
                    label: proj.jiraProjectName,
                  }))}
                  options={filteredJira.map((proj) => ({
                    value: proj.project_name,
                    label: proj.project_name,
                  }))}
                  onChange={(selected) => {
                    const newProjects = selected.map((s) => {
                      const proj = filteredJira.find(
                        (p) => p.project_name === s.value
                      );
                      return {
                        jiraProjectName: proj.project_name,
                        jiraProjectCredentials: user?.jira_credential_id, // 👈 attach credential
                      };
                    });

                    setForm((prev) => ({
                      ...prev,
                      assignJiraProject: newProjects, // 👈 save objects instead of just IDs
                    }));
                  }}
                />
              </div>
            )}

            {/* Password */}

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                type="password"
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Confirm Password
              </label>

              <input
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                type="password"
                placeholder="Confirm password"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard/settings/user-management")}
                className="border border-blue-900 text-blue-900 px-5 py-2 rounded-full text-sm font-medium hover:bg-[#00254D]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-[#00254D] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#00254D]"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
