import { useForm } from 'react-hook-form';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import type { FieldError } from 'react-hook-form';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

// Response Type Definitions
interface SuccessResponse {
  message: string;
}

interface ValidationError {
  message: string;
  errors: {
    [key: string]: string[];
  };
}

interface ConflictError {
  message: string;
  error: string;
  statusCode: number;
}

type ApiResponse = SuccessResponse | ValidationError | ConflictError;

// Type Guards
const isValidationError = (data: ApiResponse): data is ValidationError => {
  return (data as ValidationError).errors !== undefined;
};

const isConflictError = (data: ApiResponse): data is ConflictError => {
  return (data as ConflictError).statusCode === 409;
};

// Updated component
export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>();

  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await axios.post<ApiResponse>('http://localhost:3001/auth/register', data, {
        validateStatus: (status) => status < 500,
      });

      // Handle 409 Conflict (Email exists)
      if (isConflictError(res.data)) {
        setError('email', {
          type: 'manual',
          message: res.data.message,
        });
        return;
      }

      // Handle 400 Validation Errors
      if (isValidationError(res.data)) {
        Object.entries(res.data.errors).forEach(([field, messages]) => {
          setError(field as keyof RegisterFormData, {
            type: 'manual',
            message: messages.join(' '),
          });
        });
        return;
      }

      // Success case
      if (res.status === 201) {
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => router.push('/auth/login'), 2000);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse>;
      
      // Handle known error types
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;
        
        if (isConflictError(errorData)) {
          setError('email', {
            type: 'manual',
            message: errorData.message,
          });
        } else if (isValidationError(errorData)) {
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            setError(field as keyof RegisterFormData, {
              type: 'manual',
              message: messages.join(' '),
            });
          });
        } else {
          toast.error(errorData.message || 'Registration failed');
        }
      } else {
        toast.error('Network error. Please try again.');
      }
    }
  };

  // ... rest of the component remains the same ...
  const getInputClasses = (field: keyof RegisterFormData) => {
    return `mt-1 block w-full px-3 py-2 border ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-purple-500 focus:border-purple-500 sm:text-sm`;
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-purple-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-900 flex items-center justify-center">
            <span className="mr-2">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#4F46E5" />
                <path d="M18 10C18 11.1 17.1 12 16 12C14.9 12 14 11.1 14 10C14 8.9 14.9 8 16 8C17.1 8 18 8.9 18 10ZM16 14C13.33 14 8 15.34 8 18V20H24V18C24 15.34 18.67 14 16 14ZM10 10C10 8.9 9.1 8 8 8C6.9 8 6 8.9 6 10C6 11.1 6.9 12 8 12C9.1 12 10 11.1 10 10ZM8 14C5.33 14 0 15.34 0 18V20H8V18C8 16.82 8.54 15.72 9.38 14.76C8.88 14.84 8.37 14.91 8 14.91Z" fill="white" />
              </svg>
            </span>
            Event buddy.
          </h1>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create an account</h2>
          <p className="text-sm text-gray-600 mb-6">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Login here
            </Link>
          </p>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={getInputClasses('name')}
                  placeholder="Enter your full name"
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={getInputClasses('email')}
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={getInputClasses('password')}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                    validate: {
                      hasNumber: value => /\d/.test(value) || 'Password needs at least 1 number',
                      hasSpecial: value => /[!@#$%^&*]/.test(value) || 'Password needs at least 1 special character',
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Registering...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}