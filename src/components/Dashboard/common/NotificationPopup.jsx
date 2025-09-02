import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faExclamationTriangle,
  faHourglassHalf,
  faThumbtack,
  faCheckSquare,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { deleteNotification } from "../../../services/oprations/authAPI";
import { useDispatch } from "react-redux";
import { markJiraAlertRead } from "../../../services/oprations/jiraAPI";
import { markGoogleAlertRead } from "../../../services/oprations/googleAPI";

const sourceStyles = {
  Jira: "bg-red-100 text-red-600",
  Google: "bg-blue-100 text-blue-600",
};

export default function NotificationPopup({ onClose, alerts, setAlerts }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handleDelete = async (notif) => {
  //   const res = await dispatch(
  //     deleteNotification({
  //       id: notif._id,
  //       source: notif.source,
  //       message: notif.message,
  //     })
  //   );
  //   if (res.success) {
  //     setAlerts((prev) => prev.filter((a) => a.id !== notif.id));
  //   }
  // };

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

  const getIcon = (type) => {
    switch (type) {
      case "Critical":
        return { icon: faBullhorn, color: "text-red-600", dot: "bg-red-600" };
      case "Warning":
        return {
          icon: faExclamationTriangle,
          color: "text-orange-500",
          dot: "bg-orange-500",
        };
      case "Stalled":
        return {
          icon: faThumbtack,
          color: "text-purple-500",
          dot: "bg-purple-400",
        };
      case "Completed":
        return {
          icon: faCheckSquare,
          color: "text-green-600",
          dot: "bg-green-500",
        };
      case "Deadline Approaching":
        return {
          icon: faHourglassHalf,
          color: "text-yellow-500",
          dot: "bg-yellow-400",
        };
      default:
        return {
          icon: faExclamationTriangle,
          color: "text-gray-500",
          dot: "bg-gray-400",
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 sm:static w-[90vw] sm:w-[420px] max-w-[95vw] sm:max-w-none h-[500px] rounded-xl border border-gray-300 bg-white shadow-lg p-4 font-sans text-sm z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-1 pb-2 border-b flex-shrink-0">
        <h2 className="text-base font-semibold text-gray-800">Notifications</h2>
        <button
          onClick={onClose}
          className="text-gray-500 text-sm hover:text-black"
        >
          ✕
        </button>
      </div>

      {/* Sub-header */}
      <p className="text-sm text-gray-600 mb-2 flex-shrink-0">
        You have {alerts.length} unread{" "}
        {alerts.length === 1 ? "message" : "messages"}
      </p>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications found.</p>
        ) : (
          alerts.map((notif, i) => {
            const { icon, color, dot } = getIcon(notif.alert_type);
            return (
              <div
                key={notif.id}
                className="border-b pb-3 cursor-pointer last:border-b-0"
                onClick={() => handleClick(notif)}
              >
                {/* Title Row */}
                <div className="flex items-center gap-2 font-medium text-sm mb-1">
                  <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1"></span>
                  <h3 className="text-blue-900 font-semibold">
                    {notif.alert_type}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sourceStyles[notif.source] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {notif.source}
                  </span>
                </div>

                {/* Message */}
                <div className="flex items-start gap-2 mb-1">
                  <FontAwesomeIcon icon={icon} className={`${color} mt-1`} />
                  <p className="text-gray-800 font-medium">
                    {notif.showFull
                      ? notif.message
                      : notif.message.length > 80
                      ? notif.message.slice(0, 80) + "..."
                      : notif.message}
                    {notif.message.length > 80 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAlerts((prev) =>
                            prev.map((a) =>
                              a.id === notif.id
                                ? { ...a, showFull: !a.showFull }
                                : a
                            )
                          );
                        }}
                        className="ml-2 text-blue-600 text-xs font-semibold hover:underline"
                      >
                        {notif.showFull ? "Show less" : "Show more"}
                      </button>
                    )}
                  </p>
                </div>

                {/* Extra Info */}
                {notif.action_required && (
                  <p className="text-xs text-gray-700">
                    <strong>Action Required :</strong> {notif.action_required}
                  </p>
                )}
                {(notif.alert_timestamp || notif.timestamp) && (
                  <span className="ml-auto flex items-center gap-1 text-sm text-gray-700">
                    <FontAwesomeIcon icon={faClock} className="text-gray-500" />
                    {new Date(
                      notif.alert_timestamp || notif.timestamp
                    ).toLocaleString()}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-2 flex-shrink-0">
        <button
          onClick={() => {
            onClose?.();
            navigate("/dashboard/notification");
          }}
          className="text-blue-700 hover:underline text-sm font-medium"
        >
          Show all notifications
        </button>
      </div>
    </div>
  );
}
