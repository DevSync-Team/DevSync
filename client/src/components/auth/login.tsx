'use client'

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Code } from 'lucide-react'; // Import icons from lucide-react

// --- Make sure to install lucide-react if you haven't already ---
// npm install lucide-react
// or
// yarn add lucide-react
// -----------------------------------------------------------------

interface LoginFormState {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormState>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', formData);

    // --- Placeholder for actual API Call/Authentication Logic ---
    // Simulate successful login and redirect
    alert('Login successful! Redirecting...');
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d111c] px-4"> {/* Dark background */}
      <div className="w-full max-w-md rounded-lg bg-[#161b2b] p-8 shadow-xl"> {/* Darker card background */}
        <div className="mb-6 flex flex-col items-center">
          {/* Logo/Icon */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
            <Code size={32} /> {/* Using Code icon for the logo */}
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your DevSync account</p>
        </div>

        <form onSubmit={handleSubmit}>
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
          <div className="mb-6">
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
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-700 bg-[#0d111c] py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 py-2 font-semibold text-white transition duration-150 ease-in-out hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#161b2b]"
          >
            Sign In
          </button>
        </form>

        {/* Don't have an account? Sign up */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a
            onClick={() => router.push('/signup')}
            className="cursor-pointer font-medium text-blue-500 hover:text-blue-400"
          >
            Sign up
          </a>
        </p>

        {/* Demo Account Info */}
        <div className="mt-8 rounded-md bg-[#0d111c] p-4 text-center text-sm text-gray-400">
          <p className="font-semibold text-blue-400">Demo Account:</p>
          <p>Email: <span className="text-white">demo@devsync.dev</span></p>
          <p>Password: <span className="text-white">demo123</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;