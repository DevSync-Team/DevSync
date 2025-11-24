"use client";

import { StatItem } from "@/types/dashboard.types";

const StatsGrid = ({ value, icon, label, iconColor }: StatItem) => {
  return (
    <div>
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 flex items-center justify-between shadow-md">
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-gray-400 text-sm">{label}</p>
        </div>

        <div className={`p-3 bg-[#1f2937] rounded-lg ${iconColor}`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatsGrid;
