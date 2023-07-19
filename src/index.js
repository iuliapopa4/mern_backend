// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const database = require('./config/database');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes'); 

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/groups', groupRoutes); 

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
