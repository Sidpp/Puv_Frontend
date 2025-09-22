import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  FaFolderOpen,
  FaProjectDiagram,
  FaSitemap,
  FaHome,
  FaBrain,
  FaBell,
  FaUserEdit,
  FaTasks,
  FaCog,
  FaKey,
  FaUserCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import * as Avatar from "@radix-ui/react-avatar"; // ✅ Add this if not yet imported
import { logout } from "../../../services/oprations/authAPI";

// Helper function for fallback initials
const getInitials = (name) => {
  if (!name) return "U";
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
};

const Sidebar = () => {
  const { user } = useSelector((state) => state.profile);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOnSettingsRoute = pathname.startsWith("/dashboard/settings");

  const [isSettingsOpen, setIsSettingsOpen] = useState(isOnSettingsRoute);
  const isOnWorkstreamRoute = pathname.startsWith("/dashboard/workstream");
  const [isWorkstreamOpen, setIsWorkstreamOpen] = useState(isOnWorkstreamRoute);

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  useEffect(() => {
    if (isOnSettingsRoute) {
      setIsSettingsOpen(true);
    }
  }, [pathname, isOnSettingsRoute]);

  useEffect(() => {
    if (isOnSettingsRoute) {
      setIsSettingsOpen(true);
    }
    if (isOnWorkstreamRoute) {
      setIsWorkstreamOpen(true);
    }
  }, [pathname, isOnSettingsRoute, isOnWorkstreamRoute]);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  const mainLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <FaHome className="w-5 h-5" />,
      exact: true,
    },
    // {
    //   to: "/dashboard/workstream",
    //   label: "Workstream",
    //   icon: <FaTasks className="w-5 h-5" />,
    // },
    {
      to: "/dashboard/insights",
      label: "AI Insights",
      icon: <FaBrain className="w-5 h-5" />,
    },
    {
      to: "/dashboard/notification",
      label: "Notification",
      icon: <FaBell className="w-5 h-5" />,
    },
  ];

  const settingsLinks = [
    {
      to: "/dashboard/settings/profile-management",
      label: "Profile Management",
      icon: <FaUserEdit className="w-5 h-5" />,
    },
    {
      to: "/dashboard/settings/password-authentication",
      label: "Password & Authentication",
      icon: <FaKey className="w-5 h-5" />,
    },
    ...(user?.role === "Admin"
      ? [
          {
            to: "/dashboard/settings/user-management",
            label: "User Management",
            icon: <FaUserCog className="w-5 h-5" />,
          },
        ]
      : []),
  ];

  const workStreamLinks = [
    {
      to: "/dashboard/workstream/portfolio",
      label: "Portfolio",
      icon: <FaFolderOpen className="w-5 h-5" />,
    },
    {
      to: "/dashboard/workstream/program",
      label: "Program",
      icon: <FaSitemap className="w-5 h-5" />,
    },
    {
      to: "/dashboard/workstream/project",
      label: "Project",
      icon: <FaProjectDiagram className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className={`lg:hidden fixed top-6 left-3 z-50 p-2 [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.6))] ${
          isMobileNavOpen ? "hidden" : "block"
        }`}
        onClick={() => setIsMobileNavOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={25} />
      </button>

      {/* Sidebar */}
      <div
        className={`h-full w-56 bg-[#00254D] text-white flex flex-col justify-between gap-4 px-4 py-8 rounded-r-3xl text-base 
              fixed lg:static lg:translate-x-0 z-40
              transition-transform duration-300 ease-in-out
              ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"}
              overflow-y-auto max-h-screen`}
      >
        <div>
          {/* Close button for mobile view */}
          <button
            className="lg:hidden absolute top-1 right-4 p-2"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col gap-4 mt-10 lg:mt-0">
            {/* Main Navigation */}
            {mainLinks.map(({ to, label, icon, exact }) => (
              <NavLink
                key={label}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 transition rounded-full ${
                    isActive
                      ? "border border-white"
                      : "text-white hover:bg-[#003366]"
                  }`
                }
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}

            {/* Workstream Toggle */}
            <button
              onClick={() => setIsWorkstreamOpen((prev) => !prev)}
              className="flex items-center gap-3 px-4 py-2 font-semibold text-white focus:outline-none"
            >
              <FaTasks className="w-5 h-5" />
              <span>Workstream</span>
              {isWorkstreamOpen ? (
                <ChevronUp size={18} className="ml-auto" />
              ) : (
                <ChevronDown size={18} className="ml-auto" />
              )}
            </button>

            {/* Workstream Submenu */}
            {isWorkstreamOpen && (
              <div className="ml-8 flex text-sm flex-col gap-2">
                {workStreamLinks.map(({ to, label, icon }) => (
                  <NavLink
                    key={label}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 transition ${
                        isActive
                          ? "rounded-full border border-white"
                          : "text-white hover:bg-[#003366]"
                      }`
                    }
                  >
                    {icon}
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            )}

            {/* Settings Toggle */}
            <button
              onClick={() => setIsSettingsOpen((prev) => !prev)}
              className="flex items-center gap-3 px-4 py-2 font-semibold text-white focus:outline-none"
            >
              <FaCog className="w-5 h-5" />
              <span>Settings</span>
              {isSettingsOpen ? (
                <ChevronUp size={18} className="ml-auto" />
              ) : (
                <ChevronDown size={18} className="ml-auto" />
              )}
            </button>

            {/* Settings Submenu */}
            {isSettingsOpen && (
              <div className="ml-8 flex text-sm flex-col gap-2">
                {settingsLinks.map(({ to, label, icon }) => (
                  <NavLink
                    key={label}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 transition ${
                        isActive
                          ? "rounded-full border border-white"
                          : "text-white hover:bg-[#003366]"
                      }`
                    }
                  >
                    {icon}
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- ✅ USER AVATAR BUTTON AND LOGOUT AT THE BOTTOM --- */}
        <div className="flex flex-col gap-4 px-4">
          {/* Avatar & name */}
          <button
            onClick={() => navigate("/dashboard/settings/profile-management")}
            className="flex items-center gap-2 "
          >
            <Avatar.Root className="h-9 w-9 shrink-0 -ml-2">
              <Avatar.Image
                className="h-full w-full rounded-full object-cover"
                src={user?.image}
                alt={user?.name}
              />
              <Avatar.Fallback className="flex items-center justify-center h-full w-full rounded-full text-[#012950] bg-[#f3f7f6] font-semibold">
                {getInitials(user?.name)}
              </Avatar.Fallback>
            </Avatar.Root>
            <span className="hidden sm:inline font-semibold text-sm text-white">
              {user?.name || "User"}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white text-sm hover:text-red-300 transition-colors "
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileNavOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileNavOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
