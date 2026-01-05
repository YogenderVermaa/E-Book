const SelectedField = ({ icon: Icon, label, name, options, ...props }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name}>{label}</label>

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Icon />
          </div>
        )}

        <select
          id={name}
          name={name}
          {...props}
          className={`w-full h-11 px-3 border border-gray-300 rounded-xl bg-white text-gray-900 
          focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all appearance-none
          ${Icon ? 'pl-10' : ''}`}
        >
          {options?.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>

        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default SelectedField;
