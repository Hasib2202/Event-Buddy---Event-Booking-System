import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { Eye, Pencil, Trash2, X, Calendar, Clock, Upload } from "lucide-react";
// Add this import at the top of your file
import { Toaster } from "react-hot-toast";

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
  type: string;
  eventImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateEventDto {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  totalSeats: number;
  type: string;
  eventImage?: string;
}

interface UpdateEventDto {
  title?: string;
  description?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  totalSeats?: number;
  type?: string;
  eventImage?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Admin");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewedEvent, setViewedEvent] = useState<Event | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreateEventDto>({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "",
    location: "",
    totalSeats: 0,
    type: "",
    eventImage: "",
  });

  const [editForm, setEditForm] = useState<UpdateEventDto>({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (user.role !== "admin") {
          toast.error("Access denied: Admins only");
          router.push("/unauthorized");
          return;
        }

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

  const createEvent = async (eventData: CreateEventDto) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      // Format the date and time
      const formattedData = {
        ...eventData,
        eventTime: formatTimeForAPI(eventData.eventTime),
      };

      const response = await axios.post(
        "http://localhost:3001/events",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents([...events, response.data as Event]);
      toast.success("Event created successfully!");
      setIsCreateModalOpen(false);
      resetCreateForm();
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to create event");
      } else {
        toast.error("Failed to create event");
      }
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Update your updateEvent function
  const updateEvent = async (id: number, eventData: UpdateEventDto) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      // Format the date and time
      const formattedData = {
        ...eventData,
        eventTime: eventData.eventTime
          ? formatTimeForAPI(eventData.eventTime)
          : undefined,
      };

      const response = await axios.patch(
        `http://localhost:3001/events/${id}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedEvents = events.map((event) => {
        if (event.id === id) {
          return response.data as Event;
        }
        return event;
      });

      setEvents(updatedEvents);
      toast.success("Event updated successfully!");
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      setEditForm({});
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to update event");
      } else {
        toast.error("Failed to update event");
      }
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to format time as HH:MM
  const formatTimeForAPI = (timeString: string) => {
    if (!timeString) return timeString;

    // If time includes seconds (HH:MM:SS), remove them
    if (timeString.includes(":") && timeString.split(":").length > 2) {
      return timeString.split(":").slice(0, 2).join(":");
    }

    return timeString;
  };

  const deleteEvent = async (id: number) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3001/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents(events.filter((event) => event.id !== id));
      toast.success("Event deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      toast.error("Failed to delete event");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      title: "",
      description: "",
      eventDate: "",
      eventTime: "",
      location: "",
      totalSeats: 0,
      type: "",
      eventImage: "",
    });
  };

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setEditForm({
      title: event.title,
      description: event.description,
      eventDate: event.eventDate,
      eventTime: formatTimeForDisplay(event.eventTime), // Format for display
      location: event.location,
      totalSeats: event.totalSeats,
      type: event.type,
      eventImage: event.eventImage,
    });
    setIsEditModalOpen(true);
  };

  // Helper function to format time for display in the input field
  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return "";

    // If time is in HH:MM format, ensure it works with time input
    if (timeString.match(/^\d{2}:\d{2}$/)) {
      return timeString + ":00"; // Some browsers need seconds
    }

    return timeString;
  };
  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const handleViewClick = (event: Event) => {
    setViewedEvent(event);
    setIsViewModalOpen(true);
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
  
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    
    // If time is in HH:MM format, convert to 12-hour format
    if (timeString.match(/^\d{2}:\d{2}$/)) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    
    return timeString;
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
              className="bg-[linear-gradient(to_right,#7B8BFF,#4157FE)] hover:bg-[linear-gradient(to_right,#6A7AFF,#3046ED)] transition duration-200 px-4 py-2 rounded-md text-sm font-medium flex items-center text-white"
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
          <div className="px-6 py-5 border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-[36px] font-semibold text-[#250a63]">
                  Admin Dashboard
                </h2>
                <p className="text-[20.26px] text-[#8570AD] mt-2">
                  Manage events, view registrations, and monitor your platform.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-[24px] font-semibold text-[#250a63]">
                  Events Management
                </h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[linear-gradient(to_right,#7B8BFF,#4157FE)] hover:bg-[linear-gradient(to_right,#6A7AFF,#3046ED)] transition duration-200 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create Event
              </button>
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
                      className="px-6 py-4 text-left text-xs font-medium text-[#250a63] uppercase tracking-wider border-b border-gray-200"
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
                            onClick={() => handleViewClick(event)}
                            className="hover:text-[#4157FE] transition-colors"
                            title="View"
                          >
                            <Eye className="w-5 h-5 text-[#250a63]" />
                          </button>
                          <button
                            onClick={() => handleEditClick(event)}
                            className="hover:text-[#4157FE] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5 text-[#250a63]" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(event)}
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

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[#250a63]">
                  Create New Event
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createEvent(createForm);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.title}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          value={createForm.eventDate}
                          onChange={(e) =>
                            setCreateForm({
                              ...createForm,
                              eventDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          step="3600" // Show only hours (no minutes)
                          required
                          value={createForm.eventTime}
                          onChange={(e) => {
                            const timeValue = e.target.value;
                            // Format the time before storing in state
                            setCreateForm({
                              ...createForm,
                              eventTime: formatTimeForAPI(timeValue),
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                        />
                        <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={createForm.description}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Location
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.location}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={createForm.totalSeats}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            totalSeats: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <input
                        type="text"
                        required
                        value={createForm.type}
                        onChange={(e) =>
                          setCreateForm({ ...createForm, type: e.target.value })
                        }
                        placeholder="e.g., conference, gala, festival"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          Drag or{" "}
                          <span className="text-[#4157FE] font-medium cursor-pointer">
                            upload
                          </span>{" "}
                          the picture here
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Max 5MB | JPG, PNG
                        </p>
                      </div>
                      <input
                        type="url"
                        value={createForm.eventImage}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            eventImage: e.target.value,
                          })
                        }
                        placeholder="Or paste image URL here"
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[linear-gradient(to_right,#7B8BFF,#4157FE)] hover:bg-[linear-gradient(to_right,#6A7AFF,#3046ED)] text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Creating..." : "Create Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[#250a63]">
                  Edit Event
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateEvent(selectedEvent.id, editForm);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={editForm.eventDate || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              eventDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          step="3600" // Show only hours (no minutes)
                          value={editForm.eventTime || ""}
                          onChange={(e) => {
                            const timeValue = e.target.value;
                            // Format the time before storing in state
                            setEditForm({
                              ...editForm,
                              eventTime: formatTimeForAPI(timeValue),
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                        />
                        <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={editForm.description || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editForm.totalSeats || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            totalSeats: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <input
                        type="text"
                        value={editForm.type || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, type: e.target.value })
                        }
                        placeholder="e.g., conference, gala, festival"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          Drag or{" "}
                          <span className="text-[#4157FE] font-medium cursor-pointer">
                            upload
                          </span>{" "}
                          the picture here
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Max 5MB | JPG, PNG
                        </p>
                      </div>
                      <input
                        type="url"
                        value={editForm.eventImage || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            eventImage: e.target.value,
                          })
                        }
                        placeholder="Or paste image URL here"
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4157FE] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[linear-gradient(to_right,#7B8BFF,#4157FE)] hover:bg-[linear-gradient(to_right,#6A7AFF,#3046ED)] text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#250a63]">
                  Delete Event
                </h3>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600">
                  Are you sure you want to delete the event "
                  {selectedEvent.title}"? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteEvent(selectedEvent.id)}
                  disabled={submitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                >
                  {submitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Event Modal */}
      {isViewModalOpen && viewedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[#250a63]">
                  Event Details
                </h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Event Image */}
                {viewedEvent.eventImage && (
                  <div className="relative w-full h-64">
                    <Image
                      src={viewedEvent.eventImage}
                      alt={viewedEvent.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Title
                  </label>
                  <p className="text-lg font-semibold text-[#250a63]">
                    {viewedEvent.title}
                  </p>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Date
                    </label>
                    <p className="text-[#250a63]">
                      {new Date(viewedEvent.eventDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Time
                    </label>
                    <p className="text-[#250a63]">
                      {formatTime(viewedEvent.eventTime)}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Description
                  </label>
                  <p className="text-[#250a63] whitespace-pre-line">
                    {viewedEvent.description}
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Location
                  </label>
                  <p className="text-[#250a63]">{viewedEvent.location}</p>
                </div>

                {/* Seats and Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Available Seats
                    </label>
                    <p className="text-[#250a63]">
                      {viewedEvent.availableSeats} / {viewedEvent.totalSeats}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Type
                    </label>
                    <p className="text-[#250a63]">{viewedEvent.type}</p>
                  </div>
                </div>

                {/* Created At */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Created At
                  </label>
                  <p className="text-[#250a63]">
                    {new Date(viewedEvent.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-full bg-[#4157FE] text-white px-4 py-2 rounded-md hover:bg-[#3046ED] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Footer */}
      <Footer />
    </div>
  );
}
