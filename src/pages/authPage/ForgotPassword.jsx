import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import AuthLeftPanel from "../../components/Auth/AuthLeftPanel";
import AuthRightPanel from "../../components/Auth/AuthRightPanel";
import { getPasswordResetToken } from "../../services/oprations/authAPI";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return;

    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  const handleResend = () => {
    if (!email) return;

    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <AuthLeftPanel />
      <AuthRightPanel>
        <h2 className="text-center text-xl font-semibold mb-1">
          Forgot password
        </h2>

        {emailSent ? (
          <div className="space-y-4 mt-4 text-center">
            <p className="text-[#04254d] text-md font-medium">
              Reset link sent to your email.
            </p>
            <button
              type="button"
              onClick={handleResend}
              className="w-full bg-[#04254d] text-white py-2 rounded-full font-semibold hover:bg-[#0c1c5c]"
            >
              Resend Link
            </button>
            <div className="mt-2">
              <Link
                to="/"
                className="text-[#04254d] font-semibold text-sm hover:underline"
              >
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <p className="text-center text-sm text-gray-600 mb-6">
              Please enter your email address
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@gmail.com"
                className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#04254d] text-white py-2 rounded-full font-semibold hover:bg-[#0c1c5c]"
            >
              Request reset link
            </button>

            <div className="text-center mt-2">
              <Link
                to="/"
                className="text-[#04254d] font-semibold text-sm hover:underline"
              >
                Back to login
              </Link>
            </div>
          </form>
        )}
      </AuthRightPanel>
    </div>
  );
};

export default ForgotPassword;
