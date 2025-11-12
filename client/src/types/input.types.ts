import React from "react";
import { InputHTMLAttributes, ReactNode } from "react";

// --------------------- TextInput Props ---------------------
export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  label?: string;
  icon?: ReactNode; // Allows passing icons like <HiUser />
  capitalize?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

// --------------------- PasswordInput Props ---------------------
export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

// --------------------- FormButton Props ---------------------
export interface FormButtonProps {
  loading?: boolean;
  text: string;
  className?: string;
  onClick?: () => void;
  outline?: boolean;
  type?: "reset" | "button" | "submit";
  name?: string;
  disabled?: boolean;
}
