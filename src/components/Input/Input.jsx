import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", name, placeholder, className = "", ...props },
  ref
) {
  const id = useId();
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        ref={ref}
        name={name}
        placeholder={placeholder}
        className={`block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
        {...props}
      />
    </div>
  );
});

export default Input;
