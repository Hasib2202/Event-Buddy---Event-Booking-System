// app/event/[id]/page.tsx
"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import toast, { Toaster } from "react-hot-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  availableSeats: number;
  totalSeats: number;
  type: string;
  eventImage: string;
  // Keeping old fields for backward compatibility
  startTime?: string;
  endTime?: string;
  image?: string;
  tags?: string[];
}

interface BookingResponse {
  id: number;
  seats: number;
  bookingDate: string;
  user: any;
  event: Event;
}

export default function EventDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) {
          setError("Invalid event ID");
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await axios.get<Event>(
          `http://localhost:3001/events/${id}`
        );

        setEvent(response.data);
        setError(null);
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to fetch event details"
            : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  interface FormattedDate {
    weekday: string;
    month: string;
    day: number;
    time: string;
    fullDate: string;
  }

  const formatEventDate = (
    dateString: string,
    timeString?: string
  ): FormattedDate => {
    try {
      let dateToFormat: Date;

      if (timeString) {
        dateToFormat = new Date(`${dateString}T${timeString}`);
      } else {
        dateToFormat = new Date(dateString);
      }

      if (isNaN(dateToFormat.getTime())) {
        return {
          weekday: "N/A",
          month: "N/A",
          day: 0,
          time: "N/A",
          fullDate: "Date not available",
        };
      }

      return {
        weekday: dateToFormat.toLocaleDateString("en-US", { weekday: "long" }),
        month: dateToFormat
          .toLocaleDateString("en-US", { month: "short" })
          .toUpperCase(),
        day: dateToFormat.getDate(),
        time: dateToFormat.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        fullDate: dateToFormat.toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      };
    } catch (error) {
      return {
        weekday: "ERR",
        month: "ERR",
        day: 0,
        time: "ERR",
        fullDate: "Invalid date format",
      };
    }
  };

  const handleBackToEvents = () => {
    router.push("/");
  };

  const checkAuthentication = (): boolean => {
    try {
      const token = localStorage.getItem("token");
      return !!token;
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return false;
    }
  };

  const getAuthToken = (): string | null => {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  };

  const handleBooking = async () => {
    if (!event) return;

    try {
      setIsBooking(true);
      const token = getAuthToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post<BookingResponse>(
        "http://localhost:3001/bookings",
        {
          eventId: parseInt(id as string),
          seats: selectedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update event's available seats locally
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              availableSeats: prev.availableSeats - selectedSeats,
            }
          : null
      );

      toast.success("Booking successful! Redirecting to bookings...");

      // Get user role from token and redirect accordingly
      let role = "user"; // Default role
      
      if (token) {
        try {
          // Simple JWT parsing (payload is the second part)
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.role) {
            role = payload.role;
          }
        } catch (err) {
          console.error("Error parsing token:", err);
        }
      }

      setTimeout(() => {
        router.push(role === "admin" ? "/dashboard/admin" : "/dashboard/user");
      }, 3000);
    } catch (err) {
      console.error("Booking error:", err);

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          toast.error("Session expired. Please login again.");
          router.push(`/auth/login?redirect=/event/${id}`);
          return;
        }

        const errorMessage =
          err.response?.data?.message || "Failed to create booking";
        toast.error(`Booking failed: ${errorMessage}`);
      } else {
        toast.error("An unexpected error occurred while booking");
      }
    } finally {
      setIsBooking(false);
    }
  };

  const onBookNow = () => {
    if (!event) return;

    if (selectedSeats > event.availableSeats) {
      alert(`Only ${event.availableSeats} seats available!`);
      return;
    }

    // Check if user is authenticated
    if (!checkAuthentication()) {
      // Redirect to login with return URL
      router.push(
        `/auth/login?redirect=/event/${id}&message=Please login to book this event`
      );
      return;
    }

    // User is authenticated, proceed to booking
    handleBooking();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-red-600 mb-4">
            {error || "Failed to load event."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Success message overlay
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              You have successfully booked {selectedSeats} seat
              {selectedSeats > 1 ? "s" : ""} for {event.title}.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your bookings in 3 seconds...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Use eventDate/eventTime if available, fallback to startTime/endTime
  const eventDateTime =
    event.eventDate && event.eventTime
      ? formatEventDate(event.eventDate, event.eventTime)
      : formatEventDate(event.startTime || "");

  const endDateTime = event.endTime ? formatEventDate(event.endTime) : null;

  const registeredCount = event.totalSeats - event.availableSeats;
  const maxSelectableSeats = Math.min(4, event.availableSeats);

  const isDateValid = (date: FormattedDate) =>
    date.time !== "N/A" &&
    date.time !== "ERR" &&
    date.fullDate !== "Date not available";

  const timeDisplay = isDateValid(eventDateTime)
    ? endDateTime && isDateValid(endDateTime)
      ? `${eventDateTime.time} - ${endDateTime.time}`
      : eventDateTime.time
    : "Time not available";

  const dateDisplay = isDateValid(eventDateTime)
    ? eventDateTime.fullDate
    : "Date not available";

  const eventImageSrc = event.eventImage || event.image || "/images/4.jpg";
  const eventTags = event.tags || (event.type ? [event.type] : []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Toaster position="top-center" reverseOrder={false} />
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={handleBackToEvents}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Events
        </button>

        <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg mb-8">
          <Image
            src={eventImageSrc}
            alt={`Cover image for ${event.title}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {eventTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {eventTags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-900 mb-8">{event.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
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
              <span className="text-sm font-medium text-gray-500">Date</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{dateDisplay}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
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
              <span className="text-sm font-medium text-gray-500">Time</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{timeDisplay}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
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
              <span className="text-sm font-medium text-gray-500">
                Location
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {event.location}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Number of Seats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                disabled={num > maxSelectableSeats || isBooking}
                onClick={() => setSelectedSeats(num)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedSeats === num
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  num > maxSelectableSeats || isBooking
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <div className="flex flex-col items-center">
                  <svg
                    className="w-6 h-6 mb-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-xl font-bold text-gray-900">{num}</span>
                  <span className="text-xs text-gray-500">
                    Seat{num > 1 ? "s" : ""}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={onBookNow}
            disabled={event.availableSeats === 0 || isBooking}
            className={`w-full mt-6 text-white py-3 px-6 rounded-lg transition-colors font-semibold flex items-center justify-center ${
              event.availableSeats === 0
                ? "bg-gray-400 cursor-not-allowed"
                : isBooking
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isBooking ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Booking...
              </>
            ) : event.availableSeats === 0 ? (
              "Sold Out"
            ) : (
              `Book ${selectedSeats} Seat${selectedSeats > 1 ? "s" : ""}`
            )}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            About this event
          </h3>
          <div className="prose text-gray-700">
            {event.description.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-orange-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="text-lg font-semibold text-gray-900">
                {event.availableSeats} Spots Left
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({registeredCount.toLocaleString()} registered)
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
