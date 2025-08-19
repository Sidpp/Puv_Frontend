import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 👈 Add this
import { changePassword } from '../../../services/oprations/authAPI';
import lock from "../../../assets/lock.png";

const ChangePassword = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;
    return regex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error(
        "Password must be at least 12 characters long and include lowercase, uppercase, number, and special character"
      );
      return;
    }

    dispatch(
      changePassword(oldPassword, newPassword, () => {
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      })
    );
  };

  return (
    <div className="bg-white p-6 min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
        <div className="bg-[#f4f8f7] rounded-xl shadow-md p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left Panel */}
          <div className="flex flex-col items-center md:items-start md:w-1/3">
            <h2 className="text-[#002544] font-semibold text-lg leading-6">
              Change Password
            </h2>
            <p className="text-[#002544] font-semibold text-xs leading-4 mt-1">
              Enter your current and new password
            </p>
            <img
              src={lock}
              alt="Open padlock icon"
              className="mt-8"
              width={150}
              height={150}
            />
          </div>

          {/* Right Form Section */}
          <div className="flex flex-col gap-6 md:w-2/3">

            {/* Old Password */}
            <div>
              <label
                htmlFor="oldPassword"
                className="text-[#7f7f7f] font-semibold text-sm leading-5"
              >
                Old Password
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  type={showOld ? 'text' : 'password'}
                  className="mt-2 rounded-xl shadow-[3px_3px_5px_rgba(0,0,0,0.1)] p-3 w-full text-sm"
                  value={formData.oldPassword}
                  onChange={handleChange}
                />
                <span
                  className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-600 cursor-pointer"
                  onClick={() => setShowOld(!showOld)}
                >
                  {showOld ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="text-[#7f7f7f] font-semibold text-sm leading-5"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNew ? 'text' : 'password'}
                  className="mt-2 rounded-xl shadow-[3px_3px_5px_rgba(0,0,0,0.1)] p-3 w-full text-sm"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <span
                  className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-600 cursor-pointer"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <p className="text-[13px] text-[#7f7f7f] mt-2">
                Your password must have at least 12 characters, including lowercase letters, uppercase letters, numbers, and special characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-[#7f7f7f] font-semibold text-sm leading-5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className="mt-2 rounded-xl shadow-[3px_3px_5px_rgba(0,0,0,0.1)] p-3 w-full text-sm"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <span
                  className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-600 cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-[#002544] text-white font-semibold text-sm leading-5 rounded-xl px-6 py-3"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
