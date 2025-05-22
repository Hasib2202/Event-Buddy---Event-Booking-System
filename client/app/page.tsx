// pages/index.js or components/LandingPage.js
import Footer from "@/components/Footer";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const eventData = [
    {
      date: { month: "APR", day: "14" },
      title: "Tech Conference 2025",
      description:
        "We'll get you directly seated and inside for you to enjoy the conference.",
      timeLocation: "Sunday . 3-5 PM . San Francisco, CA",
      tags: ["Tech", "Conference", "AI"],
      seatsLeft: 20,
      totalSeats: 100,
      image: "/images/event-placeholder.jpg", // REPLACE with your actual image path
    },
    // Duplicate this object 5 more times for 6 cards, changing image paths if needed
    {
      date: { month: "APR", day: "14" },
      title: "Tech Conference 2025",
      description:
        "We'll get you directly seated and inside for you to enjoy the conference.",
      timeLocation: "Sunday . 3-5 PM . San Francisco, CA",
      tags: ["Tech", "Conference", "AI"],
      seatsLeft: 20,
      totalSeats: 100,
      image: "/images/event-placeholder.jpg", // REPLACE with your actual image path
    },
    {
      date: { month: "APR", day: "14" },
      title: "Tech Conference 2025",
      description:
        "We'll get you directly seated and inside for you to enjoy the conference.",
      timeLocation: "Sunday . 3-5 PM . San Francisco, CA",
      tags: ["Tech", "Conference", "AI"],
      seatsLeft: 20,
      totalSeats: 100,
      image: "/images/event-placeholder.jpg", // REPLACE with your actual image path
    },
    {
      date: { month: "APR", day: "14" },
      title: "Tech Conference 2025",
      description:
        "We'll get you directly seated and inside for you to enjoy the conference.",
      timeLocation: "Sunday . 3-5 PM . San Francisco, CA",
      tags: ["Tech", "Conference", "AI"],
      seatsLeft: 20,
      totalSeats: 100,
      image: "/images/event-placeholder.jpg", // REPLACE with your actual image path
    },
    {
      date: { month: "APR", day: "14" },
      title: "Tech Conference 2025",
      description:
        "We'll get you directly seated and inside for you to enjoy the conference.",
      timeLocation: "Sunday . 3-5 PM . San Francisco, CA",
      tags: ["Tech", "Conference", "AI"],
      seatsLeft: 20,
      totalSeats: 100,
      image: "/images/event-placeholder.jpg", // REPLACE with your actual image path
    },
    {
      date: { month: "APR", day: "14" },
      title: "Tech Conference 2025",
      description:
        "We'll get you directly seated and inside for you to enjoy the conference.",
      timeLocation: "Sunday . 3-5 PM . San Francisco, CA",
      tags: ["Tech", "Conference", "AI"],
      seatsLeft: 20,
      totalSeats: 100,
      image: "/images/event-placeholder.jpg", // REPLACE with your actual image path
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-900">
      <Head>
        <title>Event Buddy - Discover Amazing Events</title>
        <link rel="icon" href="/favicon.ico" />
        {/* If using a specific font, import it here, e.g., from Google Fonts */}
        {/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" /> */}
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center z-20 relative">
        <div className="flex items-center">
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
        </div>
        <div className="flex space-x-4">
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm md:text-base"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm md:text-base"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 lg:py-40 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-[400px]">
        {/* Background elements (tickets and subtle sparkles) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          {/* Left Ticket */}
          <div className="absolute top-8 md:top-16 left-4 md:left-16 w-36 md:w-48 transform -rotate-12 opacity-90">
            <Image
              src="/images/ticket-left.png"
              alt="One Way Ticket"
              width={200}
              height={100}
              objectFit="contain"
            />{" "}
            {/* REPLACE with your actual image */}
          </div>
          {/* Right Ticket */}
          <div className="absolute top-16 md:top-24 right-4 md:right-16 w-36 md:w-48 transform rotate-6 opacity-90">
            <Image
              src="/images/ticket-right.png"
              alt="One Way Ticket"
              width={200}
              height={100}
              objectFit="contain"
            />{" "}
            {/* REPLACE with your actual image */}
          </div>
          {/* Subtle background graphics - for exact replication, these should be a single background image or SVG */}
          {/* Example: A div with a background image */}
          <div
            className="absolute inset-0 bg-no-repeat bg-center opacity-30"
            style={{
              backgroundImage: "url(/images/hero-bg-sparkles.svg)",
              backgroundSize: "cover",
            }}
          >
            {/* You'll need to create a hero-bg-sparkles.svg or similar */}
          </div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-800 leading-tight mb-4">
            Discover
            <br />
            <span className="text-blue-600">Amazing </span>
            Events
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Find and book events that match your interests. From tech
            conferences to music festivals, we've got you covered.
          </p>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 px-4">
            <div className="relative w-full max-w-lg md:max-w-md">
              <input
                type="text"
                placeholder="Search events"
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
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300 shadow-md text-base font-semibold">
              Search Events
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">Find Your Next Event</p>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 md:py-20 px-4 md:px-8 lg:px-16 bg-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 ml-4">
          Upcoming Events
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {eventData.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="relative w-full h-48 sm:h-56 lg:h-48 xl:h-56">
                <Image
                  src={event.image}
                  alt={event.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                />
              </div>
              <div className="p-5 flex-grow">
                <div className="text-xs font-semibold text-blue-600 mb-2 flex items-baseline">
                  <span className="text-gray-500 mr-1">{event.date.month}</span>
                  <span className="text-2xl font-extrabold text-gray-800">
                    {event.date.day}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {event.description}
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  {/* Calendar Icon */}
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
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{event.timeLocation}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        tag === "Tech"
                          ? "bg-blue-100 text-blue-600"
                          : tag === "Conference"
                          ? "bg-purple-100 text-purple-600"
                          : tag === "AI"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4 mt-auto">
                  <span>{event.seatsLeft} Seats Left</span>
                  <span>Total {event.totalSeats} Seats</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* (Optional) Footer - not in original image */}
      <Footer />
    </div>
  );
}
