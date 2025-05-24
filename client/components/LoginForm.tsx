// components/LoginForm.tsx
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

interface LoginFormData {
  email: string;
  password: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>();

  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await axios.post<{ access_token: string }>(
        "http://localhost:3001/auth/login",
        data,
        {
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 401) {
        throw { 
          response: { 
            data: { message: "Invalid email or password" },
            status: 401
          } 
        };
      }

      if (res.status >= 400) {
        throw new Error("An unexpected error occurred");
      }

      toast.success("Login successful!");
      
      const { access_token } = res.data;
      const decoded = jwtDecode<JwtPayload>(access_token);

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify({
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role
      }));

      router.push(decoded.role === "admin" ? "/dashboard/admin" : "/dashboard/user");
    } catch (err) {
      const error = err as ApiError;
      
      console.error("Login error:", error);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || "Login failed. Please try again.";

      if (error.response?.status === 401) {
        setError("root", { type: "manual", message: errorMessage });
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-purple-50 relative">
      {/* Top-left Logo */}
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" rx="4" fill="#4F46E5" />
            <path
              d="M18 10C18 11.1 17.1 12 16 12C14.9 12 14 11.1 14 10C14 8.9 14.9 8 16 8C17.1 8 18 8.9 18 10ZM16 14C13.33 14 8 15.34 8 18V20H24V18C24 15.34 18.67 14 16 14ZM10 10C10 8.9 9.1 8 8 8C6.9 8 6 8.9 6 10C6 11.1 6.9 12 8 12C9.1 12 10 11.1 10 10ZM8 14C5.33 14 0 15.34 0 18V20H8V18C8 16.82 8.54 15.72 9.38 14.76C8.88 14.84 8.37 14.91 8 14.91Z"
              fill="white"
            />
          </svg>
          <span className="text-2xl font-bold text-purple-900">Event buddy.</span>
        </Link>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign in</h2>
          <p className="text-sm text-gray-600 mb-6">
            New User?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Create an account
            </Link>
          </p>

          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none text-sm ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none text-sm ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {errors.root && (
              <p className="text-sm text-red-600 text-center">
                {errors.root.message}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}