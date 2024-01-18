const Admin = require('../model/admin.model');
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const Doctor = require('../model/doctor.model');
const Patient = require('../model/patients.model');
const Appointment = require('../model/book_appoinment.model');
const Speciality = require('../model/specialities.model')
const jwt = require("jsonwebtoken");
const Review = require ('../model/reviews.model')


const adminLogin = async (req, res) => {
  // Static data for simplicity
  const staticAdminData = {
    email_id: 'admin@example.com',
    password: 'admin123', // In a real-world scenario, use a secure method to hash passwords
  };

  try {
    // Check if an admin with the provided email already exists
    const existingAdmin = await Admin.findOne({ email_id: staticAdminData.email_id });

    if (existingAdmin) {
      // If admin exists, return an error
      return res.status(400).json({ success: false, message: 'Admin is already login' });
    }

    // If admin does not exist, create a new admin using static data
    const newAdmin = new Admin(staticAdminData);
    await newAdmin.save();

    // Generate a token for the new admin (for simplicity, using a static secret key)
    const token = jwt.sign({ adminId: newAdmin._id, email: newAdmin.email_id }, 'admin-secret-key');

    res.status(201).json({ success: true, message: 'Admin registered successfully', token });
  } catch (error) {
    console.error('Error during admin registration:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const getDoctorCount = async (req, res) => {
  try {
    // Get the count of doctors
    const doctorCount = await Doctor.countDocuments();

    res.status(200).json({ success: true, message: 'Doctor count retrieved successfully', count: doctorCount });
  } catch (error) {
    console.error('Error getting doctor count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getPatientsCount = async (req, res) => {
  try {
    const patientCount = await Patient.countDocuments();

    res.status(200).json({ success: true, message: 'patient count retrieved successfully', count: patientCount });
  } catch (error) {
    console.error('Error getting patient count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAppointmentsWithCount = async (req, res) => {
  try {
    // Get the list of appointments
    const appointments = await Appointment.find();

    // Get the count of appointments
    const appointmentCount = await Appointment.countDocuments();

    res.status(200).json({ success: true, message: 'Appointment list retrieved successfully', count: appointmentCount,appointments });
  } catch (error) {
    console.error('Error getting appointment list:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const addSpeciality = async (req, res) => {
  const { uId, specialities, image } = req.body;

  try {
    // Create a new speciality document
    const newSpeciality = new Speciality({ uId, specialities, image });

    // Save the speciality document to the database
    await newSpeciality.save();

    res.status(201).json({ success: true, message: 'Speciality added successfully' });
  } catch (error) {
    console.error('Error adding speciality:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const editSpecialist = async (req, res) => {
  const { speciality_id } = req.params; // Extract specialist ID from the request parameters
  const { uId, specialities, image } = req.body;

  try {
    // Find the specialist by ID and update the fields
    const updatedSpecialist = await Speciality.findByIdAndUpdate(
      speciality_id,
      { uId, specialities, image, updatedAt: new Date().toLocaleDateString() },
      { new: true } // Return the updated document
    );

    if (!updatedSpecialist) {
      return res.status(404).json({ success: false, message: 'Specialist not found' });
    }

    res.status(200).json({ success: true, message: 'Specialist updated successfully', specialist: updatedSpecialist });
  } catch (error) {
    console.error('Error editing specialist:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteSpecialist = async (req, res) => {
  const { speciality_id } = req.params; // Extract specialist ID from the request parameters

  try {
    // Ensure that the user making the request is an admin
    if (!req.user || !req.user.adminId) {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access only' });
    }

    // Find the specialist by ID and delete it
    const deletedSpecialist = await Speciality.findByIdAndDelete(speciality_id);

    if (!deletedSpecialist) {
      return res.status(404).json({ success: false, message: 'Specialist not found' });
    }

    res.status(200).json({ success: true, message: 'Specialist deleted successfully', specialist: deletedSpecialist });
  } catch (error) {
    console.error('Error deleting specialist:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//review 
const getAllReviews = async (req, res) => {
  try {
    const allReviews = await Review.countDocuments();
    res.status(200).json({ success: true, message: 'All reviews retrieved successfully', reviews: allReviews ,});
  } catch (error) {
    console.error('Error getting all reviews:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//forgetpassword
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Generate a new password
    const newPassword = generateRandomPassword();

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token expiry in 1 hour

    // Update admin's password and resetTokenExpiry
    await Admin.findByIdAndUpdate(admin._id, { password: hashedPassword, resetToken, resetTokenExpiry });

    res.status(200).json({
      success: true,
      message: 'Password reset token and new password sent successfully',
      resetToken,
      newPassword,
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Helper function to generate a random password
const generateRandomPassword = () => {
  // Implement your logic to generate a random password, for example:
  const randomPassword = Math.random().toString(36).slice(-8);
  return randomPassword;
};



const logout = (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token is required for logout' });
  }

  res.status(200).json({ success: true, message: 'Logout with token successful' });
};



module.exports = {
  adminLogin,
  getDoctorCount,
  getPatientsCount,
  getAppointmentsWithCount,
  addSpeciality,
  editSpecialist,
  deleteSpecialist,
  getAllReviews,
  forgotPassword,
  logout
};
