// src/hooks/useTasks.ts
import { useState, useEffect, useCallback } from "react";
import { Task, TaskStats } from "../types/task.types";
import { taskService } from "../services/taskService";
import toast from "react-hot-toast";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ todo: 0, completed: 0 });
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.fetchTasks();
      setTasks(data.tasks || []);
      setStats(data.stats);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string, description: string) => {
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return false;
    }

    try {
      const data = await taskService.createTask(title, description);
      setStats(data.stats);
      toast.success("Task added successfully!");
      await fetchTasks();
      return true;
    } catch (error) {
      toast.error("Failed to add task");
      console.error("Error adding task:", error);
      return false;
    }
  };

  const updateTask = async (
    id: number,
    updates: { title?: string; description?: string; isCompleted?: boolean }
  ) => {
    try {
      const data = await taskService.updateTask(id, updates);
      setStats(data.stats);
      toast.success("Task updated!");
      await fetchTasks();
      return true;
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
      return false;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const data = await taskService.deleteTask(id);
      setStats(data.stats);
      toast.success("Task deleted");
      await fetchTasks();
      return true;
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
      return false;
    }
  };

  const completeTask = async (id: number) => {
    try {
      const data = await taskService.updateTask(id, { isCompleted: true });
      setStats(data.stats);
      toast.success("Task completed!");
      await fetchTasks();
      return true;
    } catch (error) {
      toast.error("Failed to complete task");
      console.error("Error completing task:", error);
      return false;
    }
  };

  return {
    tasks,
    stats,
    loading,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
  };
};
