const express = require('express');
const app  = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const db = require('./db/conn.db.js');
const port = 7000;

app.use(bodyparser.json());

const doctor_route = require('./route/doctor.route.js');
const patients_route = require('./route/patients.route.js');
const chat_route = require('./route/chat.route.js');
const admin_route = require('./route/admin.route.js');


app.use("/api/doctor",doctor_route);
app.use("/api/patients",patients_route);
app.use("/api/chat",chat_route);
app.use("/api/admin",admin_route);


app.listen(port, () => {
    console.log(`${port} Port is running `);
})



