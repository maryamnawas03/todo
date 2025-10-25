// src/components/TaskList.tsx
import React, { useState, useEffect } from "react";
import { CheckSquare, Plus, Trash2, Circle, Edit2, Save, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ConfirmDialog } from "./ui/confirm-dialog";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  tasks?: Task[];
  task?: Task;
  stats: {
    todo: number;
    completed: number;
  };
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todoCount, setTodoCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    taskId: number | null;
    taskTitle: string;
  }>({
    isOpen: false,
    taskId: null,
    taskTitle: "",
  });

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/tasks`);
      setTasks(response.data.tasks || []);
      setTodoCount(response.data.stats.todo);
      setCompletedCount(response.data.stats.completed);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/tasks`, {
        title,
        description,
      });
      
      setTitle("");
      setDescription("");
      setTodoCount(response.data.stats.todo);
      setCompletedCount(response.data.stats.completed);
      toast.success("Task added successfully!");
      
      // Refresh tasks to show the latest 5
      fetchTasks();
    } catch (error) {
      toast.error("Failed to add task");
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await axios.delete<ApiResponse>(`${API_BASE_URL}/tasks/${id}`);
      setTodoCount(response.data.stats.todo);
      setCompletedCount(response.data.stats.completed);
      toast.success("Task deleted");
      
      // Refresh tasks to show the latest 5
      fetchTasks();
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    } finally {
      setConfirmDialog({ isOpen: false, taskId: null, taskTitle: "" });
    }
  };

  const handleDeleteClick = (task: Task) => {
    setConfirmDialog({
      isOpen: true,
      taskId: task.id,
      taskTitle: task.title,
    });
  };

  const handleDeleteConfirm = () => {
    if (confirmDialog.taskId) {
      deleteTask(confirmDialog.taskId);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({ isOpen: false, taskId: null, taskTitle: "" });
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = async (id: number) => {
    try {
      const response = await axios.put<ApiResponse>(`${API_BASE_URL}/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
        isCompleted: false,
      });
      
      setTodoCount(response.data.stats.todo);
      setCompletedCount(response.data.stats.completed);
      setEditingTask(null);
      setEditTitle("");
      setEditDescription("");
      toast.success("Task updated!");
      
      // Refresh tasks to show the latest 5
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const response = await axios.put<ApiResponse>(`${API_BASE_URL}/tasks/${id}`, {
        isCompleted: true,
      });
      
      setTodoCount(response.data.stats.todo);
      setCompletedCount(response.data.stats.completed);
      toast.success("Task completed!");
      
      // Refresh tasks to show the latest 5 incomplete tasks
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      {/* Header Section */}
      <div className="text-center mb-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <CheckSquare className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          TaskFlow
        </h1>

        {/* Slogan */}
        <p className="text-gray-600 text-lg">
          Master your productivity, one task at a time
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Task Form - Left Column */}
          <div className="lg:col-span-1">
            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-purple-700">
                    Add a Task
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title
                    </label>
                    <Input
                      placeholder="What needs to be done?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTask()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      placeholder="Add more details about your task..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button
                    onClick={addTask}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task Stats and List - Right Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-blue-500 border-blue-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2">{todoCount}</div>
                  <div className="text-blue-100">To Do</div>
                </CardContent>
              </Card>

              <Card className="bg-green-500 border-green-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2">
                    {completedCount}
                  </div>
                  <div className="text-green-100">Completed</div>
                </CardContent>
              </Card>
            </div>

            {/* Task List */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-purple-500">
                <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                  <p className="text-gray-500">Loading tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <Circle className="w-16 h-16 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No tasks yet
                  </h3>
                  <p className="text-gray-500">
                    Create your first task to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <Card
                      key={task.id}
                      className="transition-all hover:shadow-md bg-white"
                    >
                      <CardContent className="p-4">
                        {editingTask === task.id ? (
                          // Edit mode
                          <div className="space-y-3">
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Task title"
                              className="font-semibold"
                            />
                            <Textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              placeholder="Task description"
                              rows={3}
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                onClick={cancelEditing}
                                size="sm"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                              <Button
                                onClick={() => saveEdit(task.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View mode
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className="mt-1"
                              aria-label="Mark task as complete"
                            >
                              <Circle className="w-5 h-5 text-gray-400" />
                            </button>

                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 mb-1">
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-sm text-gray-600">
                                  {task.description}
                                </p>
                              )}
                            </div>

                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                onClick={() => startEditing(task)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                size="sm"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => handleDeleteClick(task)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${confirmDialog.taskTitle}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default TaskList;
