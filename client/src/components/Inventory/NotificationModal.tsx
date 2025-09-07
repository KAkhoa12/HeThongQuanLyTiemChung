import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type
}) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'ri-check-line',
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        };
      case 'error':
        return {
          icon: 'ri-error-warning-line',
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        };
      case 'warning':
        return {
          icon: 'ri-alert-line',
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700'
        };
      case 'info':
      default:
        return {
          icon: 'ri-information-line',
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        };
    }
  };

  const { icon, iconColor, bgColor, borderColor, titleColor, messageColor } = getIconAndColor();

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl relative">
        <div className={`p-6 ${bgColor} border ${borderColor} rounded-lg`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <i className={`${icon} ${iconColor} text-2xl`}></i>
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-lg font-medium ${titleColor}`}>
                {title}
              </h3>
              <div className="mt-2">
                <p className={`text-sm ${messageColor}`}>
                  {message}
                </p>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={onClose}
                className={`${titleColor} hover:opacity-75`}
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium ${titleColor} bg-white border ${borderColor} rounded-md hover:bg-gray-50`}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;