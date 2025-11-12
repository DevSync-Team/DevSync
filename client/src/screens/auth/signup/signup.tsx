"use client";

import { FormButton, PasswordInput, TextInput } from "@/components";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { HiMail, HiUser, HiUserAdd } from "react-icons/hi";
import { SignupFormData, signupSchema } from "./schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    console.log("Signup Data:", data);
    // Handle signup API call here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4">
      <div className="w-full flex flex-col gap-7  max-w-lg bg-[#111827] p-8 rounded-2xl shadow-lg border border-[#1f2937]">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-green-500 p-4 rounded-full flex justify-center items-center">
            <HiUserAdd size={30} className="text-white" />
          </div>
          <div className="flex flex-col gap-1 justify-center items-center">
            <h1 className="text-2xl font-semibold text-white">Join DevSync</h1>
            <p className="text-gray-400 text-sm">
              Create your account and start collaborating
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            icon={<HiUser />}
            {...register("fullName")}
            error={errors.fullName?.message}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            icon={<HiMail />}
            {...register("email")}
            error={errors.email?.message}
          />
          <PasswordInput
            label="Password"
            placeholder="Create a password"
            required
            {...register("password")}
            error={errors.password?.message}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <FormButton
            text="Create Account"
            type="submit"
            loading={isSubmitting}
          />
        </form>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
