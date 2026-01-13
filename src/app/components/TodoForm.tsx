"use client";

import React from "react";
import { useState } from "react";

type Props = {
  onAddTodo: (title: string) => void | Promise<void>;
};

export default function TodoForm({ onAddTodo }: Props) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddTodo(title.trim());
      setTitle("");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 sm:flex-row sm:items-center"
    >
      <input
        type="text"
        placeholder="Enter a todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 rounded-lg border border-orange-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f97316]/70 focus:border-transparent transition"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-[#f97316] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#f97316]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 w-full sm:w-auto"
        disabled={isSubmitting || !title.trim()}
      >
        {isSubmitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
