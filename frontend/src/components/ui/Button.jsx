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
    primary:
      'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8 rounded-lg',
    md: 'px-4 py-2.5 text-sm h-11 rounded-xl',
    lg: 'px-6 py-3 text-base h-12 rounded-xl',
  };

  return (
    <button
      className={`
        inline-flex items-center gap-2 justify-center font-medium transition-all
        ${variants[variant]}
        ${sizes[size]}
        ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
          <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />} {/* Accepts icon component */}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
