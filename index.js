const express = require('express'), //Imports express dependency
	  	path = require('path'), //Imports Path dependency
      mysql = require('mysql'),
      bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const app = express() //Creates express object
const http = require('http').Server(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname,'views')) //sets views path to views file
app.set('view engine', 'mustache')// sets views engine to mustache
app.engine('mustache', require('hogan-middleware').__express) //sets up hogan middle ware
app.use(express.static(path.join(__dirname, 'public')))

function announcement(styear, stmonth, stday, endyear, endmonth, endday, text, video = false){
		this.text = text;
		this.days = [];
		this.video = video;

		let year = styear;
		let month = stmonth;
		let day = stday;
		while(true){
			this.addDay(year, month, day);

			if(day == calcDays(month, year)){
				if(month < 12)
					month++;
				else{
					month = 1;
					year++;
				}
				day = 1;
			}else
				day++;

			if(((year == endyear) && (month == endmonth) && (day == endday)) || (year >= 3000)){
				this.addDay(year, month, day);
				break;
			}
		}
	}

	announcement.prototype.addDay = function(year, month, day){
		this.days[this.days.length] = new rDay(year, month, day);
	}

const con = mysql.createPool({
	connectionLimit: 100,
	host: "us-cdbr-iron-east-03.cleardb.net",
	user: "b31e06c660fbbd",
	password:"d9509ec4",
	port: 3306,
	database: "heroku_a07141a102e2b1f",
	debug: 'false'
})

const d = new Date();
var dyear = d.getFullYear();
var dmonth = d.getMonth()+1;
var dday = d.getDate();
var ddayWeek = d.getDay();


var date = {
	year: dyear,
	month: dmonth,
	day: dday,
	dayWeek: ddayWeek
}


app.get("/", (req, res, next) =>{
	res.render('home',date)
})

app.get("/script", (req, res, next) =>{
	res.render("script",date)
})

app.post("/submission", (req, res, next) =>{
	var exDates = [];
	var numExDates = Object.keys(req.body).length-2;
	console.log(numExDates);
	var startdate = req.body.startdate[0];
	var enddate = req.body.startdate[1];
	var text = req.body.text;

	for(let i = 0; i < numExDates;i++){
		exDates[exDates.length] = req.body.date[i];
	}

	res.redirect("/")
	res.end()
})

http.listen(port, function(){
  console.log('listening on *:' + port);
});
 // Connects server to port; Typical Ports: 3000, 5000, 8000, 8080

module.exports = app
