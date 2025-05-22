// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
              Home
            </Link>
            <Link href="/auth/login" className="text-gray-500 hover:text-gray-700 text-sm">
              Sign in
            </Link>
            <Link href="/auth/register" className="text-gray-500 hover:text-gray-700 text-sm">
              Sign up
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Privacy Policy
            </Link>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-gray-500">
            © 2025 Eventbuddy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}