"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import DeleteConfirmationModal from "./Modals/deleteTaskModal";
import ClearAllTasksModal from "./Modals/clearTaskModal";
import { useRouter } from "next/navigation";
import { useTodoContext } from "../contexts/TodoContext";

interface Errors {
  title: string;
  description: string;
}

const TodoList: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({ title: "", description: "" });
  const router = useRouter();

  // for deletion
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<number | null>(null);

  // for clear all modal
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  // Use context
  const { todos, setTodos, addTodo, toggleTodo, deleteTodo, clearAllTodos } = useTodoContext();

  // Calculate completed todos
  const completedTodos = todos.filter(todo => todo.completed).length;

  // Load todos from localStorage on first render
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    } else {
      // Fetch initial todos only if there's no data in localStorage
      const fetchTodos = async () => {
        try {
          const response = await fetch("https://jsonplaceholder.typicode.com/todos");
          const data: Todo[] = await response.json();
          const initialTodos = data.slice(0, 5); // Load only 5 todos
          setTodos(initialTodos);
          localStorage.setItem("todos", JSON.stringify(initialTodos)); // Save to localStorage
        } catch (error) {
          console.error("Error fetching todos:", error);
        }
      };
      fetchTodos();
    }
  }, [setTodos]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const TITLE_MAX_LENGTH = 150;
  const DESCRIPTION_MAX_LENGTH = 500;

  const clearAll = () => {
    clearAllTodos();
    localStorage.removeItem("todos"); // Remove from localStorage when clearing all
    setIsClearAllModalOpen(false);
  };

  const handleEditClick = (id: number) => {
    router.push(`/todos/${id}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear any previous errors
    setErrors({ title: "", description: "" });

    // Validation
    let hasError = false;
    if (!title.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: "Title is required.",
      }));
      hasError = true;
    } else if (title.length > TITLE_MAX_LENGTH) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: `Title cannot exceed ${TITLE_MAX_LENGTH} characters.`,
      }));
      hasError = true;
    }

    if (description.length > DESCRIPTION_MAX_LENGTH) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters.`,
      }));
      hasError = true;
    }

    // If there's an error, do not submit the form
    if (hasError) return;

    // Create new todo using the context function
    const newTodo = {
      id: Date.now(),
      title,
      description,
      completed: false,
    };
    addTodo(newTodo);
    setTitle("");
    setDescription("");
  };

  const toggleTodoCompletion = (id: number) => {
    toggleTodo(id);
  };

  const openDeleteModal = (id: number) => {
    setTodoToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const deleteSelectedTodo = () => {
    if (todoToDelete !== null) {
      deleteTodo(todoToDelete);
      setIsDeleteModalOpen(false);
      setTodoToDelete(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 px-4 sm:mt-16 sm:px-0">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#11175E] mb-6 sm:mb-8">
        Daily To Do List
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6 sm:mb-8">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value.slice(0, TITLE_MAX_LENGTH))
            }
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          <div className="flex justify-end text-xs sm:text-sm text-gray-500 mt-1">
            {errors.title ? (
              <p className="text-red-500">{errors.title}</p>
            ) : (
              <p>
                {title.length}/{TITLE_MAX_LENGTH}
              </p>
            )}
          </div>
        </div>
        <div>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value.slice(0, DESCRIPTION_MAX_LENGTH))
            }
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 sm:h-24 ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="text-red-500 mt-1 text-xs sm:text-sm">
              {errors.description}
            </p>
          )}

          <div className="flex justify-end text-xs sm:text-sm text-gray-500 mt-1">
            <p>
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 sm:px-8 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out text-sm sm:text-base"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="space-y-3 sm:space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between space-x-2 sm:space-x-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center flex-1 min-w-0">
              <button
                onClick={() => toggleTodoCompletion(todo.id)}
                className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
                  todo.completed ? "bg-green-500" : "border-gray-300"
                }`}
              >
                {todo.completed ? (
                  <Image
                    src="/images/checkIcon.svg"
                    alt="Check"
                    width={20}
                    height={20}
                  />
                ) : (
                  <span></span>
                )}
              </button>
              <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                <h1
                  className={`text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis text-[#001747] ${
                    todo.completed ? "text-gray-400 line-through" : ""
                  }`}
                >
                  {todo.title}
                </h1>
                <span
                  className={`text-xs block whitespace-nowrap overflow-hidden text-ellipsis ${
                    todo.completed ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {todo.description || "No Description"}
                </span>
              </div>
            </div>
            {!todo.completed && (
              <div className="flex space-x-2 sm:space-x-3 flex-shrink-0">
                <button
                  className="text-blue-500"
                  onClick={() => handleEditClick(todo.id)}
                >
                  <Image
                    src="/images/editIcon.svg"
                    alt="Edit"
                    width={20}
                    height={20}
                  />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => openDeleteModal(todo.id)}
                >
                  <Image
                    src="/images/deleteIcon.svg"
                    alt="Delete"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 sm:mt-6 flex justify-between items-center text-xs sm:text-sm text-gray-500">
        <span>{completedTodos} item selected</span>
        <button
          onClick={() => setIsClearAllModalOpen(true)}
          className="text-blue-500"
        >
          Clear All
        </button>
      </div>

      {/* DELETE MODAL */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={deleteSelectedTodo}
      />

      {/* CLEAR ALL MODAL */}
      <ClearAllTasksModal
        isOpen={isClearAllModalOpen}
        onClose={() => setIsClearAllModalOpen(false)}
        onClearAll={clearAll}
      />
    </div>
  );
};

export default TodoList;