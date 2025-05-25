import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  eventDate: string;
  location: string;
  bookedSeats: number;
  totalSeats: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Admin");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserName(user.name || "Admin");

        const response = await axios.get<Event[]>(
          "http://localhost:3001/admin/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-3xl font-bold text-[#250a63] flex items-center">
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
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-[#250a63]">
              Hello, {userName}
            </span>

            <button
              onClick={handleLogout}
              className="bg-[linear-gradient(to_right,#7B8BFF,#4157FE)] hover:bg-[linear-gradient(to_right,#6A7AFF,#3046ED)] transition duration-200 px-4 py-2 rounded-md text-sm font-medium flex items-center text-white transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-[#250a63]">
                  Admin Dashboard
                </h2>
                <p className="text-gray-600 mt-1 text-sm">
                  Manage events, view registrations, and monitor your platform.
                </p>
              </div>
              <Link
                href="/admin/events/create"
                className="bg-[linear-gradient(to_right,#7B8BFF,#4157FE)] hover:bg-[linear-gradient(to_right,#6A7AFF,#3046ED)] transition duration-200 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Create Event
              </Link>
            </div>
          </div>

          {/* Events Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Title",
                    "Date",
                    "Location",
                    "Registrations",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-x font-medium text-[#250a63] uppercase tracking-wider border-b border-gray-200"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading events...
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No events found
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-[#250a63] font-medium">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#250a63]">
                        {formatDate(event.eventDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#250a63]">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#250a63]">
                        {event.bookedSeats}/{event.totalSeats}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#250a63]">
                        <div className="flex gap-3">
                          <button
                            className="hover:text-[#4157FE] transition-colors"
                            title="View"
                          >
                            <Eye className="w-5 h-5 text-[#250a63]" />
                          </button>
                          <button
                            className="hover:text-[#4157FE] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5 text-[#250a63]" />
                          </button>
                          <button
                            className="hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
