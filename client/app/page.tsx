// pages/index.tsx
"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Updated Event interface
interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string; // Changed from 'date'
  eventTime: string; // Added
  location: string;
  availableSeats: number;
  totalSeats: number;
  type: string;
  eventImage: string; // Added
}

// Updated EventCardProps interface
interface EventCardProps {
  event: Event;
  isPast?: boolean;
}

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
            ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : page === "..."
                ? "text-gray-400 cursor-default"
                : "text-gray-600 hover:bg-gray-100"
            }
          `}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

const EventCard: React.FC<EventCardProps> = ({ event, isPast = false }) => {
  const router = useRouter();

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      day: date.getDate(),
      weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const twelveHour = hour % 12 || 12;
    return `${twelveHour}:${minutes} ${suffix}`;
  };

  const handleCardClick = () => {
    router.push(`/event/${event.id}`);
  };

  return (
    <div
      className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:scale-105 relative"
      onClick={handleCardClick}
      style={{
        clipPath:
          "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
      }}
    >
      <div className="relative w-full h-48 sm:h-56 lg:h-48 xl:h-56">
        <Image
          src={event.eventImage || "/images/3.jpg"}
          alt={event.title}
          layout="fill"
          objectFit="cover"
        />
        {isPast && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Past Event
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-grow">
        <div className="text-xs font-semibold text-blue-600 mb-2 flex items-baseline">
          <span className="text-gray-500 mr-1">
            {formatEventDate(event.eventDate).month}
          </span>
          <span className="text-2xl font-extrabold text-gray-800">
            {formatEventDate(event.eventDate).day}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
          {event.description
            .split("\n")
            .find((line) => line.trim().length > 0) ||
            "No description available"}
        </p>

        {/* Date/Time/Location Section */}
        <div className="flex items-center text-gray-500 text-sm mb-4 gap-4 flex-wrap">
          {/* Date */}
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="text-xs">
              {formatEventDate(event.eventDate).weekday}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-xs">{formatTime(event.eventTime)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="text-xs">{event.location}</span>
          </div>
        </div>

        {/* Event Type */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              isPast ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-600"
            }`}
          >
            {event.type}
          </span>
        </div>

        {/* Seats Info */}
        <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4 mt-auto">
          <div className="flex items-center">
            <svg
              className="mr-2 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isPast ? (
                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z M12 14C8.68629 14 6 16.6863 6 20H18C18 16.6863 15.3137 14 12 14Z" />
              ) : (
                <path d="M6 10 H18 V14 H6 Z M6 14 L6 18 M18 14 L18 18" />
              )}
            </svg>
            <span className="text-xs">
              {isPast
                ? `${event.totalSeats - event.availableSeats} Attended`
                : `${event.availableSeats} Seats Left`}
            </span>
          </div>
          <div className="flex items-center">
            <svg
              className="mr-2 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 10 H18 V14 H6 Z M6 14 L6 18 M18 14 L18 18" />
            </svg>
            <span className="text-xs">Total {event.totalSeats} Seats</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Event[]>([]);

  // Pagination states
  const [upcomingCurrentPage, setUpcomingCurrentPage] = useState(1);
  const [pastCurrentPage, setPastCurrentPage] = useState(1);
  const UPCOMING_EVENTS_PER_PAGE = 6;
  const PAST_EVENTS_PER_PAGE = 3;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Updated filtering logic with date/time combination
  const upcomingEvents = events.filter((event) => {
    const eventDateTime = new Date(`${event.eventDate}T${event.eventTime}`);
    return eventDateTime >= new Date();
  });

  const pastEvents = events.filter((event) => {
    const eventDateTime = new Date(`${event.eventDate}T${event.eventTime}`);
    return eventDateTime < new Date();
  });

  // Pagination calculations
  const upcomingTotalPages = Math.ceil(
    upcomingEvents.length / UPCOMING_EVENTS_PER_PAGE
  );
  const pastTotalPages = Math.ceil(pastEvents.length / PAST_EVENTS_PER_PAGE);

  const paginatedUpcomingEvents = upcomingEvents.slice(
    (upcomingCurrentPage - 1) * UPCOMING_EVENTS_PER_PAGE,
    upcomingCurrentPage * UPCOMING_EVENTS_PER_PAGE
  );

  const paginatedPastEvents = pastEvents.slice(
    (pastCurrentPage - 1) * PAST_EVENTS_PER_PAGE,
    pastCurrentPage * PAST_EVENTS_PER_PAGE
  );

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        new Date(event.eventDate)
          .toLocaleDateString("en-US", { month: "short" })
          .toLowerCase()
          .includes(query) ||
        event.location.toLowerCase().includes(query)
    );
    setSearchResults(filtered);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans antialiased text-gray-900">
        <Header />

        <Head>
          <title>Event Buddy - Discover Amazing Events</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 lg:py-40 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-[400px]">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-8 md:top-16 left-4 md:left-16 w-36 md:w-48 transform -rotate-12 opacity-90">
              <Image
                src="/images/1.png"
                alt="One Way Ticket"
                width={200}
                height={100}
                objectFit="contain"
              />
            </div>
            <div className="absolute top-16 md:top-24 right-4 md:right-16 w-36 md:w-48 transform rotate-6 opacity-90">
              <Image
                src="/images/2.png"
                alt="One Way Ticket"
                width={200}
                height={100}
                objectFit="contain"
              />
            </div>
            <div className="absolute inset-0 bg-no-repeat bg-center opacity-30"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-800 leading-tight mb-4">
              Discover
              <br />
              <span className="text-blue-600">Amazing </span>
              Events
            </h1>
            <p
              className="mt-4 text-lg md:text-xl max-w-2xl mx-auto"
              style={{ color: "#250a63" }}
            >
              Find and book events that match your interests. From tech
              conferences to music festivals, we've got you covered.
            </p>

            <p className="mt-4 text-lg font-bold" style={{ color: "#250a63" }}>
              Find Your Next Event
            </p>

            {/* Search Input and Button */}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 px-4">
              <div className="relative w-full max-w-lg md:max-w-md">
                <input
                  type="text"
                  placeholder="Search events"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-base shadow-sm"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <button
                onClick={handleSearch}
                className="bg-[linear-gradient(to_right,#7B8BFF,#4157FE)] hover:bg-[linear-gradient(to_right,#6A7AFF,#3046ED)] transition duration-200 text-sm md:text-base text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300 shadow-md text-base font-semibold"
              >
                Search Events
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-16 md:py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 ml-4">
            Upcoming Events
          </h2>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading events: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && upcomingEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No upcoming events found.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {paginatedUpcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Upcoming Events Pagination */}
          {upcomingTotalPages > 1 && (
            <Pagination
              currentPage={upcomingCurrentPage}
              totalPages={upcomingTotalPages}
              onPageChange={setUpcomingCurrentPage}
            />
          )}
        </section>

        {/* Past Events Section */}
        <section className="py-16 md:py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 ml-4">
            Previous Events
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {paginatedPastEvents.map((event) => (
              <EventCard key={event.id} event={event} isPast={true} />
            ))}
          </div>

          {/* Past Events Pagination */}
          {pastTotalPages > 1 && (
            <Pagination
              currentPage={pastCurrentPage}
              totalPages={pastTotalPages}
              onPageChange={setPastCurrentPage}
            />
          )}
        </section>

        <Footer />
      </div>
    </>
  );
}
