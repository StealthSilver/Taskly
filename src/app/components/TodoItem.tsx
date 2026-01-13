"use client";

import { useState } from "react";
import { Todo } from "../Types/todo";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => Promise<void>;
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = () => {
    setEditTitle(todo.title);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const saveEdit = async () => {
    const trimmed = editTitle.trim();
    if (!trimmed || trimmed === todo.title) {
      setIsEditing(false);
      setEditTitle(todo.title);
      return;
    }

    try {
      setIsSaving(true);
      await onEdit(todo._id, trimmed);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void saveEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
  };

  return (
    <li className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-2.5 text-sm shadow-[0_1px_0_rgba(15,23,42,0.03)] transition hover:border-orange-200 hover:bg-white">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo._id)}
        className="h-4 w-4 rounded border-slate-300 text-[#f97316] accent-[#f97316]"
      />

      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 rounded-lg border border-orange-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f97316]/70 focus:border-transparent transition"
          />
          <button
            type="button"
            onClick={() => void saveEdit()}
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-md bg-[#f97316] px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f97316]/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving" : "Save"}
          </button>
          <button
            type="button"
            onClick={cancelEditing}
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span
            className={`flex-1 truncate text-slate-800 ${
              todo.completed ? "line-through text-slate-400" : ""
            }`}
          >
            {todo.title}
          </span>
          <button
            type="button"
            onClick={startEditing}
            className="ml-1 inline-flex h-7 px-2 items-center justify-center rounded-full bg-slate-100 text-slate-400 text-xs font-medium transition hover:bg-orange-50 hover:text-orange-600"
          >
            Edit
          </button>
        </>
      )}

      <button
        onClick={() => onDelete(todo._id)}
        type="button"
        className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
      >
        ×
      </button>
    </li>
  );
}
