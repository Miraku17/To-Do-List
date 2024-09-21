import React from "react";
import Image from "next/image";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Image
              src="/images/closeIcon.svg"
              alt="Edit"
              width={25}
              height={25}
            />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-[#1E2C71] mb-4 text-center">
          Delete Task
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Are you sure you want to delete this task? This action cannot be
          undone.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#3355A8] text-white rounded hover:bg-[#2A4482] transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-6 py-2 bg-[#D7403A] text-white rounded hover:bg-[#B73632] transition duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
