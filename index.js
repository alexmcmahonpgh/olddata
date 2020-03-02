var express = require('express');
var app = express();
var jquery = require('jquery');
var fs = require('fs');
var http = require("http");
var mysql = require("mysql");
var qs = require("querystring");
var session = require('express-session');
var io = require('socket.io')(http);
var bodyParser = require('body-parser')
var handlebars = require('express-handlebars')
.create({ defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use('/css', express.static('css'));

app.use('/images', express.static('images'));

app.use('/js', express.static('js'));

app.use('/fonts', express.static('fonts'));

app.set ('port', process.env.PORT || 3000);

//app.set('views', __dirname + '/views');

app.use(require('body-parser').urlencoded({ extended: true }));


app.use(function( req, res, next) {
  console.log(req.url);
  next();
})

var con = mysql.createConnection({
  host: '104.248.231.17',
  user: 'DemoAdmin',
  password: 'Alex123!',
  database: 'ODS_DB',
  multipleStatements: true,
  dateStrings: true
});

con.connect(function (err) {
  if (!err)
  console.log("Connection made with the database")
  else
  console.log("DB connection failed \n Error:" + JSON.stringify(err, undefined, 2));
});


app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost: ' +
  app.get('port') + '; press Ctrl-C to terminate.');
});

app.get('/',function(req,res){
  res.render('home');
});

app.post('/data2', function(req, res) {
  var name = req.body.selectpicker
  exercise = req.body.selectpicker2
  console.log(name);
  console.log(exercise);




  res.redirect('data?ID=' + req.body.selectpicker + '&exercise=' + exercise);
});


app.get('/data', function(req,res){
  var queryid = req.query.ID
  console.log(queryid);
  var queryid2 = req.query.exercise
  console.log(queryid2);

  var sqlQuery = 'SELECT Name,Date, Component, Result, `Is Personal Record` as IsPr, comment FROM ODS_DB.Sheet1 where name = ' + req.query.ID + ' and Component =' + req.query.exercise;

  con.query(sqlQuery, function(error, results, fields){
    if(error) {
      console.log(error)
    }else if(!results.length){
      res.redirect('/');
    }else{
      res.render('data', {
        title: "Wod Data",
        results: results,
        name: results[0].Name,
        Component1: results[0].Component
      });
    };
  });
});
