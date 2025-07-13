import React from 'react';

export default function Button({ children, onClick, className = '' }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-semibold ${className}`}
    >
      {children}
    </button>
  );
}
