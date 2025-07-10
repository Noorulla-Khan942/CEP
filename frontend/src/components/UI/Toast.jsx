import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose, 
  className = '' 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-500" />
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      icon: <XCircle className="w-5 h-5 text-yellow-500" />
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      icon: <CheckCircle className="w-5 h-5 text-blue-500" />
    }
  };

  const currentType = typeStyles[type] || typeStyles.info;

  return (
    <div 
      className={`fixed top-4 right-4 z-50 rounded-md p-4 shadow-lg ${currentType.bg} ${currentType.text} ${className}`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {currentType.icon}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            {message}
          </p>
        </div>
        <div className="ml-4 pl-3">
          <button
            onClick={handleClose}
            className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <span className="sr-only">Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;