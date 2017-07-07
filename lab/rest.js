var express = require('express');
var app = express();
var bodyParser = require('body-parser')

//Middleware: Allows cross-domain requests (CORS)
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}



//App config
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(allowCrossDomain);

app.get('/contactNumber', function (req, res, next) {
  var name = req.param('name');
  res.end(JSON.stringify({number: '55 11 4125-8545'}));
});

app.post('/login', function (req, res) {
var body = req.body;
 console.log(body.email)  
   res.end( JSON.stringify({isLogged: true}));
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

})