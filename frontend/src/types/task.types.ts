// src/types/task.types.ts
export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  todo: number;
  completed: number;
}

export interface ApiResponse {
  tasks?: Task[];
  task?: Task;
  stats: TaskStats;
}
