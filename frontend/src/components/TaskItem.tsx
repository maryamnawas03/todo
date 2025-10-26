// src/components/TaskItem.tsx
import React, { useState } from "react";
import { Trash2, Circle, Edit2, Save, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Task } from "../types/task.types";

interface TaskItemProps {
  task: Task;
  onComplete: (id: number) => void;
  onEdit: (id: number, title: string, description: string) => void;
  onDelete: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onComplete,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");

  const handleSave = () => {
    onEdit(task.id, editTitle, editDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setIsEditing(true);
  };

  return (
    <Card className="transition-all hover:shadow-md bg-white">
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task title"
              className="font-semibold"
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel} size="sm">
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <button
              onClick={() => onComplete(task.id)}
              className="mt-1"
              aria-label="Mark task as complete"
            >
              <Circle className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
              )}
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                onClick={handleEdit}
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                size="sm"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => onDelete(task)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
