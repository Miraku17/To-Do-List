"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTodoContext } from "@/app/contexts/TodoContext";

const EditTaskPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string, 10);

  const { todos, updateTodo } = useTodoContext();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [generalError, setGeneralError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const TITLE_MAX_LENGTH = 150;
  const DESCRIPTION_MAX_LENGTH = 500;

  useEffect(() => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setTitle(todo.title || "");
      setDescription(todo.description || "");
    } else {
      setGeneralError("Task not found");
    }
  }, [id, todos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous errors and success messages
    setTitleError("");
    setDescriptionError("");
    setGeneralError("");
    setSuccessMessage("");

    // Validation
    let hasError = false;
    if (!title.trim()) {
      setTitleError("Title cannot be empty.");
      hasError = true;
    } else if (title.length > TITLE_MAX_LENGTH) {
      setTitleError(`Title cannot exceed ${TITLE_MAX_LENGTH} characters.`);
      hasError = true;
    }

    // Safely check description length
    if (description && description.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(`Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters.`);
      hasError = true;
    }

    if (hasError) return;

    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, title, description };
      updateTodo(updatedTodo);
      setSuccessMessage("Task successfully updated!");

      // Automatically redirect after a short delay
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      setGeneralError("Task not found");
    }
  };

  if (generalError === "Task not found") {
    return (
      <div className="max-w-md mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-6">{generalError}</h1>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-[#1E2C71] text-white rounded-md hover:bg-[#161E4E] transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6">
        <h1 className="text-5xl font-bold text-[#1E2C71] mb-6">Edit Task</h1>

        {/* Display success message */}
        {successMessage && (
          <div className="text-green-500 text-sm mb-4">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Task title"
            />
            {titleError && <div className="text-red-500 text-sm mt-1">{titleError}</div>}
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Task description"
            />
            {descriptionError && <div className="text-red-500 text-sm mt-1">{descriptionError}</div>}
          </div>

          {/* Display general error message */}
          {generalError && <div className="text-red-500 text-sm mb-4">{generalError}</div>}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-8 py-2 bg-[#1E2C71] text-white rounded-md hover:bg-[#161E4E] transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#3355A8] text-white rounded-md hover:bg-[#2A4482] transition duration-300"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskPage;