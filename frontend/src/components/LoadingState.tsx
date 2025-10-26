// src/components/LoadingState.tsx
import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
      <p className="text-gray-500">Loading tasks...</p>
    </div>
  );
};
