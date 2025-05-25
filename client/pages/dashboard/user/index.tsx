import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

interface Booking {
  id: number;
  seats: number;
  bookingDate: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  event: {
    id: number;
    title: string;
    description: string;
    eventDate: string;
    eventTime: string;
    location: string;
    totalSeats: number;
    availableSeats: number;
    eventImage: string;
    type: string;
  };
}

interface AggregatedEvent {
  eventId: number;
  event: {
    id: number;
    title: string;
    description: string;
    eventDate: string;
    eventTime: string;
    location: string;
    totalSeats: number;
    availableSeats: number;
    eventImage: string;
    type: string;
  };
  totalSeats: number;
  bookings: Booking[];
  latestBookingDate: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [aggregatedEvents, setAggregatedEvents] = useState<AggregatedEvent[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const response = await axios.get("http://localhost:3001/bookings/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedBookings = response.data as Booking[];
        setBookings(fetchedBookings);

        // Get user name from the first booking
        if (fetchedBookings.length > 0) {
          setUserName(fetchedBookings[0].user.name);
        }

        // Aggregate bookings by event
        const eventMap = new Map<number, AggregatedEvent>();

        fetchedBookings.forEach((booking) => {
          const eventId = booking.event.id;

          if (eventMap.has(eventId)) {
            const existing = eventMap.get(eventId)!;
            existing.totalSeats += booking.seats;
            existing.bookings.push(booking);
            // Keep the latest booking date
            if (
              new Date(booking.bookingDate) >
              new Date(existing.latestBookingDate)
            ) {
              existing.latestBookingDate = booking.bookingDate;
            }
          } else {
            eventMap.set(eventId, {
              eventId,
              event: booking.event,
              totalSeats: booking.seats,
              bookings: [booking],
              latestBookingDate: booking.bookingDate,
            });
          }
        });

        // Sort by latest booking date (most recent first)
        const aggregated = Array.from(eventMap.values()).sort(
          (a, b) =>
            new Date(b.latestBookingDate).getTime() -
            new Date(a.latestBookingDate).getTime()
        );

        setAggregatedEvents(aggregated);
      } catch (error) {
        toast.error("Failed to fetch bookings");
        console.error(error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  const formatEventDate = (dateString: string, timeString: string) => {
    try {
      const date = new Date(`${dateString}T${timeString}`);
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
      const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const month = date
        .toLocaleDateString("en-US", { month: "short" })
        .toUpperCase();
      const day = date.getDate();

      return {
        dayOfWeek,
        time,
        month,
        day,
        fullDate: date.toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      };
    } catch (error) {
      return {
        dayOfWeek: "Invalid",
        time: "Invalid",
        month: "ERR",
        day: 0,
        fullDate: "Invalid date",
      };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  // Update the handleCancelRegistration function
  const handleCancelRegistration = async (bookingId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to cancel registration");
        router.push("/auth/login");
        return;
      }

      const response = await axios.delete(
        `http://localhost:3001/bookings/me/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update both bookings and aggregated events state
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        setAggregatedEvents((prev) =>
          prev
            .map((aggregated) => ({
              ...aggregated,
              bookings: aggregated.bookings.filter((b) => b.id !== bookingId),
              totalSeats: aggregated.bookings.reduce(
                (sum, b) => (b.id !== bookingId ? sum + b.seats : sum),
                0
              ),
            }))
            .filter((aggregated) => aggregated.bookings.length > 0)
        );
        toast.success("Registration cancelled successfully!");
      }
    } catch (error) {
      console.error("Cancel registration failed:", error);
      toast.error("Failed to cancel registration");
    }
  };

  const handleBrowseEvents = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
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
          <div className="flex items-center space-x-4">
            <span
              className="text-sm text-gray-600 font-semibold"
              style={{ color: "#250a63" }}
            >
              Hello, {userName}
            </span>

            <button
              onClick={handleLogout}
              className="bg-[linear-gradient(to_right,#7B8BFF,#4157FE)] hover:bg-[linear-gradient(to_right,#6A7AFF,#3046ED)] transition duration-200 px-3 py-2 rounded-md text-sm font-medium flex items-center text-white"
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
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-[calc(100vh-200px)]">


        {/* Dashboard Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ color: "#250a63" }}
          >
            Dashboard
          </h1>
          <p
            className="text-gray-600 font-semibold"
            style={{ color: "#250a63" }}
          >
            Welcome back, {userName}! Here you can manage your event
            registrations.
          </p>
        </div>

        {/* My Registered Events */}
        <div className="mb-8">
          <h2
            className="text-xl font-semibold text-gray-900 mb-6"
            style={{ color: "#250a63" }}
          >
            My Registered Events
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
                style={{ color: "#250a63" }}
              ></div>
            </div>
          ) : aggregatedEvents.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-500 mb-4">
                You haven't registered for any events yet.
              </p>
              <button
                onClick={handleBrowseEvents}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {aggregatedEvents.map((aggregated) => {
                const eventInfo = formatEventDate(
                  aggregated.event.eventDate,
                  aggregated.event.eventTime
                );
                return (
                  <div
                    key={aggregated.eventId}
                    className="bg-white border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {/* Date Block */}
                        <div className="flex-shrink-0 text-center">
                          <div className="text-sm font-medium text-indigo-600 uppercase">
                            {eventInfo.month}
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {eventInfo.day}
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {aggregated.event.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {eventInfo.dayOfWeek}
                            </div>
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {eventInfo.time}
                            </div>
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              {aggregated.event.location}
                            </div>
                          </div>

                          {/* Booking Details */}
                          <div className="mt-3">
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {aggregated.totalSeats} seat
                              {aggregated.totalSeats !== 1 ? "s" : ""} booked
                            </div>
                            {aggregated.bookings.length > 1 && (
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                                {aggregated.bookings.length} booking
                                {aggregated.bookings.length !== 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Cancel Button */}
                      <button
                        onClick={() => handleCancelRegistration(aggregated.bookings[0].id)} // Use the first booking's ID
                        className="text-white px-4 py-2 rounded-md bg-[linear-gradient(to_right,#FF847B,#FE4141)] hover:bg-[linear-gradient(to_right,#FF847B,#FF847B)] transition duration-200 text-sm md:text-base"
                      >
                        Cancel registration
                      </button>
                    </div>

                    {/* Multiple Bookings Details */}
                    {aggregated.bookings.length > 1 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-2">
                          Booking History:
                        </p>
                        <div className="space-y-1">
                          {aggregated.bookings.map((booking) => (
                            <div
                              key={booking.id}
                              className="text-xs text-gray-500 flex justify-between"
                            >
                              <span>
                                {new Date(
                                  booking.bookingDate
                                ).toLocaleDateString()}{" "}
                                - {booking.seats} seat
                                {booking.seats !== 1 ? "s" : ""}
                              </span>
                              <span>#{booking.id}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Browse More Events Button */}
        {aggregatedEvents.length > 0 && (
          <div className="text-center">
            <button
              onClick={handleBrowseEvents}
              className="text-white px-4 py-2 rounded-md bg-[linear-gradient(to_right,#7B8BFF,#4157FE)] hover:bg-[linear-gradient(to_right,#6A7AFF,#3046ED)] transition duration-200 text-sm md:text-base"
            >
              Browse more events
            </button>
          </div>
        )}



      </main>

       {/* Toast Notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              background: "green",
              color: "white",
            },
          },
          error: {
            style: {
              background: "red",
              color: "white",
            },
          },
        }}
      />

      <Footer />
    </div>
  );
}
