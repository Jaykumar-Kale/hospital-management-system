
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DEFAULT_DOCTOR_KEY = "default-mansi";
const DEFAULT_DOCTOR = {
  firstName: "Mansi",
  lastName: "Karanjkar",
  display: "Dr. Mansi Karanjkar (Counselling)",
  department: "Counselling",
};

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(DEFAULT_DOCTOR_KEY);
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
    "Counselling",
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/user/doctors",
          { withCredentials: true }
        );
        const docs = Array.isArray(data.doctors) ? data.doctors : [];
        setDoctors(docs);

        const foundMansi = docs.find(
          (d) =>
            `${(d.firstName || "").trim()} ${(d.lastName || "").trim()}`.toLowerCase() ===
            "mansi karanjkar"
        );

        if (foundMansi) setSelectedDoctorId(foundMansi._id);
        else setSelectedDoctorId(DEFAULT_DOCTOR_KEY);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        toast.error("Failed to load doctors");
        setDoctors([]);
        setSelectedDoctorId(DEFAULT_DOCTOR_KEY);
      }
    };
    fetchDoctors();
  }, []);

  const doctorsForDept = doctors.filter((d) => d.doctorDepartment === department);

  const validateFields = () => {
    const missing = [];
    if (!firstName.trim()) missing.push("First name");
    if (!lastName.trim()) missing.push("Last name");
    if (!email.trim()) missing.push("Email");
    if (!phone.trim()) missing.push("Phone");
    if (!nic.trim()) missing.push("NIC");
    if (!dob) missing.push("Date of birth");
    if (!gender) missing.push("Gender");
    if (!appointmentDate) missing.push("Appointment date/time");
    if (!department) missing.push("Department");

    if (phone && !/^\d{11}$/.test(phone)) missing.push("Phone (must be 11 digits)");
    if (nic && !/^\d{13}$/.test(nic)) missing.push("NIC (must be 13 digits)");
    if (gender && !["Male", "Female"].includes(gender)) missing.push("Gender (Male/Female)");
    return missing;
  };

  const handleAppointment = async (e) => {
    e.preventDefault();

    const missing = validateFields();
    if (missing.length > 0) {
      toast.error("Missing / invalid: " + missing.join(", "));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        nic: nic.trim(),
        dob,
        gender,
        appointment_date: appointmentDate,
        department,
        doctor: selectedDoctorId && selectedDoctorId !== DEFAULT_DOCTOR_KEY ? selectedDoctorId : null,
        hasVisited: Boolean(hasVisited),
        address: address.trim(),
      };

      if (selectedDoctorId === DEFAULT_DOCTOR_KEY) {
        payload.doctor_firstName = DEFAULT_DOCTOR.firstName;
        payload.doctor_lastName = DEFAULT_DOCTOR.lastName;
        payload.department = DEFAULT_DOCTOR.department; // force counselling for default
      } else {
        const doc = doctors.find((d) => d._id === selectedDoctorId);
        if (doc) {
          payload.doctor_firstName = doc.firstName;
          payload.doctor_lastName = doc.lastName;
        }
      }

      const { data } = await axios.post(
        "http://localhost:5000/api/v1/appointment/post",
        payload,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message || "Appointment created successfully");

      // reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setAppointmentDate("");
      setDepartment("Pediatrics");
      setSelectedDoctorId(DEFAULT_DOCTOR_KEY);
      setAddress("");
      setHasVisited(false);
    } catch (error) {
      console.error("Appointment error:", error?.response || error);
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to create appointment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container form-component appointment-form">
      <h2>Appointment</h2>
      <form onSubmit={handleAppointment}>
        <div>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Mobile Number (11 digits)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="NIC (13 digits)"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
          />
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="Date of Birth"
          />
        </div>

        <div>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="datetime-local"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            placeholder="Appointment Date & Time"
          />
        </div>

        <div>
          <select
            value={department}
            onChange={(e) => {
              const dept = e.target.value;
              setDepartment(dept);
              const foundMansiInDept = doctors.find(
                (d) =>
                  `${(d.firstName || "").trim()} ${(d.lastName || "").trim()}`.toLowerCase() ===
                    "mansi karanjkar" && d.doctorDepartment === dept
              );
              if (foundMansiInDept) setSelectedDoctorId(foundMansiInDept._id);
              else setSelectedDoctorId(DEFAULT_DOCTOR_KEY);
            }}
          >
            {departmentsArray.map((depart, index) => (
              <option value={depart} key={index}>
                {depart}
              </option>
            ))}
          </select>

          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          >
            <option value={DEFAULT_DOCTOR_KEY}>{DEFAULT_DOCTOR.display}</option>
            {doctorsForDept.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
        </div>

        <textarea
          rows="4"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address (optional)"
        />

        <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
          <label style={{ marginBottom: 0 }}>Have you visited before?</label>
          <input
            type="checkbox"
            checked={hasVisited}
            onChange={(e) => setHasVisited(e.target.checked)}
          />
        </div>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "GET APPOINTMENT"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;





// OLD CODE:

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// const DEFAULT_DOCTOR_KEY = "default-mansi";
// const DEFAULT_DOCTOR = {
//   firstName: "Mansi",
//   lastName: "Karanjkar",
//   display: "Dr. Mansi Karanjkar (Default)",
// };

// const AppointmentForm = () => {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [nic, setNic] = useState("");
//   const [dob, setDob] = useState("");
//   const [gender, setGender] = useState("");
//   const [appointmentDate, setAppointmentDate] = useState("");
//   const [department, setDepartment] = useState("Pediatrics");
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctorId, setSelectedDoctorId] = useState(DEFAULT_DOCTOR_KEY);
//   const [address, setAddress] = useState("");
//   const [hasVisited, setHasVisited] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const departmentsArray = [
//     "Pediatrics",
//     "Orthopedics",
//     "Cardiology",
//     "Neurology",
//     "Oncology",
//     "Radiology",
//     "Physical Therapy",
//     "Dermatology",
//     "ENT",
//   ];

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const { data } = await axios.get(
//           "http://localhost:5000/api/v1/user/doctors",
//           { withCredentials: true }
//         );
//         const docs = Array.isArray(data.doctors) ? data.doctors : [];
//         console.log("GET /doctors response:", docs);
//         setDoctors(docs);

//         const foundMansi = docs.find(
//           (d) =>
//             `${(d.firstName || "").trim()} ${(d.lastName || "").trim()}`.toLowerCase() ===
//             "mansi karanjkar"
//         );
//         if (foundMansi) {
//           setSelectedDoctorId(foundMansi._id);
//         } else {
//           setSelectedDoctorId(DEFAULT_DOCTOR_KEY);
//         }
//       } catch (err) {
//         console.error("Failed to fetch doctors:", err);
//         toast.error("Failed to load doctors");
//         setDoctors([]);
//         setSelectedDoctorId(DEFAULT_DOCTOR_KEY);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   const doctorsForDept = doctors.filter((d) => d.doctorDepartment === department);

//   const validateFields = () => {
//     const missing = [];
//     if (!firstName.trim()) missing.push("First name");
//     if (!lastName.trim()) missing.push("Last name");
//     if (!email.trim()) missing.push("Email");
//     if (!phone.trim()) missing.push("Phone");
//     if (!nic.trim()) missing.push("NIC");
//     if (!dob) missing.push("Date of birth");
//     if (!gender) missing.push("Gender");
//     if (!appointmentDate) missing.push("Appointment date/time");
//     if (!department) missing.push("Department");

//     // format checks
//     if (phone && !/^\d{11}$/.test(phone)) missing.push("Phone (must be 11 digits)");
//     if (nic && !/^\d{13}$/.test(nic)) missing.push("NIC (must be 13 digits)");
//     if (gender && !["Male", "Female"].includes(gender)) missing.push("Gender (Male/Female)");
//     return missing;
//   };

//   const handleAppointment = async (e) => {
//     e.preventDefault();

//     const missing = validateFields();
//     if (missing.length > 0) {
//       toast.error("Missing / invalid: " + missing.join(", "));
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const payload = {
//         firstName: firstName.trim(),
//         lastName: lastName.trim(),
//         email: email.trim(),
//         phone: phone.trim(),
//         nic: nic.trim(),
//         dob,
//         gender,
//         appointment_date: appointmentDate,
//         department,
//         doctor: selectedDoctorId && selectedDoctorId !== DEFAULT_DOCTOR_KEY ? selectedDoctorId : null,
//         hasVisited: Boolean(hasVisited),
//         address: address.trim(),
//       };

//       if (selectedDoctorId === DEFAULT_DOCTOR_KEY) {
//         payload.doctor_firstName = DEFAULT_DOCTOR.firstName;
//         payload.doctor_lastName = DEFAULT_DOCTOR.lastName;
//       }

//       console.log("Appointment payload:", payload);

//       const { data } = await axios.post(
//         "http://localhost:5000/api/v1/appointment/post",
//         payload,
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       console.log("Appointment response:", data);
//       toast.success(data.message || "Appointment created successfully");

//       // reset form
//       setFirstName("");
//       setLastName("");
//       setEmail("");
//       setPhone("");
//       setNic("");
//       setDob("");
//       setGender("");
//       setAppointmentDate("");
//       setDepartment("Pediatrics");
//       setSelectedDoctorId(DEFAULT_DOCTOR_KEY);
//       setAddress("");
//       setHasVisited(false);
//     } catch (error) {
//       console.error("Appointment error:", error?.response || error);
//       toast.error(
//         error?.response?.data?.message || error?.message || "Failed to create appointment"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="container form-component appointment-form">
//       <h2>Appointment</h2>
//       <form onSubmit={handleAppointment}>
//         <div>
//           <input
//             type="text"
//             placeholder="First Name"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Last Name"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//           />
//         </div>

//         <div>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Mobile Number (11 digits)"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//           />
//         </div>

//         <div>
//           <input
//             type="text"
//             placeholder="NIC (13 digits)"
//             value={nic}
//             onChange={(e) => setNic(e.target.value)}
//           />
//           <input
//             type="date"
//             value={dob}
//             onChange={(e) => setDob(e.target.value)}
//             placeholder="Date of Birth"
//           />
//         </div>

//         <div>
//           <select value={gender} onChange={(e) => setGender(e.target.value)}>
//             <option value="">Select Gender</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//           </select>

//           <input
//             type="datetime-local"
//             value={appointmentDate}
//             onChange={(e) => setAppointmentDate(e.target.value)}
//             placeholder="Appointment Date & Time"
//           />
//         </div>

//         <div>
//           <select
//             value={department}
//             onChange={(e) => {
//               const dept = e.target.value;
//               setDepartment(dept);
//               const foundMansiInDept = doctors.find(
//                 (d) =>
//                   `${(d.firstName || "").trim()} ${(d.lastName || "").trim()}`.toLowerCase() ===
//                     "mansi karanjkar" && d.doctorDepartment === dept
//               );
//               if (foundMansiInDept) setSelectedDoctorId(foundMansiInDept._id);
//               else setSelectedDoctorId(DEFAULT_DOCTOR_KEY);
//             }}
//           >
//             {departmentsArray.map((depart, index) => (
//               <option value={depart} key={index}>
//                 {depart}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedDoctorId}
//             onChange={(e) => setSelectedDoctorId(e.target.value)}
//           >
//             <option value={DEFAULT_DOCTOR_KEY}>{DEFAULT_DOCTOR.display}</option>
//             {doctorsForDept.map((doctor) => (
//               <option key={doctor._id} value={doctor._id}>
//                 {doctor.firstName} {doctor.lastName}
//               </option>
//             ))}
//             {doctorsForDept.length === 0 &&
//               doctors
//                 .filter((d) => d.doctorDepartment !== department)
//                 .map((doctor) => (
//                   <option key={doctor._id} value={doctor._id}>
//                     {doctor.firstName} {doctor.lastName} — {doctor.doctorDepartment}
//                   </option>
//                 ))}
//           </select>
//         </div>

//         {doctorsForDept.length === 0 && (
//           <p style={{ color: "#b31", marginTop: 8 }}>
//             No doctors available for {department}. Defaulting to {DEFAULT_DOCTOR.display}.
//           </p>
//         )}

//         <textarea
//           rows="4"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           placeholder="Address (optional)"
//         />

//         <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
//           <label style={{ marginBottom: 0 }}>Have you visited before?</label>
//           <input
//             type="checkbox"
//             checked={hasVisited}
//             onChange={(e) => setHasVisited(e.target.checked)}
//           />
//         </div>

//         <div style={{ textAlign: "center", marginTop: 12 }}>
//           <button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Sending..." : "GET APPOINTMENT"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AppointmentForm;