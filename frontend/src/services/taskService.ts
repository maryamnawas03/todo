// src/services/taskService.ts
import axios from "axios";
import { ApiResponse } from "../types/task.types";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const taskService = {
  async fetchTasks(): Promise<ApiResponse> {
    const response = await axios.get<ApiResponse>(`${API_BASE_URL}/tasks`);
    return response.data;
  },

  async createTask(title: string, description: string): Promise<ApiResponse> {
    const response = await axios.post<ApiResponse>(`${API_BASE_URL}/tasks`, {
      title,
      description,
    });
    return response.data;
  },

  async updateTask(
    id: number,
    data: { title?: string; description?: string; isCompleted?: boolean }
  ): Promise<ApiResponse> {
    const response = await axios.put<ApiResponse>(
      `${API_BASE_URL}/tasks/${id}`,
      data
    );
    return response.data;
  },

  async deleteTask(id: number): Promise<ApiResponse> {
    const response = await axios.delete<ApiResponse>(
      `${API_BASE_URL}/tasks/${id}`
    );
    return response.data;
  },
};
