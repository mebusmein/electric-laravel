import type { Todo } from "../api/types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (todo: Todo) => void;
  onUpdate: (id: number, title: string, description?: string) => void;
  onDelete: (id: number) => void;
}

export function TodoList({
  todos,
  onToggleComplete,
  onUpdate,
  onDelete,
}: TodoListProps) {
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

