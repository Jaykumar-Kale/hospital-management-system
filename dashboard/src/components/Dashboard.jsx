import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  // ...existing code...
  // compute quick stats for MindFit Counselling
  const totalAppointments = appointments.length;
  const uniqueDoctorsCount = new Set(
    appointments.map((a) => (a.doctor ? a.doctor._id : null)).filter(Boolean)
  ).size;

  const upcomingAppointment = appointments
    .filter((a) => {
      const d = new Date(a.appointment_date);
      return !isNaN(d) && d > new Date();
    })
    .sort(
      (a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
    )[0];

  const formatDate = (dt) => {
    if (!dt) return "N/A";
    const d = new Date(dt);
    if (isNaN(d)) return dt.toString().substring(0, 16);
    return d.toLocaleString();
  };

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="Dr Mansi Karanjkar" />
            <div className="content">
              <div>
                <p>Welcome to</p>
                <h5>MindFit Counselling — Dr. Mansi Karanjkar</h5>
              </div>
              <p>
                Specialized mental health and counselling services focusing on
                anxiety, stress management, relationship counselling and
                personal growth. Appointments are tailored to create a safe,
                confidential space for healing and progress.
              </p>
              <p style={{ marginTop: 8, fontSize: 13 }}>
                Clinic contact: +91 98765 43210 • mindfit@clinic.example
              </p>
              <p style={{ marginTop: 4, fontSize: 13 }}>
                Working hours: Mon–Sat, 9:00 AM – 6:00 PM
              </p>
            </div>
          </div>

          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{totalAppointments}</h3>
            <p style={{ fontSize: 13, marginTop: 6 }}>
              Upcoming: {upcomingAppointment ? formatDate(upcomingAppointment.appointment_date) : "No upcoming appointments"}
            </p>
          </div>

          <div className="thirdBox">
            <p>Registered Therapists</p>
            <h3>{uniqueDoctorsCount}</h3>
            <p style={{ fontSize: 13, marginTop: 6 }}>
              Active cases and follow-ups are handled with confidentiality.
            </p>
          </div>
        </div>

        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                {/* <th>Department</th> */}
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0
                ? appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{formatDate(appointment.appointment_date)}</td>
                      <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                      <td>{appointment.department}</td>
                      <td>
                        <select
                          className={
                            appointment.status === "Pending"
                              ? "value-pending"
                              : appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={appointment.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Pending" className="value-pending">
                            Pending
                          </option>
                          <option value="Accepted" className="value-accepted">
                            Accepted
                          </option>
                          <option value="Rejected" className="value-rejected">
                            Rejected
                          </option>
                        </select>
                      </td>
                      <td>
                        {appointment.hasVisited === true ? (
                          <GoCheckCircleFill className="green" />
                        ) : (
                          <AiFillCloseCircle className="red" />
                        )}
                      </td>
                    </tr>
                  ))
                : "No Appointments Found!"}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;