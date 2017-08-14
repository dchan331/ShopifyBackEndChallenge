const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const api = require('./routes/routes');
const axios = require('axios');
const _ = require('underscore');


app.get('/', (req, res) => {
  axios.get('https://backend-challenge-winter-2017.herokuapp.com/customers.json')
  .then(response => {
    return response.data.pagination
  })
  .then(resp => {
    var length = Math.ceil(resp.total / resp.per_page);
    let array = [];
    for(var i = 0 ; i < length ; i ++){
      array.push(axiosLoop(i))
    }
    return Promise.all(array)
  })
  .then(resp =>{
    let finalArray = []
    resp.forEach((index) => {
      index.forEach((invalid) => {
        finalArray.push(invalid)
      })
    })
    res.send({"invalid_customers":finalArray})
  })
  .catch(err => {
    res.send('error');
  })
});


app.use('/api', api);

app.listen(PORT, error => {
  error
  ? console.error(error)
  : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});

function axiosLoop(index){
  let responseArray = [];
  return axios.get('https://backend-challenge-winter-2017.herokuapp.com/customers.json',{
    params: {
      page: index + 1
    }
  })
  .then(response => {
    return filterData(response)
  })
  .then(resp => {
    if(resp.length > 0){
      for(var j = 0 ; j < resp.length ; j ++){
        responseArray.push(resp[j])
      }
    }
    return responseArray;
  })
}

function Validation(attribute, method){
  let bool = false
  if(!method.required){
    return false
  }else if(attribute === null){
    bool = true
  }else if(method.hasOwnProperty('length') && attribute.length < method.length.min){
    bool = true
  }else if(method.hasOwnProperty('length') && attribute.length > method.length.max){
    bool = true
  }else if((method.hasOwnProperty('type') && typeof attribute !== method["type"])){
    bool = true
  }
  return bool
}

function filterData(response){
  const data = response.data;
  const methods = data.validations;
  let invalidArray = [];
  data.customers.forEach(customer => {
    let customerObj = {"id": customer.id, "invalid_fields":[]}
    methods.forEach( method => {
      const key = Object.keys(method)[0];
      if(Validation(customer[key], method[key])){
        var IFArray = customerObj["invalid_fields"];
        customerObj["invalid_fields"] = IFArray.concat([key])
      }
    })

    if(customerObj["invalid_fields"].length !== 0){
      invalidArray.push(customerObj)
    }
  })
  return invalidArray;
}

module.exports = app;
