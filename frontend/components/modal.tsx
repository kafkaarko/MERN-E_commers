// components/Modal.tsx
"use client";

import { ReactNode } from "react";
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-xl border border-gray-200 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
