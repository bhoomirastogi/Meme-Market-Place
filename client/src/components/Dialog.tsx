// src/components/ui/Dialog.tsx
import type { ReactNode } from "react";

export function DialogBox({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center min-h-screen p-4">
      <div className="bg-[#1e1e2e] border border-pink-500 rounded-xl p-6 w-[90%] max-w-sm shadow-2xl">
        <h2 id="dialog-title" className="text-lg text-pink-400 font-bold mb-2">
          {title}
        </h2>
        <p className="text-white text-sm mb-4">{children}</p>
        <button
          onClick={onClose}
          className="px-4 py-1 bg-pink-600 text-white rounded hover:bg-pink-700"
        >
          OK
        </button>
      </div>
    </div>
  );
}
