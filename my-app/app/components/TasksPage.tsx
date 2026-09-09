
"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  const [editId, setEditId] = useState<number | null>(null);

  const API = "http://127.0.0.1:8000/api/tasks";

  const getTasks = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setTasks(data.data ?? data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addTask = async () => {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        status,
      }),
    });

    const data = await res.json();
    setTasks((currentTasks) => [...currentTasks, data.data ?? data]);
    clearForm();
  };

  const updateTask = async () => {
    const res = await fetch(`${API}/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        status,
      }),
    });

    const data = await res.json();
    const updatedTask = data.data ?? data;

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === editId ? updatedTask : task))
    );

    clearForm();
  };

  const deleteTask = async (id: number) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  const editTask = (task: Task) => {
    setEditId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const clearForm = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setStatus("pending");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editId) {
      await updateTask();
    } else {
      await addTask();
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">
              Workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Task Manager
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {tasks.length} tasks
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.4fr]">
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              {editId ? "Update task" : "Add task"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {editId ? "Edit your task" : "Create a new task"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Title</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                placeholder="Add details about this task"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                {editId ? "Update task" : "Add task"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Overview
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Your tasks</h2>
            </div>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
              {tasks.length} items
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-600">
                ✓
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No tasks yet</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-600">
                Create your first task to get started and keep your work organized.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                const isCompleted = task.status === "completed";

                return (
                  <article
                    key={task.id}
                    className={`rounded-3xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                      isCompleted
                        ? "border-emerald-200 bg-emerald-50/80"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-slate-900">{task.title}</h3>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                              isCompleted
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p className="text-sm leading-6 text-slate-600">
                          {task.description || "No description provided."}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => editTask(task)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
