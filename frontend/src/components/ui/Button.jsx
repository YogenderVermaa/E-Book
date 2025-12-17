import React from 'react';

const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  icon: Icon,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-orange-400 to-orange-500 hover:bg-orange-700 text-whilte',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    danger: 'bg-transparent hover:bg-red-50 text-red-600',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8 rounded-lg',
    md: 'px-4 py-2.5 text-sm h-11 rounded-xl',
    lg: 'px-6 py-3 text-base h-12 rounded-xl',
  };
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className=""
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={4}
          ></circle>
          <path className="" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      ) : (
        <>
          {Icon && <Icon className="" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
