"use client";

import { FormButton, PasswordInput, TextInput } from "@/components";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaCode } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { SignInFormData, signinSchema } from "./schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SigninForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = (data: SignInFormData) => {
    console.log("Form Data", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4">
      <div className="w-full flex flex-col gap-7 max-w-lg bg-[#111827] p-8 rounded-2xl shadow-lg border border-[#1f2937]">
        <div className="flex flex-col items-center gap-3">
          <div className=" bg-linear-to-r from-blue-500 to-cyan-400 text-white hover:opacity-90 p-4 rounded-full flex flex-col items-center">
            <FaCode size={30} />
          </div>
          <div className=" flex flex-col items-center gap-2">
            <h1 className="text-2xl font-semibold text-white">Welcome</h1>
            <p className="text-gray-400 text-sm mt-1">
              Sign in to your DevSync account
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Email"
            type="email"
            required
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

          <FormButton text="Sigin" type="submit" loading={isSubmitting} />
        </form>

        <p className="text-center text-gray-400 text-sm">
          Don't have an account?
          <Link href="/signup" className="text-blue-400 hover:underline ml-1">
            Sign up
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Terms of Service
          </a>
          and
          <a href="#" className="text-blue-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
