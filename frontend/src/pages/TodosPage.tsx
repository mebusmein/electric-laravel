import { useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { todosCollection, todosApi } from "../api/todos";
import type { Todo } from "../api/types";
import { eq, ilike, useLiveQuery } from "@tanstack/react-db";
import { Header } from "../components/Header";
import { StatsCards } from "../components/StatsCards";
import { SearchFilter } from "../components/SearchFilter";
import { CreateTodoForm } from "../components/CreateTodoForm";
import { TodoList } from "../components/TodoList";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LabelsSidebar } from "../components/LabelsSidebar";

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
    async (title: string, description?: string, labelIds?: number[]) => {
      // Use direct API call when labels are provided to ensure atomicity
      if (labelIds && labelIds.length > 0) {
        await todosApi.create({
          title,
          description,
          label_ids: labelIds,
        });
      } else {
        const todo: Todo = {
          id: Math.floor(Math.random() * 1000000),
          user_id: user?.id ?? 0,
          title,
          description: description || null,
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        todosCollection.insert(todo);
      }
    },
    [user?.id]
  );

  const handleToggleComplete = useCallback(async (todo: Todo) => {
    todosCollection.update(todo.id, (draft) => {
      draft.completed = !todo.completed;
    });
  }, []);

  const handleUpdateTodo = useCallback(
    async (
      id: number,
      title: string,
      description?: string,
      labelIds?: number[]
    ) => {
      // Update the todo through the collection
      todosCollection.update(id, (draft) => {
        draft.title = title;
        draft.description = description || null;
      });

      // Sync labels separately if provided
      if (labelIds !== undefined) {
        await todosApi.syncLabels(id, labelIds);
      }
    },
    []
  );

  const handleDeleteTodo = useCallback(async (id: number) => {
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

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
        <main className="flex-1 max-w-3xl">
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

        <LabelsSidebar />
      </div>
    </div>
  );
}
