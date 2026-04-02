import React from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, footer, className }, ref) => {
    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div
          ref={ref}
          className={clsx(
            "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50",
            "w-full max-w-md mx-4 bg-white dark:bg-slate-900 rounded-lg shadow-xl",
            "animate-slide-in",
            className
          )}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="p-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-800">
              {footer}
            </div>
          )}
        </div>
      </>
    );
  }
);

Modal.displayName = "Modal";
