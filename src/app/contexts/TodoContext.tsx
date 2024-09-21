"use client";
// TodoContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TodoContextType {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
  clearAllTodos: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const sortTodos = (updatedTodos: Todo[]) => {
    return updatedTodos.sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
  };

  const addTodo = (todo: Todo) => {
    setTodos(prevTodos => sortTodos([...prevTodos, todo]));
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(prevTodos => 
      sortTodos(prevTodos.map(todo => 
        todo.id === updatedTodo.id ? updatedTodo : todo
      ))
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      sortTodos(prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ))
    );
  };

  const clearAllTodos = () => {
    setTodos([]);
  };

  return (
    <TodoContext.Provider value={{ 
      todos, 
      setTodos,
      addTodo, 
      updateTodo, 
      deleteTodo, 
      toggleTodo, 
      clearAllTodos 
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};
