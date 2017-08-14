const express = require('express');
const router = express.Router();
const User = require('../model/user');
const _ = require('underscore');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }))

// mongoose configuration
// const mongoose = require('mongoose');
//
// if (! process.env.MONGODB_URI) {
//   throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
// }
// mongoose.connection.on('connected', function() {
//   console.log('Success: connected to MongoDb!');
// });
// mongoose.connection.on('error', function() {
//   console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
//   process.exit(1);
// });
// mongoose.connect(process.env.MONGODB_URI);

// YOUR API ROUTES HERE

module.exports = router;
