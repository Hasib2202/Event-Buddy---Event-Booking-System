import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Footer from "@/components/Footer";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const response = await axios.get("http://localhost:3001/user/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEvents(response.data as Event[]);
      } catch (error) {
        toast.error("Failed to fetch events");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-900 flex items-center">
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
          <button
            onClick={handleLogout}
            className="text-sm text-purple-600 hover:text-purple-800"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome back, User!
          </h2>
          <p className="text-gray-600 mb-8">
            Here you can manage your event registrations.
          </p>

          {/* My Registered Events */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              My Registered Events
            </h3>
            {loading ? (
              <p>Loading your events...</p>
            ) : events.length === 0 ? (
              <p className="text-gray-500">You haven't registered for any events yet.</p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {event.title}
                        </h4>
                        <div className="flex space-x-4 mt-2">
                          <span className="text-sm text-gray-500">
                            {event.date}
                          </span>
                          <span className="text-sm text-gray-500">
                            {event.time}
                          </span>
                          <span className="text-sm text-gray-500">
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-800 text-sm">
                        Cancel Registration
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create new events section */}
          <div className="space-y-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Create new event
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium ml-4">
              Create registration
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
              <Link href="/auth/login" className="text-gray-500 hover:text-gray-700">
                Sign-in
              </Link>
              <Link href="/auth/register" className="text-gray-500 hover:text-gray-700">
                Sign-up
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700">
                Privacy Policy
              </Link>
            </div>
            <p className="mt-4 md:mt-0 text-sm text-gray-500">
              © 2025 Eventbuddy. All rights reserved.
            </p>
          </div>
        </div>
      </footer> */}
      <Footer />
    </div>
  );
}