import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import NotificationPopup from "./NotificationPopup";
import icon from "../../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import logo from "../../../assets/PortfolioVue_logo.png";
import SearchComponent from "./SearchComponent";
import { getNotification } from "../../../services/oprations/authAPI";
import { markJiraAlertRead } from "../../../services/oprations/jiraAPI";
import { markGoogleAlertRead } from "../../../services/oprations/googleAPI";

// const BASE_URL = process.env.REACT_APP_BASE_URL.replace("/api", "");
// const socket = io(BASE_URL, {
//   transports: ["websocket", "polling"],
//   path: "/socket.io",
// });

const BASE_URL = process.env.REACT_APP_SOCKET_URL;
const socket = io(BASE_URL, {
  transports: ["websocket", "polling"],
  path: "/socket.io",
});

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const { user } = useSelector((state) => state.profile);
  const notificationRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRead, setIsRead] = useState(false);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  //-------------------------------------------------------------
  const [isConnected, setIsConnected] = useState(socket.connected);
  useEffect(() => {
    // Request notification permission
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Socket listeners
    const handleConnect = () => {
      console.log("Connected to server ✅");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from server ❌");
      setIsConnected(false);
    };
    //old
    // const handleNewNotification = (notif) => {
    //   console.log("New notification:", notif);
    //   setAlerts((prev) => {
    //     const updatedAlerts = [notif, ...prev];
    //     setNotificationCount(updatedAlerts.length);
    //     return updatedAlerts;
    //   });

    //   if (Notification.permission === "granted") {
    //     const desktopNotif = new Notification(
    //       notif.alert_type || "New Notification",
    //       {
    //         body: notif.message,
    //         icon: icon,
    //       }
    //     );
    //     desktopNotif.onclick = () => {
    //       window.focus();
    //       const path =
    //         notif.source === "Jira"
    //           ? `/dashboard/insights/jira-details/${notif.id || notif.alert_id}`
    //           : `/dashboard/insights/google-details/${
    //               notif.id || notif.alert_id
    //             }`;
    //       window.location.href = path;
    //     };
    //   }
    // };

    const handleNewNotification = (notif) => {
      console.log("New popup (raw):", notif);

      // Always push to alerts (raw state)
      setAlerts((prev) => {
        const updatedAlerts = [notif, ...prev];
        //  setNotificationCount((prev) => (prev ?? 0) + 1);
        return updatedAlerts;
      });

      // Show desktop notif only if it passes filter
      if (shouldShowNotif(notif) && Notification.permission === "granted") {
        const desktopNotif = new Notification(
          notif.alert_type || "New Notification",
          {
            body: notif.message,
            icon: icon,
          }
        );

        // desktopNotif.onclick = () => {
        //   window.focus();
        //   const path =
        //     notif.source === "Jira"
        //       ? `/dashboard/insights/jira-details/${notif.id || notif.alert_id}`
        //       : `/dashboard/insights/google-details/${
        //           notif.id || notif.alert_id
        //         }`;
        //   window.location.href = path;
        // };

        desktopNotif.onclick = async () => {
          window.focus();

          try {
            if (notif.source === "Jira") {
              await dispatch(markJiraAlertRead(notif._id, notif.alert_id));
              window.location.href = `/dashboard/insights/jira-details/${
                notif.id || notif.alert_id
              }`;
            } else {
              await dispatch(markGoogleAlertRead(notif._id, notif.alert_id));
              window.location.href = `/dashboard/insights/google-details/${
                notif.id || notif.alert_id
              }`;
            }
          } catch (error) {
            console.error("Failed to mark alert as read:", error);
            // fallback to navigation even if marking fails
            const path =
              notif.source === "Jira"
                ? `/dashboard/insights/jira-details/${
                    notif.id || notif.alert_id
                  }`
                : `/dashboard/insights/google-details/${
                    notif.id || notif.alert_id
                  }`;
            window.location.href = path;
          }

        };
        
      }
    };

    const handleDeleteNotification = (id) => {
      setAlerts((prev) =>
        prev.filter((n) => n._id !== id && n.alert_id !== id)
      );
    };

    const handleUpdateNotification = (updatedNotif) => {
      setAlerts((prev) =>
        prev.map((n) =>
          n._id === updatedNotif._id || n.alert_id === updatedNotif.alert_id
            ? updatedNotif
            : n
        )
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("new-notification", handleNewNotification);
    socket.on("delete-notification", handleDeleteNotification);
    socket.on("update-notification", handleUpdateNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("new-notification", handleNewNotification);
      socket.off("delete-notification", handleDeleteNotification);
      socket.off("update-notification", handleUpdateNotification);
    };
  }, []);
  //-----------------------------------------------------------------
  //old
  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const res = await dispatch(getNotification()); // res = array of notifications
  //       console.log("res", res);

  //       if (res.length > 0) {
  //         // Sort by latest first
  //         res.sort(
  //           (a, b) =>
  //             new Date(b.timestamp || b.alert_timestamp) -
  //             new Date(a.timestamp || a.alert_timestamp)
  //         );

  //         if (user?.projectrole === "Team Leader") {
  //           let filtered = res.filter(
  //             (notif) => notif.role?.toLowerCase().trim() === "team leader"
  //           );

  //           const googleIds = user?.assignGoogleProjects || [];
  //           const jiraIds = user?.assignJiraProjects || [];

  //           filtered = filtered.filter((notif) => {
  //             if (notif.source === "Google") {
  //               return (
  //                 googleIds.includes(notif.project) ||
  //                 googleIds.includes(notif._id)
  //               );
  //             }
  //             if (notif.source === "Jira") {
  //               return (
  //                 jiraIds.includes(notif.project) || jiraIds.includes(notif._id)
  //               );
  //             }
  //             return false;
  //           });

  //           setAlerts(filtered);
  //           setNotificationCount(filtered.length);
  //         } else {
  //           setAlerts(res);
  //           setNotificationCount(res.length);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Failed to load notifications", error);
  //     }
  //   };
  //   if (user) fetchNotifications();
  // }, [dispatch, user,navigate]);

  // ---- Helper functions (place inside Notifications component, above useEffect) ----
  const hasSourceAccess = (notif) => {
    if (!notif || !notif.source) return false;

    if (notif.source === "Jira") {
      const hasCred = !!user?.jira_credential_id;
      const assigned =
        Array.isArray(user?.assignJiraProjects) &&
        user.assignJiraProjects.length > 0 &&
        (user.assignJiraProjects.includes(notif.project) ||
          user.assignJiraProjects.includes(notif._id));
      return hasCred || assigned;
    }

    if (notif.source === "Google") {
      const hasCred = !!user?.google_credential_id;
      const assigned =
        Array.isArray(user?.assignGoogleProjects) &&
        user.assignGoogleProjects.length > 0 &&
        (user.assignGoogleProjects.includes(notif.project) ||
          user.assignGoogleProjects.includes(notif._id));
      return hasCred || assigned;
    }

    return false;
  };

  const roleMatches = (notif) => {
    // only show if both user.projectrole and notif.role exist and match
    if (!user?.projectrole) return false;
    if (!notif?.role) return false;
    return (
      notif.role.toString().toLowerCase().trim() ===
      user.projectrole.toString().toLowerCase().trim()
    );
  };

  const shouldShowNotif = (notif) => {
    // 1) source must be allowed by credentials or assigned projects
    if (!hasSourceAccess(notif)) return false;
    // 2) role must exist and match user's role
    if (!roleMatches(notif)) return false;
    return true;
  };
  // ---- end helpers ----

  //work
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await dispatch(getNotification());
        if (!res || res.length === 0) {
          setAlerts([]);
          // setNotificationCount(null);
          return;
        }

        // sort by timestamp
        res.sort(
          (a, b) =>
            new Date(b.timestamp || b.alert_timestamp) -
            new Date(a.timestamp || a.alert_timestamp)
        );

        // apply filter that enforces: source allowed AND role match
        const filtered = res.filter((notif) => shouldShowNotif(notif));

        setAlerts((prev) => {
          const existingIds = new Set(prev.map((n) => n._id || n.alert_id));

          // merge new API notifs with socket notifs (without duplicates)
          const merged = [
            ...filtered,
            ...prev.filter((n) => !existingIds.has(n._id || n.alert_id)),
          ];

          // sort again so newest always on top
          merged.sort(
            (a, b) =>
              new Date(b.timestamp || b.alert_timestamp) -
              new Date(a.timestamp || a.alert_timestamp)
          );

          return merged;
        });

        // setAlerts(filtered);
        // setNotificationCount(filtered.length);
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };

    fetchNotifications();
  }, [dispatch, user, navigate]);

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const res = await dispatch(getNotification());
  //       if (!res || res.length === 0) {
  //         setAlerts([]);
  //         setNotificationCount(null);
  //         return;
  //       }

  //       // sort by timestamp
  //       res.sort(
  //         (a, b) =>
  //           new Date(b.timestamp || b.alert_timestamp) -
  //           new Date(a.timestamp || a.alert_timestamp)
  //       );

  //       // apply filter (source allowed + role match)
  //       const filtered = res.filter((notif) => shouldShowNotif(notif));

  //       // find new notifications compared to current alerts
  //       const newNotifs = filtered.filter(
  //         (n) => !alerts.some((a) => (a.id || a.alert_id) === (n.id || n.alert_id))
  //       );

  //       // show desktop notifications for new ones
  //       // newNotifs.forEach((notif) => {

  //       //   if (Notification.permission === "granted") {
  //       //     const desktopNotif = new Notification(
  //       //       notif.alert_type || "New Notification",
  //       //       {
  //       //         body: notif.message,
  //       //         icon: icon,
  //       //       }
  //       //     );
  //       //     desktopNotif.onclick = () => {
  //       //       window.focus();
  //       //       const path =
  //       //         notif.source === "Jira"
  //       //           ? `/dashboard/insights/jira-details/${notif.id || notif.alert_id}`
  //       //           : `/dashboard/insights/google-details/${notif.id || notif.alert_id}`;
  //       //       window.location.href = path;
  //       //     };
  //       //   }
  //       // });

  //       // update state
  //       setAlerts(filtered);
  //       setNotificationCount(filtered.length);
  //     } catch (error) {
  //       console.error("Failed to load notifications", error);
  //     }
  //   };

  //   // fetch immediately
  //   fetchNotifications();

  //   // refresh every 5 sec
  //   const intervalId = setInterval(fetchNotifications, 5000);

  //   return () => clearInterval(intervalId);
  // }, [dispatch, user, navigate, alerts]);

  useEffect(() => {
    setFilteredNotifications(
      alerts.filter((n) => {
        const isReadBool = n.readed === true || n.readed === "true";
        return isRead ? isReadBool : !isReadBool;
      })
    );
  }, [alerts, isRead]);

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
              {filteredNotifications.length}
            </span>
          </button>

          {showNotifications && (
            <div ref={notificationRef} className="absolute right-0 mt-2 z-50">
              <NotificationPopup
                onClose={() => setShowNotifications(false)}
                alerts={filteredNotifications}
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
