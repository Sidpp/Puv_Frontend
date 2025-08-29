import React, { useState, useRef, useEffect } from "react";
import NotificationPopup from "./NotificationPopup";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import logo from "../../../assets/PortfolioVue_logo.png";
import SearchComponent from "./SearchComponent";
import { getNotification } from "../../../services/oprations/authAPI";

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const { user } = useSelector((state) => state.profile);
  const notificationRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await dispatch(getNotification());
        if (res) {
          const { jiraData, googleData } = res;

          // Flatten Jira alerts
          const flatJira = Object.entries(jiraData || {}).flatMap(
            ([project, alerts]) =>
              alerts.map((alert, i) => ({
                id: `jira-${project}-${i}`,
                project,
                source: "Jira",
                ...alert,
              }))
          );

          // Flatten Google alerts
          const flatGoogle = Object.entries(googleData || {}).flatMap(
            ([project, alerts]) =>
              alerts.map((alert, i) => ({
                id: `google-${project}-${i}`,
                project,
                source: "Google",
                ...alert,
              }))
          );

          let combined = [...flatJira, ...flatGoogle];

          if (user?.projectrole === "Team Leader") {
            // Step 1: filter by role
            let filtered = combined.filter(
              (notif) => notif.role?.toLowerCase().trim() === "team leader"
            );

            // Step 2: filter by assigned projects
            const googleIds = user?.assignGoogleProjects || [];
            const jiraIds = user?.assignJiraProjects || [];

            filtered = filtered.filter((notif) => {
              if (notif.source === "Google") {
                return (
                  googleIds.includes(notif.project) ||
                  googleIds.includes(notif._id)
                );
              }
              if (notif.source === "Jira") {
                return (
                  jiraIds.includes(notif.project) || jiraIds.includes(notif._id)
                );
              }
              return false;
            });

            console.log(
              "Filtered notifications (Team Leader + assigned projects):",
              filtered
            );

            setAlerts(filtered);
            setNotificationCount(filtered.length);
          } else {
            // Other roles see all
            setAlerts(combined);
            setNotificationCount(combined.length);
          }
        }
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };
    if (user) fetchNotifications();
  }, [dispatch, user]);

  const handleClickOutside = (e) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(e.target)
    ) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { pathname } = useLocation();

  const mainLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/dashboard/insights", label: "AI Insights" },
    { to: "/dashboard/notification", label: "Notification" },
  ];

  const settingsLinks = [
    {
      to: "/dashboard/settings/profile-management",
      label: "Profile Management",
    },
    {
      to: "/dashboard/settings/password-authentication",
      label: "Password & Authentication",
    },
    {
      to: "/dashboard/settings/user-management",
      label: "User Management",
    },
  ];

  const workStreamLinks = [
    {
      to: "/dashboard/workstream/portfolio",
      label: "Portfolio",
    },
    {
      to: "/dashboard/workstream/program",
      label: "Program",
    },
    {
      to: "/dashboard/workstream/project",
      label: "Project",
    },
  ];

  const activeLabel = React.useMemo(() => {
    const allLinks = [...mainLinks, ...settingsLinks, ...workStreamLinks];
    const found = allLinks
      .filter((link) => pathname.startsWith(link.to))
      .sort((a, b) => b.to.length - a.to.length)[0];
    return found ? found.label : "Dashboard";
  }, [pathname, mainLinks, settingsLinks, workStreamLinks]);

  return (
    <header className="bg-[#f3f7f6] px-6 py-4 flex justify-between items-center shadow-sm z-10 w-full">
      {/* Left: Logo + Title */}
      <div className="flex items-center">
        <img
          src={logo}
          alt="PortfolioVue Logo"
          className="h-14 ml-16 sm:-ml-3 rounded-md"
        />
        <h2 className="text-xl ml-0 sm:ml-20 font-semibold text-[#012950] hidden sm:block">
          {activeLabel}
        </h2>
      </div>

      {/* Right: Search + Notification + Profile + Logout */}
      <div className="flex items-center space-x-2">
        {/* Search */}
        {/* <div className="relative hidden md:block mr-3">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search Here......"
            className="pl-10 pr-4 py-2 rounded-full border bg-gray-50 w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          />
        </div> */}

        <div className="hidden md:block mr-3">
          <SearchComponent />
        </div>

        {/* Notification Icon with Popup */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell className="text-[#012950] w-6 h-6" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full">
              {notificationCount}
            </span>
          </button>

          {showNotifications && (
            <div ref={notificationRef} className="absolute right-0 mt-2 z-50">
              <NotificationPopup
                onClose={() => setShowNotifications(false)}
                alerts={alerts}
                setAlerts={setAlerts}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
