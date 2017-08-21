const axios = require('axios');


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
  console.log(JSON.stringify({"invalid_customers":finalArray}, null,4));
})
.catch(err => {
  console.log('error', err);
})

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
  if(!method['required'] || attribute === null){
    if(attribute === null || typeof attribute !== method['type']){
      return true
    }else{
      return false
    }
  }else if(method.hasOwnProperty('length') && attribute.length < method.length.min){
    return true
  }else if(method.hasOwnProperty('length') && attribute.length > method.length.max){
    return true
  }else if((method.hasOwnProperty('type') && typeof attribute !== method['type'])){
    return true
  }
  return false
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
