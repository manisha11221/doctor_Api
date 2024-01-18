const route = require('express').Router();
const isAdmin = require('../middleware/adminAuth');

const {
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

}= require('../controller/admin.ctrl')

route.post('/admin-login',adminLogin);
route.get('/doctors/count', isAdmin, getDoctorCount);
route.get('/patients/count', isAdmin, getPatientsCount);
route.get('/appoinment/count', isAdmin, getAppointmentsWithCount);
route.post('/specialities', isAdmin, addSpeciality);
route.post('/edit-specialist/:speciality_id', isAdmin, editSpecialist);
route.delete('/delete-specialist/:speciality_id', isAdmin, deleteSpecialist);
route.get('/get-All-Reviews', isAdmin, getAllReviews);
route.post('/forgot-Password', isAdmin, forgotPassword);
route.post('/logout', isAdmin, logout);


module.exports = route;  