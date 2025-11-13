"use client";

import { FormButton, PasswordInput, TextInput } from "@/components"; // Assuming these components exist
import Link from "next/link";
import { useForm } from "react-hook-form";
import { HiMail, HiUser, HiUserAdd } from "react-icons/hi";
import { SignupFormData, signupSchema } from "./schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { apiSignup } from "@/api/auth.api"; 
import { useRouter } from "next/navigation"; 

export default function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
 
    mode: "onChange", 
    
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await apiSignup(data);

      toast.success("Account created successfully! Redirecting to sign-in.", {
        position: "top-center",
      });

      reset(); 
      router.push("/signin");

    } catch (err) {
      const errorMessage = (err as Error).message;

      toast.error(errorMessage);

      if (errorMessage.includes("Email already exists")) {
        setError("email", {
            type: "manual",
            message: errorMessage,
        }, { shouldFocus: true });
      }
    }
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