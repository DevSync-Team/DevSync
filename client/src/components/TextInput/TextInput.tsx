"use client";

import { TextInputProps } from "@/types/input.types";
import React, { forwardRef } from "react";

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      name,
      value,
      placeholder,
      onChange,
      label,
      type = "text",
      className = "",
      capitalize = false,
      disabled = false,
      required = true,
      icon,
      error,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="flex flex-col space-y-2">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-300">
            {label}
             {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div
          className={`flex items-center bg-[#1b1f2a] border ${
            error ? "border-red-500" : "border-[#2b3245]"
          } rounded-lg px-3 py-2 focus-within:border-blue-500 transition ${className}`}
        >
          {icon && <span className="text-gray-400 mr-2 text-lg">{icon}</span>}

          <input
            ref={ref}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            disabled={disabled}
            // required={required}
            {...rest}
            className={`bg-transparent flex-1 outline-none text-gray-100 placeholder-gray-500 ${
              capitalize ? "capitalize" : ""
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          />
        </div>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
export default TextInput;
