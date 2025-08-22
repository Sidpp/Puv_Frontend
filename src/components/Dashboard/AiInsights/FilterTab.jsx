// components/Dashboard/AiInsights/FilterTab.jsx
import React from "react";

const FilterTab = ({ id, label, count, color, selectedFilter, onClick }) => {
  const isActive = selectedFilter === label;

  return (
    <button
      onClick={() => onClick(label)}
      className={`flex items-center gap-2 border rounded-full px-4 py-2 font-semibold text-sm shadow-sm transition
        ${isActive ? "bg-blue-100 border-blue-500" : "bg-white border-gray-300"}
      `}
    >
      <span style={{ color }}>{label}</span>
      <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs">
        {count}
      </span>
    </button>
  );
};

export default FilterTab;
