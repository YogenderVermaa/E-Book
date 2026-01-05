const InputField = ({ label, name, icon: Icon, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        )}

        <input
          id={name}
          name={name}
          {...props}
          className={`w-full h-11 rounded-xl border border-gray-300 bg-white px-3 text-gray-900 
          placeholder-gray-400 transition
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500
          ${Icon ? 'pl-10' : ''}
          ${className}`}
        />
      </div>
    </div>
  );
};

export default InputField;
