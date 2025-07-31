import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'tertiary';
  showPulse?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  showPulse = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', // iOS standard 20px
    lg: 'w-6 h-6'
  };

  const colorClasses = {
    primary: 'text-ios-label',
    secondary: 'text-ios-secondary-label',
    tertiary: 'text-ios-tertiary-label'
  };

  return (
    <div className={`relative ${showPulse ? 'animate-pulse' : ''}`}>
      {/* Outer breathing ring for enhanced feedback */}
      {showPulse && (
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-current opacity-20 animate-ping`} />
      )}

      {/* Main spinner */}
      <svg
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-ios-spin`}
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="32"
          strokeDashoffset="32"
          className="opacity-20"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="32"
          strokeDashoffset="24"
          strokeLinecap="round"
          className="animate-ios-spin-progress"
        />
      </svg>

      {/* Screen reader text */}
      <span className="sr-only">Loading...</span>
    </div>
  );
}