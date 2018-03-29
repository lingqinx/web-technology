var express = require('express');
var app = express();
var request = require('request');
var parser = require('xml2js');

// use public as static file folder.
app.use(express.static(__dirname  )); 
app.all('*',function (req, res, next) {  
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');});


app.get('/market',function(req,res){
  var input = req.param('input');
  console.log(input);
    url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=' + input;
    req = request({
      url:url,
      json: true
    }, function(error, response, body) {

      if (error) { return console.log(error); }

    res.send(body);

  });
 
 });

app.get('/stock_price',function(req,res){
  var input = req.param('input');
    url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ input +'&outputsize=full&apikey=QCK6O0TDD595BLVW';
    request({

      url:url,
      json: true
    }, function(error, response, body) {

      if (error) { return console.log(error); }

    res.send(body);

  });
 });

app.get('/stock_graph',function(req,res){
  var IndicatorId = req.param('input');
  var symbol= req.param('sy');
  console.log(IndicatorId);
  console.log(symbol);
    url = 'https://www.alphavantage.co/query?function='+IndicatorId+'&symbol='+symbol +'&interval=15min&time_period=10&series_type=close&apikey=QCK6O0TDD595BLVW';
    request({

      url:url,
      json: true
    }, function(error, response, body) {

      if (error) { return console.log(error); }
      console.log(body);
    res.send(body);

  });
 });

app.get('/news',function(req,res){
  var symbol= req.param('input');
  //console.log(symbol);
    url = 'https://seekingalpha.com/api/sa/combined/'+symbol +'.xml';
    request({

      url:url,
      json: true
    }, function(error, response, body) {

      if (error) { return console.log(error); }
    var parseString = parser.parseString;

    parseString(body, function (err, result) {
      var jsonResult = JSON.stringify(result)
      //console.log(JSON.stringify(result));

      res.send(JSON.stringify(result));
    });


  });
 });

app.listen(3001);