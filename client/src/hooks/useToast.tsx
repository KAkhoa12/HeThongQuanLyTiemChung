import toast from 'react-hot-toast';
import React from 'react';

export type ToastType = 'success' | 'warning' | 'error';

const createCustomToast = (title: string, msg: string, type: ToastType) => {
  const toastId = `toast-${Date.now()}`;
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#04b20c';
      case 'warning': return '#eab90f';
      case 'error': return '#e13f32';
      default: return '#04b20c';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '✅';
    }
  };
  
  return toast.custom(
    (t) => (
      <div
        style={{
          background: getBackgroundColor(),
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: '300px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <span style={{ marginRight: '12px', fontSize: '18px' }}>
            {getIcon()}
          </span>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{title}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>{msg}</div>
          </div>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            marginLeft: '16px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            lineHeight: 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ×
        </button>
      </div>
    ),
    {
      id: toastId,
      duration: type === 'error' ? 5000 : 4000,
      position: 'top-right',
    }
  );
};

export const useToast = () => {
  const showSuccess = (title: string, message: string) => {
    createCustomToast(title, message, 'success');
  };

  const showWarning = (title: string, message: string) => {
    createCustomToast(title, message, 'warning');
  };

  const showError = (title: string, message: string) => {
    createCustomToast(title, message, 'error');
  };

  return {
    showSuccess,
    showWarning,
    showError
  };
}; 