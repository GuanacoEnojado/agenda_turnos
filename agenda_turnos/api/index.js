const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
require('dotenv').config();
const sequelize = require('./util/database');
const User = require('./models/user');
const Trabajador = require('./models/trabajador');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
app.options('*', cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Request-Headers", "*");
  res.setHeader("Accept", "application/json");
  next();
});

//test route
app.get('/', (req, res, next) => {
  res.send('Hello World');
});

//CRUD routes
app.use('/users', require('./routes/users'));
app.use('/trabajadores', require('./routes/trabajadores'));


//error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

//sync database with schema updates
sequelize
  .sync({ alter: true })
  .then(result => {
    console.log("Database connected and schema updated");
    app.listen(3000);
  })
  .catch(err => console.log(err));
