import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faExclamationTriangle,
  faThumbtack,
  faCheckSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNotification,
  getNotification,
} from "../../../services/oprations/authAPI";
import { useNavigate } from "react-router-dom";
import { createFeedback } from "../../../services/oprations/feedbackAPI"; // import your Redux action
import toast from "react-hot-toast";

const sourceStyles = {
  Jira: "bg-red-100 text-red-600",
  Google: "bg-blue-100 text-blue-600",
};

export default function Notifications() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  // Modal state for per-notification feedback
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    notifId: null,
  });
  const [feedbackText, setFeedbackText] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return;
    try {
      setLoadingFeedback(true);
      await dispatch(
        createFeedback({
          userid: user?._id,
          feedback: feedbackText,
          for:`Notification - ${feedbackModal.notifId}` ,
           
        })
      );
      toast.success("Feedback submitted successfully!");
      setFeedbackText("");
      setFeedbackModal({ isOpen: false, notifId: null });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Try again.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await dispatch(getNotification());
        if (res) {
          const { jiraData, googleData } = res;

          const flatJira = Object.entries(jiraData || {}).flatMap(
            ([project, alerts]) =>
              alerts.map((alert, i) => ({
                id: `jira-${project}-${i}`,
                project,
                source: "Jira",
                ...alert,
              }))
          );

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
            let filtered = combined.filter(
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
                  jiraIds.includes(notif.project) || jiraIds.includes(notif._id)
                );
              }
              return false;
            });

            setAlerts(filtered);
          } else {
            setAlerts(combined);
          }
        }
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };
    if (user) fetchNotifications();
  }, [dispatch, user]);

  const handleDelete = async (notif) => {
    const res = await dispatch(
      deleteNotification({
        id: notif._id,
        source: notif.source,
        message: notif.message,
      })
    );

    if (res.success) {
      setAlerts((prev) => prev.filter((a) => a.alertId !== notif.alertId));
    }
  };

  const handleClick = async (notif) => {
    if (notif.source === "Google") {
      navigate(`/dashboard/insights/google-details/${notif._id || notif.id}`);
    } else {
      navigate(`/dashboard/insights/jira-details/${notif._id || notif.id}`);
    }
    await handleDelete(notif);
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white font-sans text-gray-800">
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#0c2e55] mb-6">
        Welcome Back, {user?.name}
      </h1>

      <section className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-700">
            Notifications
          </span>
        </div>
      </section>

      <section className="divide-y divide-gray-300">
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications found.</p>
        ) : (
          alerts.map((notif) => (
            <article
              key={notif.id}
              className="py-4 hover:bg-gray-50 transition rounded-md px-2 relative"
            >
              {/* Main clickable content */}
              <div onClick={() => handleClick(notif)}>
                <div className="flex items-start sm:items-center flex-col sm:flex-row gap-2 mb-1">
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
                </div>

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

                {notif.action_required && (
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Action Required:</strong> {notif.action_required}
                  </p>
                )}
              </div>

              {/* Feedback button per notification */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering handleClick
                  setFeedbackModal({ isOpen: true, notifId: notif.id });
                }}
                className="absolute top-2 right-2 bg-[#00254D] text-white px-2 py-1 rounded text-xs"
              >
                Feedback
              </button>
            </article>
          ))
        )}
      </section>

      {/* Feedback Modal */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-[400px] p-6 relative">
            <h2 className="text-lg font-bold mb-4">
              Submit Feedback for {feedbackModal.notifId}
            </h2>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write your feedback here..."
              className="w-full h-32 p-2 border border-gray-300 rounded mb-4 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setFeedbackModal({ isOpen: false, notifId: null })
                }
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className={`px-4 py-2 rounded text-white ${
                  loadingFeedback
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#00254D] hover:bg-blue-600"
                }`}
                disabled={loadingFeedback}
              >
                {loadingFeedback ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
