const express = require('express');
const router = express.Router();
const User = require('../model/user');
const func = require('./app.js');
const dataSet = func.fileReader('./listing-details.csv');
const _ = require('underscore');
const bodyParser = require('body-parser');
var fs = require('fs');
router.use(bodyParser.urlencoded({ extended: true }))

var cookieParser = require('cookie-parser')
router.use(cookieParser())

// mongoose configuration
const mongoose = require('mongoose');

if (! fs.existsSync('./env.sh')) {
  throw new Error('env.sh file is missing');
}
if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI);

// YOUR API ROUTES HERE

router.get('/listings', function(req, res){
  if(req.cookies.api_key){
    req.query.min_price = req.query.min_price || 0;
    req.query.max_price = req.query.max_price || Infinity;
    req.query.min_bed = req.query.min_bed || 0;
    req.query.max_bed = req.query.max_bed || Infinity;
    req.query.min_bath = req.query.min_bath || 0;
    req.query.max_bath = req.query.max_bath || Infinity;
    const filteredData = dataSet.filter((home) => {
      return Number(home.price) >= Number(req.query.min_price) &&
      Number(home.price) <= Number(req.query.max_price) &&
      Number(home.bedrooms) >= Number(req.query.min_bed) &&
      Number(home.bedrooms) <= Number(req.query.max_bed) &&
      Number(home.bathrooms) >= Number(req.query.min_bath) &&
      Number(home.bathrooms) <= Number(req.query.max_bath);
    })
    res.send(func.GeoJSON(filteredData));
  }else{
    res.send('Cookies dont exist')
  }
});

router.post('/register', function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  const apikey = func.randomString(10)
  User.findOne({username: username})
    .then((user) => {
      if(_.isEmpty(user)){
        const newUser = new User({
          api_key: apikey,
          username: username,
          password: password
        });
        res.cookie('api_key', apikey, {expire: 360000 + Date.now()});
        newUser.save((err) => {
          if(err){
            res.send('Failed to save User')
          }else{
            res.send('Success')
          }
        })
      }else{
        res.status('403').send('User already exists')
      }
    })
})


router.post('/retrieve_key', function(req, res){
  User.findOne({username: req.body.username, password: req.body.password})
    .then((resp) => res.send(resp.api_key))
});

router.post('/refresh_key', function(req, res){
  const newKey = func.randomString(10);
  User.findOneAndUpdate({api_key: req.body.api_key}, {api_key: newKey})
    .then((resp) => {
      User.findOne({api_key: newKey})
      .then((resp2) => (
        res.send(resp2.api_key)
      ))
    })

});

// SAMPLE ROUTE
router.use('/users', (req, res) => {
    res.json({ success: true });
});




module.exports = router;
