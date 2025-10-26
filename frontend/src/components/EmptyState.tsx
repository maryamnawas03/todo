// src/components/EmptyState.tsx
import React from "react";
import { Circle } from "lucide-react";

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <Circle className="w-16 h-16 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No tasks yet
      </h3>
      <p className="text-gray-500">Create your first task to get started</p>
    </div>
  );
};
