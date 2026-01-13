"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TodoFilters from "./components/TodoFilters";
import { PaginatedTodosResponse, Todo } from "./Types/todo";
import { Filter } from "./Types/filter";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const PAGE_SIZE = 5;

  const loadTodos = useCallback(async (pageToLoad: number = 1) => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const params = new URLSearchParams({
        page: String(pageToLoad),
        limit: String(PAGE_SIZE),
      });

      const res = await fetch(`/api/todos?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch todos");
      }

      const data: PaginatedTodosResponse = await res.json();
      setTodos(data.todos);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (error) {
      console.error(error);
      setLoadError("Could not load your tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      loadTodos(1);
    }
  }, [loadTodos, status]);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  async function addTodo(title: string) {
    try {
      setActionError(null);

      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        throw new Error("Failed to add todo");
      }
      await res.json();

      // After adding, reload the first page to show newest task
      await loadTodos(1);
    } catch (error) {
      console.error(error);
      setActionError("Could not add todo. Please try again.");
    }
  }

  async function toggleTodo(id: string) {
    const current = todos.find((t) => t._id === id);
    if (!current) return;

    try {
      setActionError(null);

      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !current.completed }),
      });

      if (!res.ok) {
        throw new Error("Failed to update todo");
      }
      await res.json();

      // Refresh current page to keep list in sync
      await loadTodos(page);
    } catch (error) {
      console.error(error);
      setActionError("Could not update todo. Please try again.");
    }
  }

  async function deleteTodo(id: string) {
    try {
      setActionError(null);

      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete todo");
      }
      await res.json();

      // Refresh current page (may move to previous page if last item removed)
      const nextPage = page > 1 && todos.length === 1 ? page - 1 : page;
      await loadTodos(nextPage);
    } catch (error) {
      console.error(error);
      setActionError("Could not delete todo. Please try again.");
    }
  }

  async function editTodo(id: string, title: string) {
    try {
      setActionError(null);

      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        throw new Error("Failed to update todo");
      }

      await res.json();
      await loadTodos(page);
    } catch (error) {
      console.error(error);
      setActionError("Could not update todo. Please try again.");
    }
  }

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    await loadTodos(newPage);
  };
  if (status === "loading") {
    return (
      <section className="app-card w-full max-w-md sm:max-w-lg md:max-w-xl px-5 py-6 sm:px-7 sm:py-7 md:px-8 md:py-8">
        <p className="text-sm text-slate-500">Checking your session...</p>
      </section>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <section className="app-card w-full max-w-md sm:max-w-lg md:max-w-xl px-5 py-6 sm:px-7 sm:py-7 md:px-8 md:py-8">
      <header className="mb-4 sm:mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Today&apos;s tasks
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Capture, organize, and complete your todos.
          </p>
        </div>
        <div className="inline-flex items-center justify-center rounded-full bg-orange-50 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-xs font-medium text-orange-600 whitespace-nowrap">
          {total} task{total === 1 ? "" : "s"}
        </div>
      </header>
      {loadError && (
        <div className="mb-3 sm:mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={() => loadTodos(page)}
            className="inline-flex items-center justify-center rounded-md border border-red-200 bg-white px-2 py-1 text-[11px] font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      )}

      {actionError && (
        <div className="mb-3 sm:mb-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {actionError}
        </div>
      )}

      <div className="space-y-4 sm:space-y-5">
        <TodoForm onAddTodo={addTodo} />
        <TodoFilters currentFilter={filter} onChange={setFilter} />
        {isLoading ? (
          <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-center text-sm text-slate-500">
            Loading your tasks...
          </div>
        ) : (
          <>
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
            {total > 0 && (
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Page {page} of {totalPages} • {total} task
                  {total === 1 ? "" : "s"} total
                </span>
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
