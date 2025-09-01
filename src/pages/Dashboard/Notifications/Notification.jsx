import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faExclamationTriangle,
  faThumbtack,
  faCheckSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../../assets/logo.png";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNotification,
  getNotification,
} from "../../../services/oprations/authAPI";
import { useNavigate } from "react-router-dom";
import { createFeedback } from "../../../services/oprations/feedbackAPI";
import toast from "react-hot-toast";
import {
  markJiraAlertRead,
  updateJiraAlertStatus,
} from "../../../services/oprations/jiraAPI";
import {
  markGoogleAlertRead,
  updateGoogleAlertStatus,
} from "../../../services/oprations/googleAPI";

const sourceStyles = {
  Jira: "bg-red-100 text-red-600",
  Google: "bg-blue-100 text-blue-600",
};

export default function Notifications() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [latestNotif, setLatestNotif] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    notifId: null,
  });
  const [feedbackText, setFeedbackText] = useState("");
  const [isRead, setIsRead] = useState(false);

  // after notifications state
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  // whenever notifications or isRead changes, filter
  useEffect(() => {
    setFilteredNotifications(
      notifications.filter((n) => {
        const isReadBool = n.readed === true || n.readed === "true";
        return isRead ? isReadBool : !isReadBool;
      })
    );
  }, [notifications, isRead]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  const showDesktopNotification = (notif) => {
    if (Notification.permission === "granted") {
      const notification = new Notification(
        notif.alert_type || "New Notification",
        {
          body: notif.message,
          icon: logo,
        }
      );

      notification.onclick = async () => {
        window.focus();

        if (!notif) return;

        if (notif.source === "Jira") {
          await dispatch(markJiraAlertRead(notif._id, notif.alert_id));
          window.location.href = `/dashboard/insights/jira-details/${
            notif._id || notif.id
          }`;
        } else if (notif.source === "Google") {
          await dispatch(markGoogleAlertRead(notif._id, notif.alert_id));
          window.location.href = `/dashboard/insights/google-details/${
            notif._id || notif.id
          }`;
        }

        notification.close();
      };
    }
  };

useEffect(() => {
  let intervalId;
  let lastShownIdRef = null; 

  const fetchNotifications = async () => {
    try {
      const res = await dispatch(getNotification());
      if (res.length > 0) {
        res.sort(
          (a, b) =>
            new Date(b.timestamp || b.alert_timestamp) -
            new Date(a.timestamp || a.alert_timestamp)
        );

        // Filtering for Team Leader
        let filtered = res;
        if (user?.projectrole === "Team Leader") {
          filtered = res.filter(
            (notif) => notif.role?.toLowerCase().trim() === "team leader"
          );

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
                jiraIds.includes(notif.project) ||
                jiraIds.includes(notif._id)
              );
            }
            return false;
          });
        }

        setLatestNotif(filtered);
        setNotifications(filtered);

        // ✅ Show desktop notif only for new ones
        const latestNew = filtered[0];
        if (latestNew && lastShownIdRef !== latestNew._id) {
          showDesktopNotification(latestNew);
          lastShownIdRef = latestNew._id;
        }
      }
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  if (user) {
    fetchNotifications();
    intervalId = setInterval(fetchNotifications, 5000);
  }
  return () => clearInterval(intervalId);
}, [dispatch, user]); // ✅ no notifications/latestNotif


  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      toast.error("Feedback cannot be empty");
      return;
    }

    const res = await dispatch(
      createFeedback({
        userid: user._id,
        feedback: feedbackText,
        for: `Notification - ${feedbackModal.notifId}`,
      })
    );

    if (res.success) {
      toast.success("Feedback submitted successfully!");
      setFeedbackText("");
      setIsModalOpen(false);
    } else {
      toast.error("Failed to submit feedback");
    }
  };

  const handleApprove = async (notif) => {
    try {
      console.log("notif", notif._id, notif.alert_id, notif.source);
      // choose API based on source
      if (notif.source === "Jira") {
        await dispatch(
          updateJiraAlertStatus(notif._id, notif.alert_id, "approved")
        );
      } else if (notif.source === "Google") {
        await dispatch(
          updateGoogleAlertStatus(notif._id, notif.alert_id, "approved")
        );
      }

      // optimistic UI update
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notif._id
            ? { ...n, alertapproved: true, alertrejected: false }
            : n
        )
      );
      toast.success("Approved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error approving");
    }
  };

  const handleReject = (notif) => {
    setFeedbackModal({ isOpen: true, notifId: notif._id });
    setIsModalOpen(true);
  };

  const confirmReject = async () => {
    try {
      const notif = notifications.find((n) => n._id === feedbackModal.notifId);
      if (!notif) return;

      if (notif.source === "Jira") {
        await dispatch(
          updateJiraAlertStatus(notif._id, notif.alert_id, "rejected")
        );
      } else if (notif.source === "Google") {
        await dispatch(
          updateGoogleAlertStatus(notif._id, notif.alert_id, "rejected")
        );
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notif._id
            ? { ...n, alertapproved: false, alertrejected: true }
            : n
        )
      );

      setIsModalOpen(false);
      toast.success("Rejected successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error rejecting");
    }
  };

  const handleClick = async (notif) => {
    if (!notif) return;

    if (notif.source === "Jira") {
      await dispatch(markJiraAlertRead(notif._id, notif.alert_id));
      navigate(`/dashboard/insights/jira-details/${notif._id || notif.id}`);
    } else if (notif.source === "Google") {
      await dispatch(markGoogleAlertRead(notif._id, notif.alert_id));
      navigate(`/dashboard/insights/google-details/${notif._id || notif.id}`);
    }
  };

  const handleDelete = async (notif) => {
    try {
      await dispatch(
        deleteNotification(notif._id, notif.source, notif.alert_id)
      );

      // Optimistic UI update
      setNotifications((prev) => prev.filter((n) => n._id !== notif._id));

      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification", error);
      toast.error("Failed to delete notification");
    }
  };

  if (!latestNotif) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#0c2e55] mb-6">
          Welcome Back, {user?.name}
        </h1>
        <p className="text-gray-500 text-sm">No notifications found.</p>
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white font-sans text-gray-800">
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#0c2e55] mb-6">
        Welcome Back, {user?.name}
      </h1>

      <section className="mb-4">
        <div className="flex items-center justify-between mb-2">
          {/* Left side - title */}
          <span className="text-lg font-semibold text-gray-700">
            Notifications
          </span>

          {/* Right side - switch */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Unread</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isRead}
                onChange={() => setIsRead(!isRead)}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full  "></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-[#00254D] rounded-full transition-transform peer-checked:translate-x-5"></div>
            </label>
            <span className="text-sm text-gray-600">Read</span>
          </div>
        </div>
      </section>

      <section className="divide-y divide-gray-300">
        {filteredNotifications.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No {isRead ? "read" : "unread"} notifications found.
          </p>
        ) : (
          filteredNotifications.map((notif) => (
            <article
              key={notif.id}
              className="py-4 hover:bg-gray-50 transition rounded-md px-2"
            >
              {/* Main clickable content */}
              <div onClick={() => handleClick(notif)}>
                {/* Top row with type, source, and time */}
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1"
                    aria-hidden="true"
                  ></span>
                  <h2 className="text-blue-900 text-base font-medium">
                    {notif.alert_type}
                  </h2>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sourceStyles[notif.source] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {notif.source}
                  </span>

                  {/* Time on right side */}
                  {(notif.alert_timestamp || notif.timestamp) && (
                    <span className="ml-auto flex items-center gap-1 text-sm text-gray-700">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-gray-500"
                      />
                      {new Date(
                        notif.alert_timestamp || notif.timestamp
                      ).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Message row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 text-[15px]">
                  <FontAwesomeIcon
                    icon={
                      notif.alert_type === "Critical"
                        ? faBullhorn
                        : notif.alert_type === "Warning"
                        ? faExclamationTriangle
                        : notif.alert_type === "Stalled"
                        ? faThumbtack
                        : notif.alert_type === "Completed"
                        ? faCheckSquare
                        : faExclamationTriangle
                    }
                    className="text-red-600"
                  />
                  <p className="text-gray-900 font-semibold">{notif.message}</p>
                </div>

                {/* Action required */}
                {notif.action_required && (
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Action Required:</strong> {notif.action_required}
                  </p>
                )}

                {/* Right side Delete button (only if Read) */}
                {isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ Prevent parent click
                      handleDelete(notif);
                    }}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </section>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-[400px] p-6 relative">
            <h2 className="text-lg font-bold mb-4">Submit Feedback</h2>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write your feedback here..."
              className="w-full h-32 p-2 border border-gray-300 rounded mb-4 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleSubmitFeedback();
                  await confirmReject();
                }}
                className="px-5 py-2 rounded-full text-white font-medium shadow-md 
             bg-gradient-to-r from-red-500 via-red-600 to-red-700 
             hover:from-red-600 hover:via-red-700 hover:to-red-800 
             transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Submit & Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
