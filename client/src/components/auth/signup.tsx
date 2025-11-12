'use client'
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, CheckCircle } from 'lucide-react'; // Import necessary icons

// 1. Define the component's state/types
interface SignUpFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (error) setError(null); // Clear error on change
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // 2. Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    // You would typically omit confirmPassword when sending to the API
    const { confirmPassword, ...dataToSend } = formData;
    console.log('Signup attempt with:', dataToSend);

    // --- Placeholder for actual API Call/Registration Logic ---
    try {
      // Simulate successful signup and redirect
      alert('Signup successful! Redirecting to login...');
      router.push('/auth/login');

    } catch (error) {
      console.error('An error occurred during signup:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d111c] px-4"> {/* Dark background */}
      <div className="w-full max-w-md rounded-lg bg-[#161b2b] p-8 shadow-xl"> {/* Darker card background */}
        <div className="mb-6 flex flex-col items-center">
          {/* Logo/Icon */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
            <CheckCircle size={32} /> {/* Using CheckCircle icon for the sign up logo */}
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Join DevSync</h1>
          <p className="text-gray-400">Create your account and start collaborating</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Display Error Message */}
          {error && (
            <div className="mb-4 rounded-md bg-red-800 p-3 text-sm text-white" role="alert">
              {error}
            </div>
          )}

          {/* Full Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full rounded-md border border-gray-700 bg-[#0d111c] py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-700 bg-[#0d111c] py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Create a password"
                className="w-full rounded-md border border-gray-700 bg-[#0d111c] py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Confirm your password"
                className="w-full rounded-md border border-gray-700 bg-[#0d111c] py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 py-2 font-semibold text-white transition duration-150 ease-in-out hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#161b2b]"
          >
            Create Account
          </button>
        </form>

        {/* Link to Login & Terms */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a
            onClick={() => router.push('/login')}
            className="cursor-pointer font-medium text-blue-500 hover:text-blue-400"
          >
            Sign in
          </a>
        </p>

        <p className="mt-4 text-center text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-blue-500 hover:text-blue-400">Terms of Service</a> and{' '}
          <a href="#" className="text-blue-500 hover:text-blue-400">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;