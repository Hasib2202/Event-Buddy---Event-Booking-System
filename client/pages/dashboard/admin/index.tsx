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
  location: string;
  registrations: number;
}

export default function AdminDashboard() {
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

        const response = await axios.get<Event[]>("http://localhost:3001/admin/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEvents(response.data);
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Admin Dashboard
          </h2>
          <p className="text-gray-600 mb-8">
            Manage events, view registrations, and monitor your platform.
          </p>

          {/* Events Management */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Events Management
            </h3>
            {loading ? (
              <p>Loading events...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registrations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {event.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.registrations}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-purple-600 hover:text-purple-900 mr-4">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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