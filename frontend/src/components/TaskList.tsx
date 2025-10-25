// src/components/TaskList.tsx
import React from "react";
import { CheckSquare } from "lucide-react";

const TaskList = () => {
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

      {/* Tasks will be rendered here */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Task content goes here */}
      </div>
    </div>
  );
};

export default TaskList;
