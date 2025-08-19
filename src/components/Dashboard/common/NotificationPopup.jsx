import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faExclamationTriangle,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const notifications = [
  {
    id: 1,
    title: "Critical Task Alert",
    icon: faBullhorn,
    iconColor: "text-red-600",
    dotColor: "bg-red-600",
    task: "PV -100",
    boldText: "is in critical state.",
    desc: "The expected delivery date has passed, and the task remains incomplete.",
    lastUpdate: "24th June",
    action:
      "Immediate attention needed to resolve pending issue and complete the task.",
  },
  {
    id: 2,
    title: "Inactivity Alert Before Deadline",
    icon: faExclamationTriangle,
    iconColor: "text-orange-500",
    dotColor: "bg-orange-500",
    task: "PV -102",
    boldText: "is scheduled for delivery on 2nd August.",
    desc: "It has been 2 Days since any activity was logged by the assigned resource.",
    action: "Please resume progress and update the task status.",
  },
  {
    id: 3,
    title: "Deadline Approaching",
    icon: faHourglassHalf,
    iconColor: "text-yellow-500",
    dotColor: "bg-yellow-400",
    task: "PV -104",
    boldText: "is due in 2 days (29th June).",
    desc: "Progress appears to be slow, and the completion rate is below 50%.",
    action: "Review current blockers and ensure delivery is on track.",
  },
];

export default function NotificationPopup({ onClose }) {
  const navigate = useNavigate();
  return (
    <div className="fixed top-4 right-4 sm:static w-[90vw] sm:w-[420px] max-w-[95vw] sm:max-w-none h-[80vh] sm:h-auto overflow-y-auto rounded-xl border border-gray-300 bg-white shadow-lg p-4 font-sans text-sm z-50">
      <div className="flex justify-between items-center mb-1 pb-2 border-b">
        <h2 className="text-base font-semibold text-gray-800">Notifications</h2>
        <button
          onClick={onClose}
          className="text-gray-500 text-sm hover:text-black"
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">You have 0 unread messages</p>

      {notifications.map((n, i) => (
        <div
          key={n.id}
          className={`${
            i < notifications.length - 1 ? "border-b pb-3 mb-3" : ""
          }`}
        >
          <div className="flex items-center gap-2 font-medium text-sm mb-1">
            <span className={`w-3 h-3 rounded-full ${n.dotColor}`} />
            <h3 className="text-blue-900 font-semibold">
              {n.id}.{" "}
              <a href="#" className="underline">
                {n.title}
              </a>
            </h3>
          </div>
          <div className="flex items-start gap-2 mb-1">
            <FontAwesomeIcon
              icon={n.icon}
              className={`${n.iconColor} mt-0.5`}
            />
            <p className="text-gray-800 font-medium">
              Task{" "}
              <span className="bg-gray-100 border border-gray-300 rounded px-2 py-[2px] mx-1 font-mono text-xs font-semibold">
                {n.task}
              </span>{" "}
              <span className="font-bold">{n.boldText}</span>
            </p>
          </div>
          <p className="text-xs text-gray-600 mb-1">{n.desc}</p>
          {n.lastUpdate && (
            <p className="text-xs text-gray-700">
              <strong>Last update :</strong> {n.lastUpdate}
            </p>
          )}
          <p className="text-xs text-gray-700">
            <strong>Action Required :</strong> {n.action}
          </p>
        </div>
      ))}
      <div className="text-center mt-2">
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
