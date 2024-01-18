const bcrypt = require('bcrypt');
const Patient = require('../model/patients.model');
const Doctor = require('../model/doctor.model');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/multerConfig');
const Review = require('../model/reviews.model')
const fav_dr = require('../model/faviroute_doctor_list.model')

//register

const registerPatient = async (req, res) => {
  console.log("Hyyyy");
  try {
    const { email, first_name, mobile_number, password, confirmPassword } = req.body;

    // Check if the email already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new patient instance with the hashed password
    const newPatient = new Patient({
      email,
      first_name,
      mobile_number,
      password: hashedPassword
      // Add other fields as needed
    });

    // Save the patient to the database
    const savedPatient = await newPatient.save();

    res.status(201).json({ success: true, data: savedPatient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//login
const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });

    if (patient && (await bcrypt.compare(password, patient.password))) {
      const token = jwt.sign({ patient_id: patient._id }, 'patients-token');
      res.status(200).json({ success: true, token, data: patient });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


//getDoctorListWithCount
const getDoctorListWithCount = async (req, res) => {
  try {
    // Get the list of doctors
    const doctors = await Doctor.find();
    console.log(doctors);
    // Get the count of doctors
    const doctorCount = await Doctor.countDocuments();

    // Respond with the list of doctors and count
    res.status(200).json({ success: true, count: doctorCount, data: doctors });
  } catch (error) {
    console.error('Error getting doctor list:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


//getDoctorById
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the doctor by ID
    const doctor = await Doctor.findById(id);

    if (doctor) {
      // Respond with the doctor details
      res.status(200).json({ success: true, data: doctor });
    } else {
      // Doctor not found
      res.status(404).json({ success: false, message: 'Doctor not found' });
    }
  } catch (error) {
    console.error('Error getting doctor by ID:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

//add to faviroute
const addToFavorites = async (req, res) => {
  try {
    const { doctor_id, patient_id } = req.body;

    // Check if the favorite already exists
    const existingFavorite = await fav_dr.findOne({  patient_id, doctor_id });

    if (existingFavorite) {
      return res.status(400).json({ success: false, message: 'Doctor is already in favorites' });
    }

    // Create a new favorite
    const newFavorite = new fav_dr({  patient_id, doctor_id });

    // Save the new favorite
    const savedFavorite = await newFavorite.save();

    res.status(201).json({ success: true, data: savedFavorite });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


//getFavoriteDoctorsByPatientId
const getFavoriteDoctorsByPatientId = async (req, res) => {
  try {
    const { patient_id } = req.params;

    // Find all favorites for the given patient ID
    const favorites = await fav_dr.find({ patient_id });

    res.status(200).json({ success: true, data: favorites });
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};





//updatePatientProfile
const updatePatientProfile = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const {
      last_name,
      dob,
      blood_group,
      email,
      mobile,
      address,
      city,
      state,
      zip_code,
      country,
    } = req.body;

    // Find the patient by ID
    const patient = await Patient.findByIdAndUpdate(
      patient_id,
      {
        last_name,
        dob,
        blood_group,
        email,
        mobile,
        address,
        city,
        state,
        zip_code,
        country,
      },
      { new: true } // To return the updated patient document
    );

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    console.error('Error updating patient profile:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


//update image 
const updateProfileImage = async (req, res) => {
  try {
    const { patient_id } = req.params;

    // Use Multer to handle the file upload
    upload.single('profile')(req, res, async (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ success: false, error: 'File upload error' });
      }

      // Get the file information from the request
      const { filename } = req.file;

      // Find the patient by ID
      const patient = await Patient.findByIdAndUpdate(
        patient_id,
        { profile: filename }, // Update the patient's profile with the uploaded filename
        { new: true } // To return the updated patient document
      );

      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
      }

      res.status(200).json({ success: true, data: patient });
    });
  } catch (error) {
    console.error('Error updating patient profile image:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

//update password
const updatePassword = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const { password, email, message } = req.body;

    // Find the patient by ID and email
    const patient = await Patient.findOne({ _id: patient_id, email });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Update the patient's password
    const hashedPassword = await bcrypt.hash(password, 10);
    patient.password = hashedPassword;
    await patient.save();

    res.status(200).json({ success: true, data: { message: 'Password updated successfully' } });
  } catch (error) {
    console.error('Error updating patient password:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

//Logout
const logoutPatient = async (req, res) => {
  try {
    const { patient_id } = req.body;

    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

 
//add review
const addReview = async (req, res) => {
  try {
    const { doctor_id, patient_id, count, description } = req.body;

    // Validate that the description array is provided and has at least one element
    if (!description || !Array.isArray(description) || description.length === 0) {
      return res.status(400).json({ success: false, error: 'Description array is required with at least one element' });
    }

    // Create a new review with properly formatted description
    const newReview = new Review({
      doctor_id,
      patient_id,
      count,
      Description: description.map(desc => ({
        patient_id: desc.patient_id || null,
        description: desc.description || null,
        user: desc.user || null,
      }))[0], // Use the first element of the array
    });

    // Save the review to the database
    const savedReview = await newReview.save();

    res.status(201).json({ success: true, data: savedReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


//search 
const searchDoctors = async (req, res) => {
  try {
    const { search } = req.body;

    // Check if search is a valid string
    if (typeof search !== 'string' || search.trim() === '') {
      return res.status(400).json({ success: false, error: 'Invalid search term' });
    }
    const lowerSearch = search.toLowerCase();

    const doctors = await Doctor.find({
      $or: [
        { city: { $regex: new RegExp(lowerSearch, 'i') } },
        { name: { $regex: new RegExp(lowerSearch, 'i') } },
        { clinic_name: { $regex: new RegExp(lowerSearch, 'i') } },
        { hospital_name: { $regex: new RegExp(lowerSearch, 'i') } },
      ]
    });

    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error('Error searching for doctors:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


module.exports = {
  registerPatient,
  loginPatient,
  getDoctorListWithCount,
  getDoctorById,
  addToFavorites,
  getFavoriteDoctorsByPatientId,
  updatePatientProfile,
  updateProfileImage,
  updatePassword,
  logoutPatient,
  addReview,
  searchDoctors
};
