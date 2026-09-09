"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/tasks");
        console.log("Response:", res); // Log the response object for debugging

        if (!res.ok) {
          throw new Error(`Unable to load tasks (${res.status})`);
        }

        const data = await res.json();
        setTasks(Array.isArray(data) ? data : data.data ?? []);
        setError("");
      } catch {
        setError(
          "Saved tasks could not be loaded. Make sure the API is running on port 8000."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // POST task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/api/tasks", {
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
        console.log("Response:", res); // Log the response object for debugging

    if (!res.ok) {
      throw new Error("Unable to save task");
    }

    const data = await res.json();
    const newTask = data.data ?? data;

    setTasks((currentTasks) => [...currentTasks, newTask]);

    // Clear form
    setTitle("");
    setDescription("");
    setStatus("pending");
  };

  return (
    <div>
      <h1>Task Manager</h1>

      {/* CREATE TASK */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
          />
        </div>

        <div>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button type="submit">Add Task</button>
      </form>

      {/* TASK LIST */}
      <h2>Tasks</h2>

      {isLoading && <p>Loading saved tasks...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && tasks.length === 0 && <p>No saved tasks yet.</p>}
      {!isLoading && !error && tasks.map((task) => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
          </div>
        ))}
    </div>
  );
}