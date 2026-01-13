"use client";

import { Filter } from "../Types/filter";

type Props = {
  currentFilter: Filter;
  onChange: (filter: Filter) => void;
};

export default function TodoFilters({ currentFilter, onChange }: Props) {
  const filters: Filter[] = ["all", "active", "completed"];

  return (
    <div className="mt-1 flex flex-wrap items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-2 sm:justify-between">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-orange-500 flex-1 sm:flex-none">
        Filter
      </p>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onChange(filter)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition
              ${
                currentFilter === filter
                  ? "bg-[#f97316] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-orange-100 hover:bg-orange-50"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
