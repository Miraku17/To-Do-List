"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="font-bold text-xl">COMPANY NAME</span>
          </div>
          <div className="hidden sm:flex items-center">
            <div className="sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="#"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Menu One
              </a>
              <a
                href="#"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Menu Two
              </a>
            </div>
            <div className="ml-6 flex items-center space-x-4">
              <Image
                src="/images/bellIcon.svg"
                alt="Bell Icon"
                width={20}
                height={20}
              />
              <Image
                src="/images/gearIcon.svg"
                alt="Gear Icon"
                width={20}
                height={20}
              />
              <Image
                src="/images/userIcon.svg"
                alt="User Icon"
                width={25}
                height={25}
              />
            </div>
          </div>
          <div className="sm:hidden flex items-center space-x-4">
            <Image
              src="/images/bellIcon.svg"
              alt="Bell Icon"
              width={20}
              height={20}
            />
            <Image
              src="/images/gearIcon.svg"
              alt="Gear Icon"
              width={20}
              height={20}
            />
            <Image
              src="/images/userIcon.svg"
              alt="User Icon"
              width={25}
              height={25}
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="block text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-base font-medium"
            >
              Menu One
            </a>
            <a
              href="#"
              className="block text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-base font-medium"
            >
              Menu Two
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;