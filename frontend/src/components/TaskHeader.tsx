// src/components/TaskHeader.tsx
import React from "react";
import { CheckSquare } from "lucide-react";

export const TaskHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <CheckSquare className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
      </div>

      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
        TaskFlow
      </h1>

      <p className="text-gray-600 text-lg">
        Master your productivity, one task at a time
      </p>
    </div>
  );
};
