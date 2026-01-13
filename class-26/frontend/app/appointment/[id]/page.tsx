// app/appointment/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserMd,
  FaArrowLeft,
  FaStethoscope,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaNotesMedical,
} from "react-icons/fa";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, addDays, isSameDay, isBefore, startOfDay } from "date-fns";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  available: string;
  time: string;
  services?: string[];
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function AppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
  });
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Generate time slots
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const times = [
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
      "4:30 PM",
    ];

    times.forEach((time) => {
      slots.push({
        time,
        available: true,
      });
    });

    return slots;
  };

  useEffect(() => {
    fetchDoctor();
    // setTimeSlots(generateTimeSlots());
  }, [doctorId]);

  const fetchDoctor = async (date: string | null = null) => {
    try {
      let url;
      if (date) {
        url = `http://localhost:5001/api/doctors/${doctorId}/${date}`;
      } else {
        url = `http://localhost:5001/api/doctors/${doctorId}`;
      }
      console.log("url", url);
      const response = await fetch(url);
      const data = await response.json();
      console.log("doctor data", data);
      if (data.data) {
        setDoctor(data.data);
        const timeSlotAppointments = data.appointment.map(
          (appointment: any) => appointment.time
        );
        const generaedTimeSlots = generateTimeSlots();
        for (let i = 0; i < generaedTimeSlots.length; i++) {
          if (timeSlotAppointments.includes(generaedTimeSlots[i].time)) {
            generaedTimeSlots[i].available = false;
          }
        }
        console.log("generaedTimeSlots", generaedTimeSlots);
        setTimeSlots(generaedTimeSlots);
      }
    } catch (error) {
      console.error("Error fetching doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !selectedService) {
      alert("Please select date, time, and service");
      return;
    }

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5001/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          doctorId: doctorId,
          doctorName: doctor?.name,
          date: formattedDate,
          time: selectedTime,
          service: selectedService,
        }),
      });
      const data = await response.json();

      if (data.data) {
        alert("Appointment booked successfully!");
        router.push("/");
      } else {
        alert("Failed to book appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = async (date: Date) => {
    console.log("selected date", date);
    const today = startOfDay(new Date());
    const selectedDay = startOfDay(date);

    if (!isBefore(selectedDay, today)) {
      console.log("set date", date);
      setSelectedDate(date);
      await fetchDoctor(format(date, "yyyy-MM-dd"));
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return isBefore(startOfDay(date), today);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Doctor Not Found
          </h2>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Doctors
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Book Appointment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserMd className="text-blue-600 text-3xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {doctor.name}
                </h2>
                <p className="text-blue-600">{doctor.specialty}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaUserMd className="mr-3 text-blue-500" />
                  <span>{doctor.experience} experience</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-3 text-blue-500" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-3 text-blue-500" />
                  <span>{doctor.available}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-3 text-blue-500" />
                  <span>{doctor.time}</span>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <FaStethoscope className="mr-2 text-blue-500" />
                  Services
                </h3>
                <div className="space-y-2">
                  {doctor.services?.map((service, index) => (
                    <label
                      key={index}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service}
                        checked={selectedService === service}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      <span className="text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots and Patient Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Date Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                Select Date
              </h3>
              <div className="flex justify-center">
                <Calendar
                  onChange={(value) => {
                    if (value instanceof Date) {
                      handleDateSelect(value);
                    }
                  }}
                  value={selectedDate}
                  tileDisabled={({ date }) => isDateDisabled(date)}
                  minDate={new Date()}
                  className="react-calendar"
                />
              </div>
              {selectedDate && (
                <p className="mt-4 text-sm text-blue-600 text-center">
                  Selected: {format(selectedDate, "MMMM dd, yyyy")}
                </p>
              )}
            </div>
            {/* Time Slots */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaClock className="mr-2 text-blue-500" />
                Select Time
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                      !slot.available
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : selectedTime === slot.time
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
              {selectedTime && (
                <p className="mt-4 text-sm text-blue-600">
                  Selected: {selectedTime}
                </p>
              )}
            </div>

            {/* Patient Information */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Visit *
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please describe the reason for your appointment..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !selectedDate ||
                    !selectedTime ||
                    !selectedService
                  }
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
