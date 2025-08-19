import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faExclamationTriangle,
  faThumbtack,
  faCheckSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faClock as farClock } from "@fortawesome/free-regular-svg-icons";
import { useSelector } from "react-redux";

const notifications = [
  {
    id: 1,
    type: "critical",
    title: "Critical Task Alert",
    icon: faBullhorn,
    iconColor: "text-red-600",
    badgeColor: "bg-red-600",
    task: "PV -101",
    message: "Task PV -101 is in critical state.",
    details: [
      "It has been 2 Days since any activity was logged by the assigned resource.",
      "Last update : 24th June",
      "Action Required : Please resume progress and update the task status.",
    ],
  },
  {
    id: 2,
    type: "warning",
    title: "Inactivity Alert Before Deadline",
    icon: faExclamationTriangle,
    iconColor: "text-orange-500",
    badgeColor: "bg-orange-500",
    task: "PV -102",
    message: "Task PV -102 is scheduled for delivery on 2nd August.",
    details: [
      "It has been 2 Days since any activity was logged by the assigned resource.",
      "Action Required : Please resume progress and update the task status.",
    ],
  },
  {
    id: 3,
    type: "deadline",
    title: "Deadline Approaching",
    icon: null,
    iconSVG: (
      <svg
        className="w-4 h-4 text-yellow-400 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M6 2a1 1 0 0 0-1 1v2a3 3 0 0 0 2 2.83V15a5 5 0 0 0 3 4.58V21H8v2h8v-2h-2v-1.42A5 5 0 0 0 16 15V7.83A3 3 0 0 0 18 5V3a1 1 0 0 0-1-1H6zM7 5V4h10v1a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z" />
      </svg>
    ),
    badgeColor: "bg-yellow-400",
    task: "PV -103",
    message: "Task PV -103 is due in 2 days (29th June).",
    details: [
      "Progress appears to be slow, and the completion rate is below 50%.",
      "Action Required : Review current blocker and ensure delivery is on track",
    ],
  },
  {
    id: 4,
    type: "stalled",
    title: "Task Stalled - No Assigned Resource",
    icon: faThumbtack,
    iconColor: "text-red-600",
    badgeColor: "bg-blue-900",
    task: "PV -104",
    message: "Task PV -104 is pending assignment.",
    details: [
      "No resource is currently assigned, and due date is 1st July.",
      "Action Required : Please assign a team member to avoid timeline slippage.",
    ],
  },
  {
    id: 5,
    type: "completed",
    title: "Task Completed Late",
    icon: faCheckSquare,
    iconColor: "text-green-600",
    badgeColor: "bg-green-600",
    task: "PV -105",
    message:
      "Task PV -105 has been completed, but after the deadline (Delivered on 25th June; Due : 22nd June).",
    details: [
      "Note : Please update retrospective logs and adjust planning buffers accordingly.",
    ],
  },
];

export default function Notifications() {
  const { user } = useSelector((state) => state.profile);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white font-sans text-gray-800">
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#0c2e55] mb-6">
        Welcome Back, {user?.name}
      </h1>

      <section className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-700">Notifications</span>
          <button
            className="flex items-center space-x-1 bg-gray-100 text-gray-600 text-sm rounded-md px-3 py-1 hover:bg-gray-200 transition"
            type="button"
          >
            <span>All</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </section>

      <section className="divide-y divide-gray-300">
        {notifications.map((notif) => (
          <article key={notif.id} className="py-4">
            <div className="flex items-start sm:items-center flex-col sm:flex-row gap-2 mb-1">
              <span
                className={`w-3 h-3 rounded-full ${notif.badgeColor} flex-shrink-0 mt-1`}
                aria-hidden="true"
              ></span>
              <h2 className="text-blue-900 text-base font-medium">
                {notif.id}.{" "}
                <a href="#" className="underline">
                  {notif.title}
                </a>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 text-[15px]">
              {notif.icon ? (
                <FontAwesomeIcon icon={notif.icon} className={`${notif.iconColor}`} />
              ) : (
                notif.iconSVG
              )}
              <p className="text-gray-900 font-semibold">
                Task{" "}
                <span className="inline-block bg-gray-100 border border-gray-300 rounded px-2 py-[2px] mx-1 font-mono text-sm font-semibold">
                  {notif.task}
                </span>
                {notif.message.replace(`Task ${notif.task}`, "")}
              </p>
            </div>

            {notif.details.map((detail, i) => (
              <p
                key={i}
                className={`text-sm ${
                  i === notif.details.length - 1
                    ? "text-gray-700 mb-2"
                    : "text-gray-500 mb-1"
                }`}
              >
                <strong>{detail.split(":")[0]}:</strong>{" "}
                {detail.split(":").slice(1).join(":").trim()}
              </p>
            ))}

            <div className="flex items-center justify-end space-x-2 text-gray-400 text-sm">
              <FontAwesomeIcon icon={farClock} />
              <span>9 hours ago</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}