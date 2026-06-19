import React, { useEffect } from 'react';
import Typography from './Typography';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

/**
 * Toast notification component with theme-based colors
 */
export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // Theme-based color classes
  const colorClasses = {
    success: 'bg-success-500',
    error: 'bg-error-500',
    warning: 'bg-warning-500',
    info: 'bg-info-500',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 ${colorClasses[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-in slide-in-from-bottom-2 duration-300`}
    >
      <span className="text-lg font-bold">{icons[type]}</span>
      <Typography variant="p" className="text-white text-sm">
        {message}
      </Typography>
      <button
        onClick={onClose}
        className="ml-2 text-white hover:text-inverted transition-colors"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}
