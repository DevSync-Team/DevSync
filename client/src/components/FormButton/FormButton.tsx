"use client";

import { FormButtonProps } from "@/types/input.types";
import React from "react";

export default function FormButton({
  loading = false,
  text,
  className = "",
  onClick,
  outline = false,
  type = "button",
  name,
  disabled = false,
}: FormButtonProps) {
  return (
    <button
      type={type}
      name={name}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full mt-4 flex justify-center items-center font-semibold py-3 rounded-lg transition ${
        outline
          ? "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          : "bg-linear-to-r from-blue-500 to-cyan-400 text-white hover:opacity-90"
      } ${
        disabled || loading ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      ) : (
        text
      )}
    </button>
  );
}
