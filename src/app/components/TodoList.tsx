"use client";

import { Todo } from "../Types/todo";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => Promise<void>;
};

export default function TodoList({ todos, onToggle, onDelete, onEdit }: Props) {
  return (
    <div className="mt-3">
      {todos.length === 0 && (
        <p className="rounded-xl border border-dashed border-orange-200 bg-orange-50/70 px-4 py-3 text-center text-sm text-slate-500">
          No tasks yet. Add your first todo above.
        </p>
      )}

      {todos.length > 0 && (
        <ul className="space-y-2.5 max-h-80 overflow-y-auto pr-1 sm:max-h-90 md:max-h-100">
          {todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
