import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  getAllUsers,
  editUser,
  deleteUser,
} from "../../../../services/oprations/authAPI";
import {
  UserPlus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAllGoogleDetails } from "../../../../services/oprations/googleAPI";
import { getAllJiraIssues } from "../../../../services/oprations/jiraAPI";

const accessStyles = {
  Admin: "bg-green-100 text-green-600",
  "Portfolio Manager": "bg-blue-100 text-blue-600",
  "Team Leader": "bg-purple-100 text-purple-600",
  Executive: "bg-yellow-100 text-yellow-700",
  "Project Manager": "bg-orange-100 text-orange-600",
};

export default function UserManagement() {
  const { user } = useSelector((state) => state.profile);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [googleData, setGoogleData] = useState([]);
  const [jiraData, setJiraData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUserData, setEditUserData] = useState({
    _id: "",
    name: "",
    email: "",
    role: "",
    projectrole: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const fetchedUsers = await dispatch(getAllUsers());
    setUsers(fetchedUsers);
  };

  useEffect(() => {
    const fetchGoogle = async () => {
      try {
        const res = await dispatch(getAllGoogleDetails());
        setGoogleData(Array.isArray(res) ? res : []);
        // console.log("response ", res);
        // console.log("Google data",googleData);
      } catch (error) {
       // console.error("Failed to fetch Google data:", error);
      }
    };
    fetchGoogle();
  }, [dispatch]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const issues = await dispatch(getAllJiraIssues());
        setJiraData(Array.isArray(issues) ? issues : []);
       // console.log("jiraData:", issues);
      } catch (error) {
       // console.error("Failed to fetch Jira issues:", error);
        setJiraData([]);
      }
    };

    fetchIssues();
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setEditUserData({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      projectrole: user.projectrole || "",
      assignJiraProjects: user.assignJiraProjects || [],
      assignGoogleProjects: user.assignGoogleProjects || [],
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    setSelectedUserId(userId);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 pt-4 pb-6">
      <h2 className="text-lg sm:text-xl font-bold text-blue-900">
        User Management
      </h2>
      <p className="text-sm sm:text-md text-slate-500 mb-6">
        Manage your team members and their account permissions here.
      </p>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3 sm:gap-0">
        <div className="font-semibold text-sm sm:text-base">
          All Users <span className="text-slate-500">{users.length}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search Here…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm shadow-sm"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <button
            onClick={() =>
              navigate("/dashboard/settings/user-management/add-user")
            }
            className="bg-[#00254D] text-white px-4 py-2 rounded-md text-sm flex flex-row sm:flex-row items-center justify-center gap-3 sm:gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* --- ✅ Mobile Card View --- */}
      <div className="block md:hidden space-y-4 mt-4">
        {users
          .filter((u) => {
            const query = (search || "").toLowerCase();
            return (
              (u.name || "").toLowerCase().includes(query) ||
              (u.role || "").toLowerCase().includes(query) ||
              (u.email || "").toLowerCase().includes(query)
            );
          })
          .map((user) => (
            <div
              key={user._id}
              className="border rounded-lg p-4 shadow-sm space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-700">
                        {user?.name?.[0]?.toUpperCase() || "?"}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-base font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Pencil
                    className="w-4 h-4 text-gray-500 hover:text-blue-600 cursor-pointer"
                    onClick={() => handleEditUser(user)}
                  />
                  <Trash2
                    className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => handleDeleteUser(user._id)}
                  />
                </div>
              </div>
              <div className="text-sm">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    accessStyles[user.role] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role}
                </span>
                <span
                  className={`px-2 py-1 ml-2 rounded-full text-xs font-medium ${
                    accessStyles[user.projectrole] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.projectrole}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                <p>
                  Last Active: {new Date(user.lastActive).toLocaleDateString()}
                </p>
                <p>
                  Date Added: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* --- ✅ Desktop Table View --- */}
      <div className="hidden md:block border rounded-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left text-gray-600">
            <tr>
              <th className="p-3">
                <input type="checkbox" />
              </th>
              <th className="p-3">User Name</th>
              <th className="p-3">Access</th>
              <th className="p-3">Last Active ↓</th>
              <th className="p-3">Date Added</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((u) => {
                const query = (search || "").toLowerCase();
                return (
                  (u.name || "").toLowerCase().includes(query) ||
                  (u.role || "").toLowerCase().includes(query) ||
                  (u.email || "").toLowerCase().includes(query)
                );
              })
              .map((user) => (
                <tr key={user._id} className="border-t text-md">
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium text-gray-700">
                          {user?.name?.[0]?.toUpperCase() || "?"}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        accessStyles[user.role] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`px-2 py-1 ml-2 rounded-full text-xs font-medium ${
                        accessStyles[user.projectrole] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.projectrole}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex gap-2">
                    <Pencil
                      className="w-4 h-4 text-gray-500 hover:text-blue-600 cursor-pointer"
                      onClick={() => handleEditUser(user)}
                    />
                    <Trash2
                      className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() => handleDeleteUser(user._id)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-center sm:justify-end mt-4 space-x-2">
        <button className="w-8 h-8 rounded-full border bg-white text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`w-8 h-8 rounded-full border text-sm flex items-center justify-center ${
              page === 1
                ? "bg-slate-900 text-white"
                : "text-gray-700 bg-white hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button className="w-8 h-8 rounded-full border bg-white text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-center">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div> */}

      {/* === ✅ Edit User Modal === */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-blue-900">
              Update User Details
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editUserData.name}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editUserData.email}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={editUserData.role}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, role: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>

              {user?.projectrole !== "Team Leader" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Role
                  </label>
                  <select
                    value={editUserData.projectrole}
                    onChange={(e) =>
                      setEditUserData({
                        ...editUserData,
                        projectrole: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select Project Role</option>
                    <option value="Project Manager">
                      Project Manager(Jira)
                    </option>
                    <option value="Team Leader">
                      Team Leader(Jira & Google)
                    </option>
                    <option value="Executive">Executive(Google)</option>
                    <option value="Portfolio Manager">
                      Portfolio Manager(Google)
                    </option>
                  </select>
                </div>
              )}

              {["Portfolio Manager", "Project Manager", "Executive"].includes(
                user.projectrole
              ) && (
                <>
                  {/* Assign Jira Projects */}
                  {user?.projectrole !== "Team Leader" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assign Jira Projects
                      </label>
                      <Select
                        isMulti
                        value={jiraData
                          .filter((proj) =>
                            (editUserData.assignJiraProjects || []).includes(
                              proj._id
                            )
                          )
                          .map((proj) => ({
                            value: proj._id,
                            label: proj.key || proj.issueKey,
                          }))}
                        options={jiraData.map((proj) => ({
                          value: proj._id,
                          label: proj.key || proj.issueKey,
                        }))}
                        onChange={(selected) =>
                          setEditUserData({
                            ...editUserData,
                            assignJiraProjects: selected.map((s) => s.value),
                          })
                        }
                      />
                    </div>
                  )}

                  {/* Assign Google Projects */}
                  {user?.projectrole !== "Team Leader" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assign Google Projects
                      </label>
                      <Select
                        isMulti
                        value={googleData
                          .filter((proj) =>
                            (editUserData.assignGoogleProjects || []).includes(
                              proj._id
                            )
                          )
                          .map((proj) => ({
                            value: proj._id,
                            label:
                              proj.project_identifier ||
                              proj.project_name ||
                              "Unnamed Google Project",
                          }))}
                        options={googleData.map((proj) => ({
                          value: proj._id,
                          label:
                            proj.project_identifier ||
                            proj.project_name ||
                            "Unnamed Google Project",
                        }))}
                        onChange={(selected) =>
                          setEditUserData({
                            ...editUserData,
                            assignGoogleProjects: selected.map((s) => s.value),
                          })
                        }
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(
                    editUser(
                      editUserData._id,
                      {
                        name: editUserData.name,
                        email: editUserData.email,
                        role: editUserData.role,
                        projectrole: editUserData.projectrole,
                        assignJiraProjects:
                          editUserData.assignJiraProjects || [],
                        assignGoogleProjects:
                          editUserData.assignGoogleProjects || [],
                      },
                      fetchUsers
                    )
                  );
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2 bg-[#00254D] text-white rounded-md text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === ✅ Delete Confirmation Modal === */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-[#00254D]">
              Delete User
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md text-sm "
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(deleteUser(selectedUserId, fetchUsers));
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-[#00254D] hover:bg-red-600 text-white rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
