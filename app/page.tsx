"use client";

import { useState, useEffect } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
};

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const showMessage = (text: string, type: "error" | "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      showMessage("Failed to load tasks", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showMessage("Title and description are required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority }),
      });

      if (!res.ok) throw new Error("Failed");

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      showMessage("Task created successfully!", "success");
      fetchTasks();
    } catch (error) {
      showMessage("Failed to create task", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      fetchTasks();
    } catch (error) {
      showMessage("Failed to update status", "error");
    }
  };

  const deleteTask = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      showMessage("Task deleted", "success");
      fetchTasks();
    } catch (error) {
      showMessage("Failed to delete task", "error");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Task Management Portal</h1>
        </header>

        {message.text && (
          <div
            className={`p-4 rounded-md text-sm font-medium ${message.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
              }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] text-gray-900 bg-white"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                disabled={isSubmitting}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Tasks</h2>

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              No tasks found. Create one above!
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                          task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    <p className="text-xs text-gray-400">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                      value={task.status}
                      onChange={(e) => updateStatus(task.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}