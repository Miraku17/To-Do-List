import React from 'react';
import Navbar from "./components/navBar";
import TodoList from "./components/toDoList";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <TodoList />
      </main>
    </div>
  );
}