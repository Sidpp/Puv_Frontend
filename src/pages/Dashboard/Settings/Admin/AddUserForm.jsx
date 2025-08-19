import React, { useState } from "react";
import addUser from "../../../../assets/Add.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../../../../services/oprations/authAPI";

const AddUserForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    dispatch(
      register(
        form.role,
        form.name,
        form.email,
        form.password,
        form.confirmPassword,
        navigate
      )
    );
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-4 pb-6 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-blue-900">Add New User</h2>
        <p className="text-gray-500 text-md font-semibold mt-1">
          Create new user to this Portal
        </p>
        <div className="h-[2px] w-full bg-blue-500 mt-2" />
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
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 bg-white"
              >
                <option value="" disabled>
                  Select role
                </option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
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
                className="border border-blue-900 text-blue-900 px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-blue-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-800"
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