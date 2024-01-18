const route = require('express').Router();

const{
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
    
} = require('../controller/patients.ctrl')

route.post('/register-patients',registerPatient);
route.post('/login-Patient',loginPatient);
route.get('/doctor-count', getDoctorListWithCount);
route.get('/doctor-by-id/:id', getDoctorById);
route.post('/add-to-favorites',addToFavorites);
route.get('/favorite-doctors/:patient_id', getFavoriteDoctorsByPatientId);
route.post('/update-profile/:patient_id', updatePatientProfile);
route.post('/update-profile-image/:patient_id', updateProfileImage);
route.post('/update-password/:patient_id',updatePassword);
route.get('/logout', logoutPatient);
route.post('/add-review', addReview);
route.post('/search-Doctors', searchDoctors);




module.exports = route;  
