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
import { getJiraAllIssuesByAssign, markJiraAlertRead } from "../../../services/oprations/jiraAPI";
import { markGoogleAlertRead } from "../../../services/oprations/googleAPI";

// const BASE_URL = process.env.REACT_APP_BASE_URL.replace("/api", "");
// const socket = io(BASE_URL, {
//   transports: ["websocket", "polling"],
//   path: "/socket.io",
// });

const newLogo = "https://demo.portfolio-vue.com/static/media/PortfolioVue_logo.8efcdb20091b196009ee.png" || logo
const BASE_URL = process.env.REACT_APP_SOCKET_URL;
const socket = io(BASE_URL, {
  transports: ["websocket", "polling"],
  path: "/socket.io",
});

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [jiraData,setJiraData] = useState([]);
  const { user } = useSelector((state) => state.profile);
  const notificationRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRead, setIsRead] = useState(false);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  //-------------------------------------------------------------
  const [isConnected, setIsConnected] = useState(socket.connected);

  const hasSourceAccess = (notif) => {
    const notifProjectId = notif._id || notif.id;
    // console.log("notif", notif);

    // console.log("id", notifProjectId);

    if (user?.role === "User") {
    //  // console.log("role user", user?.role);
    //   if (notif?.source === "Jira" && user?.projectrole !== "Portfolio Manager") {
    //    // console.log("notif source", notif?.source);
    //     // normalize assigned projects (both Jira & Google) into one array
    //    // console.log("asssifn projets1", user?.assignJiraProjects);
    //     const assignedProjects = [...(user?.assignJiraProjects || [])];
    //    // console.log("asssifn projets", assignedProjects);

    //     // ✅ check if notifProjectId exists in user's assigned projects
    //     const isAssigned =
    //       assignedProjects.length > 0 &&
    //       assignedProjects.some(
    //         (proj) => proj?.toString() === notifProjectId?.toString()
    //       );

    //    // console.log("isassign", isAssigned);

    //     if (!isAssigned) return false; // block if user isn’t assigned to this project
    //    // console.log("last", isAssigned);
    //   }
          if (
        notif?.source === "Jira" &&
        user?.projectrole !== "Portfolio Manager"
      ) {
        // normalize assigned projects (both Jira & Google) into one array
        const assignedProjects = [
          ...(jiraData?.map((issue) => issue._id?.toString()) || []),
        ];
        //console.log("jira data",assignedProjects)

        // ✅ check if notifProjectId exists in user's assigned projects
        const isAssigned =
          assignedProjects.length > 0 &&
          assignedProjects.some(
            (proj) => proj?.toString() === notifProjectId?.toString()
          );
        if (!isAssigned) return false; // block if user isn’t assigned to this project
      }

      switch (user?.projectrole) {
        case "Portfolio Manager":
          // show all Google + Jira alerts for same role
          if (notif.source === "Google") {
            // only Google alerts for same role
            return notif.role === "Portfolio Manager";
          }
          if (notif.source === "Jira") {
            // show all Jira alerts
            return true;
          }
          return false;

        case "Program Manager":
          // only Google alerts for Program Manager
          return notif.role === "Program Manager" && notif.source === "Google";

        case "Project Manager":
          if (user?.source === "Google") {
            return (
              notif.role === "Project Manager" && notif.source === "Google"
            );
          } else {
            return notif.role === "Project Manager" && notif.source === "Jira";
          }

        case "Executive":
          // only Google notifications for Executives
          return notif.role === "Executive" && notif.source === "Google";

        default:
          // fallback → Jira issues for Team Leader
          return notif.role === "Team Leader" && notif.source === "Jira";
      }
    } else {
      // Non-User roles (Admin, etc.)
      if (user?.google_credential_id && user?.jira_credential_id) {
        // user has both → allow both sources
        return notif.source === "Google" || notif.source === "Jira";
      }

      if (user?.google_credential_id) {
        return notif.source === "Google";
      }

      if (user?.jira_credential_id) {
        return notif.source === "Jira";
      }

      // fallback (no credentials, maybe admin or system)
      return true;
    }
  };

    useEffect(() => {
      const fetchJira = async () => {
        try {
          if (
            user?.projectrole === "Team Leader" ||
            user?.projectrole === "Project Manager"
          ) {
            const projects = user?.assignJiraProject || [];
  
            if (!projects.length) {
              setJiraData([]);
              return;
            }
  
            const issues = await dispatch(getJiraAllIssuesByAssign(projects));
  
            setJiraData(issues || []);
            //console.log("data..",jiraData,issues)
          }
        } catch (error) {
          // console.error("Failed to fetch Jira issues:", error);
          setJiraData([]);
        }
      };
  
      fetchJira();
    }, [dispatch, user]);

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
    //   console.log("New popup (raw):", notif);

    //   // Always push to alerts (raw state)
    //   setAlerts((prev) => {
    //     const updatedAlerts = [notif, ...prev];
    //     //  setNotificationCount((prev) => (prev ?? 0) + 1);
    //     return updatedAlerts;
    //   });

    //   if (Notification.permission === "granted") {

    //     const desktopNotif = new Notification(notif.alert_type || "New Notification",          {
    //         body: notif.message,
    //         icon: icon,
    //       });
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

    // Keep a map of notifId → notif payload
    const notifMap = new Map();

    // const handleNewNotification = (notif) => {
    //   //console.log("New popup (raw):", notif);

    //  //---------new added start------------

    //   // Always push to alerts state
    //    //setAlerts((prev) => [notif, ...prev]);
    //   if ( Notification.permission === "granted") {
    //     const title = notif.alert_type || "New Notification";

    //     // Unique id for this notification
    //     const notifId = `${Date.now()}-${Math.random()}`;
    //     notifMap.set(notifId, notif);

    //     const desktopNotif = new Notification(title, {
    //       body: notif.message,
    //       icon: icon,
    //       tag: notifId, // use tag to identify
    //     });

    //     desktopNotif.onclick = (event) => {
    //       window.focus();

    //       const clickedId = event.currentTarget.tag;
    //       const clickedNotif = notifMap.get(clickedId);

    //       if (!clickedNotif) {
    //         // console.warn("Notification payload not found:", clickedId);
    //         return;
    //       }

    //       const path =
    //         clickedNotif.source === "Jira"
    //           ? `/dashboard/insights/jira-details/${
    //               clickedNotif.id || clickedNotif.alert_id
    //             }`
    //           : `/dashboard/insights/google-details/${
    //               clickedNotif.id || clickedNotif.alert_id
    //             }`;

    //       // cleanup after click
    //       notifMap.delete(clickedId);

    //       window.location.href = path;
    //     };

    //     desktopNotif.onclose = () => {
    //       // cleanup when user closes without clicking
    //       notifMap.delete(notifId);
    //     };
    //   }
    // };

    const handleNewNotification = (notif) => {
      console.log("New popup (raw):", notif);

      // check if this notif should be visible
      if (!hasSourceAccess(notif)) return;

      // Always push to alerts state
      setAlerts((prev) => [notif, ...prev]);

      if (Notification.permission === "granted") {
        const title = notif.alert_type || "New Notification";

        // Unique id for this notification
        const notifId = `${Date.now()}-${Math.random()}`;
        notifMap.set(notifId, notif);

        const desktopNotif = new Notification(title, {
          body: notif.message,
          icon: icon,
          tag: notifId, // use tag to identify
        });

        desktopNotif.onclick = (event) => {
          window.focus();

          const clickedId = event.currentTarget.tag;
          const clickedNotif = notifMap.get(clickedId);

          if (!clickedNotif) {
            // console.warn("Notification payload not found:", clickedId);
            return;
          }

          const path =
            clickedNotif.source === "Jira"
              ? `/dashboard/insights/jira-details/${
                  clickedNotif.id || clickedNotif.alert_id
                }`
              : `/dashboard/insights/google-details/${
                  clickedNotif.id || clickedNotif.alert_id
                }`;

          // cleanup after click
          notifMap.delete(clickedId);

          window.location.href = path;
        };

        desktopNotif.onclose = () => {
          // cleanup when user closes without clicking
          notifMap.delete(notifId);
        };
      }
    };

    // const handleNewNotification = (notif) => {
    //   console.log("New popup (raw):", notif);

    //   // Normalize: always work with an array
    //   const notifs = Array.isArray(notif) ? notif : [notif];

    //   // Filter out invalid or unauthorized alerts
    //   const validNotifs = notifs.filter(
    //     (n) => n?.alert_type && n?.message && hasSourceAccess(n)
    //   );
    //   if (!validNotifs.length) return;

    //   // Push all to state
    //   setAlerts((prev) => [...validNotifs, ...prev]);

    //   if (Notification.permission === "granted") {
    //     if (validNotifs.length === 1) {
    //       // === Single alert ===
    //       const n = validNotifs[0];
    //       const title = n.alert_type || "New Notification";
    //       const notifId = `${Date.now()}-${Math.random()}`;
    //       notifMap.set(notifId, n);

    //       const desktopNotif = new Notification(title, {
    //         body: n.message,
    //         icon: icon,
    //         tag: notifId,
    //       });

    //       desktopNotif.onclick = (event) => {
    //         window.focus();
    //         const clickedNotif = notifMap.get(event.currentTarget.tag);
    //         if (!clickedNotif) return;

    //         const path =
    //           clickedNotif.source === "Jira"
    //             ? `/dashboard/insights/jira-details/${
    //                 clickedNotif.id || clickedNotif.alert_id
    //               }`
    //             : `/dashboard/insights/google-details/${
    //                 clickedNotif.id || clickedNotif.alert_id
    //               }`;

    //         notifMap.delete(event.currentTarget.tag);
    //         window.location.href = path;
    //       };

    //       desktopNotif.onclose = () => {
    //         notifMap.delete(notifId);
    //       };
    //     } else {
    //       // === Multiple alerts in same batch ===
    //       const title = `${validNotifs.length} New Alerts`;
    //       const body = validNotifs.map((n) => `• ${n.message}`).join("\n");

    //       const notifId = `${Date.now()}-${Math.random()}`;
    //       notifMap.set(notifId, validNotifs);

    //       const desktopNotif = new Notification(title, {
    //         body,
    //         icon: icon,
    //         tag: notifId,
    //       });

    //       desktopNotif.onclick = () => {
    //         window.focus();
    //         notifMap.delete(notifId);
    //         // Instead of a single alert details page, send to general alerts view
    //         window.location.href = "/dashboard/insights";
    //       };

    //       desktopNotif.onclose = () => {
    //         notifMap.delete(notifId);
    //       };
    //     }
    //   }
    // };

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
  }, [user,jiraData]);
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
        const filtered = res.filter((notif) => hasSourceAccess(notif));
        //const filtered =res

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
        // console.error("Failed to load notifications", error);
      }
    };

    fetchNotifications();
  }, [dispatch, user, navigate,jiraData]);

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
          src={newLogo}
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
