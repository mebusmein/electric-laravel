import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { todosApi } from '../api/todos';
import type { Todo } from '../api/types';

export function TodosPage() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todosApi.getAll();
      setTodos(data);
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    setIsCreating(true);
    try {
      const todo = await todosApi.create({
        title: newTodoTitle.trim(),
        description: newTodoDescription.trim() || undefined,
      });
      setTodos([todo, ...todos]);
      setNewTodoTitle('');
      setNewTodoDescription('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const updated = await todosApi.update(todo.id, { completed: !todo.completed });
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async () => {
    if (!editingTodo || !editTitle.trim()) return;

    try {
      const updated = await todosApi.update(editingTodo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setTodos(todos.map((t) => (t.id === editingTodo.id ? updated : t)));
      handleCancelEdit();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todosApi.delete(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="font-semibold text-lg">My Tasks</h1>
              <p className="text-sm text-[var(--color-text-muted)]">Welcome, {user?.name}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4">
            <p className="text-2xl font-bold">{todos.length}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Total tasks</p>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4">
            <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Pending</p>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4">
            <p className="text-2xl font-bold text-[var(--color-success)]">{completedCount}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Completed</p>
          </div>
        </div>

        {/* Add Todo Button / Form */}
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full mb-6 py-4 border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add new task
          </button>
        ) : (
          <form onSubmit={handleCreateTodo} className="mb-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Task title..."
              autoFocus
              className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent mb-3"
            />
            <textarea
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              placeholder="Description (optional)..."
              rows={2}
              className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent mb-3 resize-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewTodoTitle('');
                  setNewTodoDescription('');
                }}
                className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || !newTodoTitle.trim()}
                className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Adding...' : 'Add task'}
              </button>
            </div>
          </form>
        )}

        {/* Todo List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] mb-4">
              <svg className="w-8 h-8 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
            <p className="text-[var(--color-text-muted)]">Add your first task to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4 transition-all duration-200 ${
                  todo.completed ? 'opacity-60' : ''
                }`}
              >
                {editingTodo?.id === todo.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1.5 text-sm bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleComplete(todo)}
                      className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        todo.completed
                          ? 'bg-[var(--color-success)] border-[var(--color-success)]'
                          : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                      }`}
                    >
                      {todo.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${todo.completed ? 'line-through text-[var(--color-text-muted)]' : ''}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{todo.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStartEdit(todo)}
                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

