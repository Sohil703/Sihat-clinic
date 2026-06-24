import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useStore } from '../../hooks/useStore.jsx';

const icons = {
  success: <CheckCircle size={16} />,
  error: <AlertCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

const Toast = () => {
  const { toast } = useStore();
  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type}`}>
        {icons[toast.type] || icons.success}
        {toast.msg}
      </div>
    </div>
  );
};

export default Toast;

