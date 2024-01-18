const route = require('express').Router();

const{
    registerDoctor,
    loginDoctor,
    getTotalPatients,
    getTodayPatients,
    getUpcomingAppointments,
    getTodayAppointments,
    acceptAppointment,
    scheduleTiming,
    editScheduleTiming,
    getAllSchedules,
    updateDoctorProfile,
    getAllReviews,
    replyToReview,
    bookAppointment,
    logout,
    addAvailableTime,
    sendNewPassword
    
} = require('../controller/doctor.ctrl')

route.post('/registerDoctor',registerDoctor);
route.post('/loginDoctor',loginDoctor);
route.get('/total-patients/:doctor_id',getTotalPatients);
route.get('/today-patients/:doctor_id',getTodayPatients);
route.get('/get-upcoming-appointments/:doctor_id',getUpcomingAppointments);
route.get('/today-appointments/:doctor_id',getTodayAppointments);
route.post('/accept-appointments', acceptAppointment);
route.post('/schedule-Timing', scheduleTiming);
route.put('/schedule-edit/:schedule_id', editScheduleTiming);
route.get('/get-schedule', getAllSchedules);
route.post('/add-available-time', addAvailableTime);
route.post('/update-profile', updateDoctorProfile);
route.get('/get-all-reviews/:doctor_id', getAllReviews);
route.post('/reply-to-review',replyToReview);
route.post('/book-appointment', bookAppointment);
route.post('/logout', logout);
route.post('/send-New-Password',sendNewPassword)


module.exports = route;  