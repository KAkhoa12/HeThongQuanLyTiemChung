import React from 'react';

interface PermissionSwitchProps {
  checked: boolean;
  onChange: () => void;
  isAssigned?: boolean;
  disabled?: boolean;
}

const PermissionSwitch: React.FC<PermissionSwitchProps> = ({ 
  checked, 
  onChange, 
  isAssigned = false,
  disabled = false
}) => {
  return (
    <label className={`flex select-none items-center ${
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
    }`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div className={`block h-8 w-14 rounded-full transition-colors ${
          disabled
            ? 'bg-gray-400 dark:bg-gray-600'
            : isAssigned 
              ? 'bg-green-500' 
              : checked 
                ? 'bg-primary' 
                : 'bg-meta-9 dark:bg-[#5A616B]'
        }`}></div>
        <div
          className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
            isAssigned ? '!right-1 !translate-x-full' : checked && '!right-1 !translate-x-full'
          }`}
        ></div>
      </div>
    </label>
  );
};

export default PermissionSwitch; 