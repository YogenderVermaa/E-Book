import React from 'react';

const InputField = ({ label, name, icon: Icon, ...props }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="">
        {label}
      </label>
      <div className="">
        {Icon && (
          <div className="">
            <Icon className="" />
          </div>
        )}
        <input
          id={name}
          name={name}
          {...props}
          className={`w-full h-11 px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all
            ${Icon ? 'pl:10' : ''}`}
        />
      </div>
    </div>
  );
};

export default InputField;
