const Doctor = require('../model/doctor.model'); // Assuming you have a Doctor model
const Appointment = require('../model/book_appoinment.model'); 
const Patient = require('../model/patients.model'); 
const Review = require('../model/reviews.model');
const TimeSlot = require('../model/time_slot.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');


//register 
const registerDoctor = async (req, res) => {
  console.log("Hyyyy");
  try {
    const { email, name, mobile_number, password, confirmPassword } = req.body;

    // Check if the email already exists
    const existingPatient = await Doctor.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Doctor({
      email,
      name,
      mobile_number,
      password: hashedPassword
    });

    // Save the patient to the database
    const savedPatient = await newPatient.save();

    res.status(201).json({ success: true, data: savedPatient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// login 
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });

    if (doctor && (await bcrypt.compare(password, doctor.password))) {
      const token = jwt.sign({ doctor_id: doctor._id }, 'doctors-token');
      res.status(200).json({ success: true, token, data: doctor });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// total patients
const getTotalPatients = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    // Doctor model ke through total patients count retrieve karein
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Logic to get all patient records and count for the doctor
    const patientsCount = await Appointment.countDocuments({ doctor_id });
    const patientsList = await Appointment.find({ doctor_id });

    res.status(200).json({ success: true, data: { count: patientsCount, records: patientsList } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//todays patients
const getTodayPatients = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    // Doctor model ke through today's patients count retrieve karein
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Logic to get today's patients count for the doctor
    const todayPatients = await Appointment.countDocuments({
      doctor_id,
      book_date: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    res.status(200).json({ success: true, data: todayPatients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


//book appoinment 
const bookAppointment = async (req, res) => {
  try {
    const { doctor_id, patient_id, book_date, book_day, book_time, accepted } = req.body;

    // Find the doctor and patient in the database
    const doctor = await Doctor.findById(doctor_id);
    const patient = await Patient.findById(patient_id);

    if (!doctor || !patient) {
      return res.status(404).json({ success: false, message: 'Doctor or patient not found' });
    }

    // Create a new Appointment instance with accepted initially set as 0
    const newAppointment = new Appointment({
      doctor_id,
      patient_id,
      book_date,
      book_day,
      book_time,
      accepted: 0, // Set initially as 0
    });

    // Save the appointment to the database
    const savedAppointment = await newAppointment.save();

    res.status(201).json({ success: true, data: savedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// appointment
const getUpcomingAppointments = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const doctor = await Doctor.findById(doctor_id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Get upcoming appointments for the doctor
    const upcomingAppointments = await Appointment.find({
      doctor_id,
      book_date: { $gte: new Date() }, // Filter appointments with date greater than or equal to the current date
    });

    res.status(200).json({ success: true, data: upcomingAppointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//today Appoinment
const getTodayAppointments = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const doctor = await Doctor.findById(doctor_id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Get today's appointments for the doctor
    const todayAppointments = await Appointment.find({
      doctor_id,
      book_date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    res.status(200).json({ success: true, data: todayAppointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//acceptAppointment
const acceptAppointment = async (req, res) => {
  try {
    const { appointment_id } = req.body;
    const { accepted } = req.body;

    // Find the appointment in the database
    const appointment = await Appointment.findById(appointment_id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Update the appointment status
    appointment.accepted = accepted;

    // Save the updated appointment
    const updatedAppointment = await appointment.save();

    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//time shedual 
const scheduleTiming = async (req, res) => {
  try {
    const { doctor_id, slot_duration, available_slots } = req.body;

    // Create a new time_slot document
    const newTimeSlot = new TimeSlot({
      Doctor_id: doctor_id,
      slot_duration: slot_duration,
      available_slots: available_slots,
      createdAt: new Date(),
    });

    // Save the new time_slot document
    const savedTimeSlot = await newTimeSlot.save();

    res.status(200).json({ success: true, data: savedTimeSlot });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//edit schedule timing		
const editScheduleTiming = async (req, res) => {
  try {
    const { schedule_id } = req.params;
    const { slot_duration, available_slot } = req.body;

    // Find the time_slot in the database
    const timeSlot = await TimeSlot.findById(schedule_id);

    if (!timeSlot) {
      return res.status(404).json({ success: false, message: 'Time slot not found' });
    }

    // Update the time_slot's schedule
    timeSlot.slot_duration = slot_duration;
    timeSlot.available_slot = available_slot;
    timeSlot.updatedAt = Date.now();

    // Save the updated time_slot
    const updatedTimeSlot = await timeSlot.save();

    res.status(200).json({ success: true, data: updatedTimeSlot });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//get schedule timing			
const getAllSchedules = async (req, res) => {
  try {
    // Retrieve all schedules from the database
    const schedules = await TimeSlot.find();

    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//add available time		
const addAvailableTime = async (req, res) => {
  try {
    const { date, doctor_id, available_for_that_day } = req.body;

    // Find the doctor in the database
    const doctor = await Doctor.findById(doctor_id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Create a new time slot instance
    const newTimeSlot = new TimeSlot({
      doctor_id,
      date,
      available_for_that_day,
    });

    // Save the new time slot to the database
    const savedTimeSlot = await newTimeSlot.save();

    res.status(201).json({ success: true, data: savedTimeSlot });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//send new password in mail and update that password in doctor 			
const sendNewPassword = async (req, res) => {
  try {
    const { doctor_id } = req.body;

    // Generate a random password
    const newPassword = randomstring.generate(8); // You can customize the length as needed

    // Find the doctor in the database
    const doctor = await Doctor.findById(doctor_id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Update the doctor's password in the database
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctor_id,
      { $set: { password: newPassword } },
      { new: true }
    );

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'itsr.manisha@gmail.com', // Replace with your Gmail email
        pass: 'kinu xbhi nfkz nbzv', // Replace with your Gmail password
      },
    });

    // Email content
    const mailOptions = {
      from: 'mani@gmail.com', // Replace with your Gmail email
      to: doctor.email, // Use the doctor's email from the database
      subject: 'Password Reset 🤐🤐🤐',
      text: `Your new password is: ${newPassword}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      res.status(200).json({ success: true, data: updatedDoctor });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


//update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const {
      doctor_id,
      username,
      email,
      first_name,
      last_name,
      phone_number,
      gender,
      dob,
      biography,
      clinicname,
      clinic_address,
      clinic_images,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      postal_code,
      pricing,
      service,
      education,
      experience,
      awards,
      memberships,
      registrations,
    } = req.body;

    // Find the doctor in the database
    const doctor = await Doctor.findById(doctor_id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Update the doctor's profile fields
    doctor.username = username;
    doctor.email = email;
    doctor.first_name = first_name;
    doctor.last_name = last_name;
    doctor.phone_number = phone_number;
    doctor.gender = gender;
    doctor.dob = dob;
    doctor.biography = biography;
    doctor.clinicname = clinicname;
    doctor.clinic_address = clinic_address;
    doctor.clinic_images = clinic_images;
    doctor.address_line_1 = address_line_1;
    doctor.address_line_2 = address_line_2;
    doctor.city = city;
    doctor.state = state;
    doctor.country = country;
    doctor.postal_code = postal_code;
    doctor.pricing = pricing;
    doctor.service = service;
    doctor.education = education;
    doctor.experience = experience;
    doctor.awards = awards;
    doctor.memberships = memberships;
    doctor.registrations = registrations;

    // Save the updated doctor profile
    const updatedDoctor = await doctor.save();

    res.status(200).json({ success: true, data: updatedDoctor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
//update profile image

//get all reviews
const getAllReviews = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    // Find the doctor in the database
    const doctor = await Doctor.findById(doctor_id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Retrieve all reviews for the doctor
    const reviews = await Review.find({ doctor_id });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//reply to review
const replyToReview = async (req, res) => {
  try {
    const { reviews_id, description, user } = req.body;

    // Find the review in the database
    const review = await Review.findById(reviews_id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Ensure that the 'description' array is initialized
    review.description = review.description || [];

    // Update the review with the reply
    review.description.push({ user, content: description });

    // Save the updated review
    const updatedReview = await review.save();

    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



//logout
const logout = async (req, res) => {
  try {
    const { doctor_id } = req.body;

    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  registerDoctor,
  loginDoctor,
  getTotalPatients,
  getTodayPatients,
  getUpcomingAppointments,
  getTodayAppointments,
  acceptAppointment,
  scheduleTiming,
  editScheduleTiming,
  addAvailableTime,
  updateDoctorProfile,
  getAllReviews,
  replyToReview,
  bookAppointment,
  logout,
  getAllSchedules,
  sendNewPassword

};

