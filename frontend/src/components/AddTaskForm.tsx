// src/components/AddTaskForm.tsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface AddTaskFormProps {
  onAddTask: (title: string, description: string) => Promise<boolean>;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    const success = await onAddTask(title, description);
    if (success) {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <Card className="bg-purple-50 border-purple-100">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-purple-700">Add a Task</h2>
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
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
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
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
