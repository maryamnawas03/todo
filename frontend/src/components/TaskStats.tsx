// src/components/TaskStats.tsx
import React from "react";
import { Card, CardContent } from "./ui/card";
import { TaskStats as Stats } from "../types/task.types";

interface TaskStatsProps {
  stats: Stats;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-blue-500 border-blue-600 text-white">
        <CardContent className="p-6 text-center">
          <div className="text-4xl font-bold mb-2">{stats.todo}</div>
          <div className="text-blue-100">To Do</div>
        </CardContent>
      </Card>

      <Card className="bg-green-500 border-green-600 text-white">
        <CardContent className="p-6 text-center">
          <div className="text-4xl font-bold mb-2">{stats.completed}</div>
          <div className="text-green-100">Completed</div>
        </CardContent>
      </Card>
    </div>
  );
};
