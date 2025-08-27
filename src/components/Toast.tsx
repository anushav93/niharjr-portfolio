import React, { useEffect, useState } from 'react';
import Typography from './Typography';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

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

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? '✓' : '✕';

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-in slide-in-from-bottom-2 duration-300`}>
      <span className="text-lg font-bold">{icon}</span>
      <Typography variant="p" className="text-white text-sm">
        {message}
      </Typography>
      <button
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
