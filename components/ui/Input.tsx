import React from 'react';

export const Input = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2 group">
      {label && <label className="text-xs font-bold uppercase tracking-wider text-gray-500 group-focus-within:text-indigo-400 transition-colors">{label}</label>}
      <input
        className={`glass-input flex h-12 w-full rounded-xl px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

export const TextArea = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2 group">
      {label && <label className="text-xs font-bold uppercase tracking-wider text-gray-500 group-focus-within:text-indigo-400 transition-colors">{label}</label>}
      <textarea
        className={`glass-input flex min-h-[120px] w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none ${className}`}
        {...props}
      />
    </div>
  );
};