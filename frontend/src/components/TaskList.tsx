// src/components/TaskList.tsx
import React, { useState } from "react";
import { CheckSquare, Plus, Trash2, Circle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addTask = () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTitle("");
    setDescription("");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const todoCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const activeTasks = tasks.filter((task) => !task.completed);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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

      {/* Error Message */}
      {tasks.length === 0 && title === "" && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Failed to fetch tasks. Please make sure the backend server is running.
          </div>
        </div>
      )}

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

              {activeTasks.length === 0 ? (
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
                  {activeTasks.map((task) => (
                    <Card
                      key={task.id}
                      className="transition-all hover:shadow-md bg-white"
                    >
                      <CardContent className="p-4">
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

                          <Button
                            variant="ghost"
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
