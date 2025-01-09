import React from "react";

function Button({
  children,
  type = "button",
  bgColor = "bg-themeColor",
  textColor = "text-white",
  className = "",
  icon = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center px-4 py-2 ${bgColor} ${textColor} rounded-md shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-themeColor transition duration-150 ease-in-out ${className}`}
      {...props}
    >
      {icon && <i className={`bi bi-${icon} mr-2`}></i>} {children}
    </button>
  );
}

export default Button;
