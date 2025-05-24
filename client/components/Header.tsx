import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-4 px-6 md:px-12 flex justify-between items-center z-20 relative">
            <div className="flex items-center">
                <Link href="/">
                    <h1 className="text-3xl font-bold text-purple-900 flex items-center justify-center">
                        <span className="mr-2">
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
                        Event buddy.
                    </h1>
                </Link>
            </div>
            <div className="flex space-x-4">
                <Link
                    href="/auth/login"
                    className="text-white px-4 py-2 rounded-md bg-[linear-gradient(to_right,#7B8BFF,#4157FE)] hover:bg-[linear-gradient(to_right,#6A7AFF,#3046ED)] transition duration-200 text-sm md:text-base"
                >
                    Sign in
                </Link>
                <Link
                    href="/auth/register"
                    className="text-white px-4 py-2 rounded-md bg-[linear-gradient(to_right,#7B8BFF,#4157FE)] hover:bg-[linear-gradient(to_right,#6A7AFF,#3046ED)] transition duration-200 text-sm md:text-base"
                >
                    Sign up
                </Link>
            </div>
        </header>
    );
}