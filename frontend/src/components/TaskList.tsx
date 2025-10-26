// src/components/TaskList.tsx
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { TaskHeader } from "./TaskHeader";
import { AddTaskForm } from "./AddTaskForm";
import { TaskStats } from "./TaskStats";
import { TaskItem } from "./TaskItem";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { useTasks } from "../hooks/useTasks";
import { Task } from "../types/task.types";

const TaskList = () => {
  const { tasks, stats, loading, addTask, updateTask, deleteTask, completeTask } = useTasks();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    taskId: number | null;
    taskTitle: string;
  }>({
    isOpen: false,
    taskId: null,
    taskTitle: "",
  });

  const handleDeleteClick = (task: Task) => {
    setConfirmDialog({
      isOpen: true,
      taskId: task.id,
      taskTitle: task.title,
    });
  };

  const handleDeleteConfirm = async () => {
    if (confirmDialog.taskId) {
      await deleteTask(confirmDialog.taskId);
      setConfirmDialog({ isOpen: false, taskId: null, taskTitle: "" });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({ isOpen: false, taskId: null, taskTitle: "" });
  };

  const handleEditTask = async (id: number, title: string, description: string) => {
    await updateTask(id, { title, description, isCompleted: false });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      
      <TaskHeader />

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AddTaskForm onAddTask={addTask} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <TaskStats stats={stats} />

            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-purple-500">
                <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
              </div>

              {loading ? (
                <LoadingState />
              ) : tasks.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onComplete={completeTask}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
