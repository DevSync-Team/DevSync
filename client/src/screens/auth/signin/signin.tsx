// src/screens/auth/signin/SigninForm.tsx

"use client";

import { FormButton, Navbar, PasswordInput, TextInput } from "@/components";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaCode } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { SignInFormData, signinSchema } from "./schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";  
import { apiLogin } from "@/api/auth.api";  
import { useRouter } from "next/navigation"; 

export default function SigninForm() {
  const router = useRouter(); 
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      // 1. Call the API login function (handles cookie setting internally)
      await apiLogin(data);

      // 2. Show Success Toast
      toast.success("Login successful! Redirecting...", {
        position: "top-center",
      });

      // 3. Redirect the user to the protected dashboard
      router.push("/dashboard"); 

    } catch (err) {
      const errorMessage = (err as Error).message;
      
 
      toast.error(errorMessage);

     
      if (errorMessage.includes("Invalid credentials")) {
        setError("password", {  
            type: "manual",
            message: "Invalid email or password. Please try again.",
        }, { shouldFocus: true });
      }
    }
  };

  return (
     <>
     <Navbar />
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
            placeholder="Enter your password"
            required
            {...register("password")}
            error={errors.password?.message}
          />

          <FormButton text="Sign in" type="submit" loading={isSubmitting} />
        </form>

        <p className="text-center text-gray-400 text-sm">
          Don't have an account?
          <Link href="/signup" className="text-blue-400 hover:underline ml-1">
            Sign up
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500">
          <a href="/forgot-password" className="text-blue-400 hover:underline">
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
    </>
  );
}