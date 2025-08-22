import toast from 'react-hot-toast';

export type ToastType = 'success' | 'warning' | 'error';

const createToast = (title: string, msg: string, type: ToastType) => {
  // Sử dụng toast cơ bản thay vì custom để dễ debug
  const toastId = `toast-${Date.now()}`;
  
  if (type === 'success') {
    return toast.success(`${title}: ${msg}`, {
      id: toastId,
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#04b20c',
        color: '#fff',
        fontSize: '14px',
        padding: '16px',
      },
    });
  } else if (type === 'warning') {
    return toast(`${title}: ${msg}`, {
      id: toastId,
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#eab90f',
        color: '#fff',
        fontSize: '14px',
        padding: '16px',
      },
    });
  } else {
    return toast.error(`${title}: ${msg}`, {
      id: toastId,
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#e13f32',
        color: '#fff',
        fontSize: '14px',
        padding: '16px',
      },
    });
  }
};

export const useToast = () => {
  const showSuccess = (title: string, message: string) => {
    createToast(title, message, 'success');
  };

  const showWarning = (title: string, message: string) => {
    createToast(title, message, 'warning');
  };

  const showError = (title: string, message: string) => {
    createToast(title, message, 'error');
  };

  return {
    showSuccess,
    showWarning,
    showError
  };
}; 