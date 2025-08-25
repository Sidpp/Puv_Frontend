import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
//Auth
import Login from "./pages/authPage/Login";
import ForgotPassword from "./pages/authPage/ForgotPassword";
import VerifyEmail from "./pages/authPage/VerifyEmail";
import UpdatePassword from "./pages/authPage/updatePassword";
//Dashboard
import PrivateRoute from "./components/common/PrivateRoute";
import Navbar from "./components/Dashboard/common/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Dashboard/Home/Home";
import Notification from "./pages/Dashboard/Notifications/Notification";

//Setting
import ProfileManagement from "./pages/Dashboard/Settings/ProfileManagement";
import PasswordAuthentication from "./pages/Dashboard/Settings/PasswordAuthentication";
import UserManagement from "./pages/Dashboard/Settings/Admin/UserManagement";
import AddUserForm from "./pages/Dashboard/Settings/Admin/AddUserForm";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "./services/oprations/authAPI";
import Health from "./pages/Dashboard/Workstream/Health";
import AiInsights from "./pages/Dashboard/AiInsights/AiInsights";
import GoogleDetails from "./pages/Dashboard/AiInsights/googleDetails";
import JiraDetails from "./pages/Dashboard/AiInsights/jiraDetails"
import GoogleSummaryPage from "./pages/Dashboard/AiInsights/GoogleSummaryPage";
import JiraSummary from "./pages/Dashboard/AiInsights/JiraSummary";
import JiraSummaryById from "./pages/Dashboard/AiInsights/JiraSummaryById";
import GoogleSummaryPageById from "./pages/Dashboard/AiInsights/GoogleSummaryPageById";

const RedirectIfLoggedIn = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getUserDetails()).then((success) => {
        if (!success) {
          navigate("/");
        }
      });
    }
    console.log("user app", user);
  }, [dispatch]);

  return (
    <Routes>
      {/* Auth-related route */}
      <Route
        path="/"
        element={
          <RedirectIfLoggedIn>
            <Login />
          </RedirectIfLoggedIn>
        }
      />

      {/* Authentication and forget password */}
      <Route path="/update-password/:token" element={<UpdatePassword />} />
      <Route path="/" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <Dashboard />
            </>
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="notification" element={<Notification />} />
        <Route path="insights" element={<AiInsights/>} />
        <Route path="insights/jira-details/:id" element={<JiraDetails/>} />
        <Route path="insights/google-details/:id" element={<GoogleDetails/>} />
        <Route path="insights/jira-summary" element={<JiraSummary/>} />
        <Route path="insights/jira-summary/:id" element={<JiraSummaryById/>} />
        <Route path="insights/google-summary" element={<GoogleSummaryPage/>} />
        <Route path="insights/google-summary/:id" element={<GoogleSummaryPageById/>} />

        <Route path="workstream">
          <Route path="portfolio" element={<Health/>} />
          <Route path="program" element={<Health />} />
          <Route path="project" element={<Health />} />
        </Route>
        <Route path="settings">
          <Route path="profile-management" element={<ProfileManagement />} />
          <Route
            path="password-authentication"
            element={<PasswordAuthentication />}
          />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="user-management/add-user" element={<AddUserForm />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
// My$ecureP@ssw0rd123!
