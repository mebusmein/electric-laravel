import { useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { todosApi, todosCollection } from "../api/todos";
import type { Todo } from "../api/types";
import { eq, ilike, useLiveQuery } from "@tanstack/react-db";
import { Header } from "../components/Header";
import { StatsCards } from "../components/StatsCards";
import { SearchFilter } from "../components/SearchFilter";
import { CreateTodoForm } from "../components/CreateTodoForm";
import { TodoList } from "../components/TodoList";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";

export function TodosPage() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);

  const { data: todos, isLoading } = useLiveQuery((q) =>
    q.from({ todos: todosCollection })
  );

  // Filter todos based on search and hideCompleted
  const { data: filteredTodos } = useLiveQuery(
    (q) => {
      let query = q.from({ todos: todosCollection });
      if (searchQuery.trim()) {
        query = query.where(({ todos }) =>
          ilike(todos.title, `%${searchQuery}%`)
        );
      }
      if (hideCompleted) {
        query = query.where(({ todos }) => eq(todos.completed, false));
      }
      return query;
    },
    [searchQuery, hideCompleted]
  );

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.filter((t) => !t.completed).length;

  const handleCreateTodo = useCallback(
    async (title: string, description?: string) => {
      const todo = await todosApi.create({ title, description });
      todosCollection.insert(todo);
    },
    []
  );

  const handleToggleComplete = useCallback(async (todo: Todo) => {
    todosApi.update(todo.id, { completed: !todo.completed });
    todosCollection.update(todo.id, (draft) => {
      draft.completed = !todo.completed;
    });
  }, []);

  const handleUpdateTodo = useCallback(
    async (id: number, title: string, description?: string) => {
      todosApi.update(id, { title, description });
      todosCollection.update(id, (draft) => {
        draft.title = title;
        draft.description = description || null;
      });
    },
    []
  );

  const handleDeleteTodo = useCallback(async (id: number) => {
    await todosApi.delete(id);
    todosCollection.delete(id);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setHideCompleted(false);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (todos.length === 0) {
      return <EmptyState type="no-tasks" />;
    }

    if (filteredTodos.length === 0) {
      return (
        <EmptyState
          type="no-results"
          searchQuery={searchQuery}
          onClearFilters={handleClearFilters}
        />
      );
    }

    return (
      <TodoList
        todos={filteredTodos}
        onToggleComplete={handleToggleComplete}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
      />
    );
  };

  return (
    <div className="min-h-screen">
      <Header userName={user?.name} onLogout={logout} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <StatsCards
          total={todos.length}
          pending={pendingCount}
          completed={completedCount}
        />

        <SearchFilter
          onSearchChange={setSearchQuery}
          onHideCompletedChange={setHideCompleted}
        />

        <CreateTodoForm onCreate={handleCreateTodo} />

        {renderContent()}
      </main>
    </div>
  );
}
