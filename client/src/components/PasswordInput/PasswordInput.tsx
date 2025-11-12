"use client";

import { PasswordInputProps } from "@/types/input.types";
import React, { useState, forwardRef } from "react";
import { HiEye, HiEyeOff, HiLockClosed } from "react-icons/hi";

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label = "Password",
      required = false,
      value,
      onChange,
      error,
      className = "",
      disabled = false,
      placeholder = "Enter your password",
      ...rest
    },
    ref
  ) => {
    const [show, setShow] = useState(false);

    return (
      <div className="flex flex-col space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-300">
            {label}
                {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div
          className={`flex items-center bg-[#1b1f2a] border ${
            error ? "border-red-500" : "border-[#2b3245]"
          } rounded-lg px-3 py-2 focus-within:border-blue-500 transition ${className}`}
        >
          <HiLockClosed className="text-gray-400 mr-2 text-lg" />

          <input
            ref={ref}
            value={value}
            onChange={onChange}
            type={show ? "text" : "password"}
            disabled={disabled}
            // required={required}
            placeholder={placeholder}
            {...rest}
            className={`bg-transparent flex-1 outline-none text-gray-100 placeholder-gray-500 ${
              disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          />

          {show ? (
            <HiEyeOff
              onClick={() => setShow(false)}
              className="text-gray-400 cursor-pointer text-lg"
            />
          ) : (
            <HiEye
              onClick={() => setShow(true)}
              className="text-gray-400 cursor-pointer text-lg"
            />
          )}
        </div>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
