// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-t border-blue-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section with Logo */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <span className="mr-3">
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
                </span>
                <h2 className="text-2xl font-bold text-purple-900">
                  Event buddy.
                </h2>
              </div>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              href="/auth/login" 
              className="text-gray-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200"
            >
              Sign in
            </Link>
            <Link 
              href="/auth/register" 
              className="text-gray-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200"
            >
              Sign up
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="text-center pt-4

 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © 2025 Event buddy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}