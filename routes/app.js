"use strict";
var fs = require('fs');
const csv=require('csvtojson')
var csvjson = require('csvjson');
var path = require("path");

function fileReader(csvFilePath){
  var data = fs.readFileSync(path.join(__dirname, csvFilePath), { encoding : 'utf8'});
  var options = {
    delimiter : ',',
    quote: '"'
  };
  return csvjson.toObject(data, options);
}

function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function GeoJSON(set){
  const GeoJSON = {
    "type": "FeatureCollection",
    "features": []
  }
  set.forEach((home) => {
    GeoJSON.features.push({
      "type": "Feature",
      "geometry": {"type": "Point", "coordinates": [home.lng,home.lat]},
      "properties": {
        "id": home.id,
        "price": home.price,
        "street": home.street,
        "bedrooms": home.bedrooms,
        "bathrooms": home.bathrooms,
        "sq_ft": home.sq_ft
      }
    })
    // console.log(GeoJSON)
  })
  return GeoJSON;
};

module.exports = {
  fileReader: fileReader,
  GeoJSON: GeoJSON,
  randomString: randomString
}
