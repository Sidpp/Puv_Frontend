import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLeftPanel from "../../components/Auth/AuthLeftPanel";
import AuthRightPanel from "../../components/Auth/AuthRightPanel";
import { sendOtp } from "../../services/oprations/authAPI";
import { setSigninData } from "../../slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSendOtp = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    // Save the data for use in OTP verification
    dispatch(setSigninData({ email, password }));

    // Send OTP and navigate to /verify-email
    dispatch(sendOtp(email,password, navigate));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <AuthLeftPanel />
      <AuthRightPanel>
        <h2 className="text-center text-xl font-semibold mb-6">
          Sign in to your account
        </h2>

        <form className="space-y-5" onSubmit={handleSendOtp}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="demo@gmail.com"
              className="w-full border px-4 py-2 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="******"
              className="w-full border px-4 py-2 rounded-md shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#04254d] text-white py-2 rounded-full font-semibold hover:bg-[#0c1c5c]"
          >
            Send OTP
          </button>

          <div className="text-center mt-2">
            <Link
              to="/forgot-password"
              className="text-[#04254d] font-semibold text-sm hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </AuthRightPanel>
    </div>
  );
};

export default Login;
