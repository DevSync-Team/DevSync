"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  color?: string; // text color
  backgroundColor?: string; // background color
  outline?: boolean;
  icon?: React.ReactNode; // optional icon
  iconPosition?: "left" | "right"; // optional icon position
}

const Button: React.FC<ButtonProps> = ({
  text,
  color = "text-white",
  backgroundColor = "bg-blue-600",
  outline = false,
  icon,
  iconPosition = "left",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200";
  const filledStyles = `${backgroundColor} ${color} hover:opacity-90`;
  const outlineStyles = "border border-gray-400 text-gray-700 hover:bg-gray-50";

  const buttonClass = outline
    ? `${baseStyles} ${outlineStyles} ${className}`
    : `${baseStyles} ${filledStyles} ${className}`;

  return (
    <button {...props} className={buttonClass.trim()}>
      {icon && iconPosition === "left" && <span className="text-lg">{icon}</span>}
      <span>{text}</span>
      {icon && iconPosition === "right" && <span className="text-lg">{icon}</span>}
    </button>
  );
};

export default Button;
