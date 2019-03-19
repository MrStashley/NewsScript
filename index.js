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



	function calcDays(month,year){
		var days;
		var leapyear = false;

		if((year%4 == 0) && (year%100 != 0) || (year%400 == 0))
			leapyear = true;

		switch(month){
			case 2:
				if(leapyear)
					days = 29;
				else
					days = 28;
				break;
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				days = 31;
				break;
			case 4:
			case 6:
			case 9:
			case 11:
				days = 30;
				break;
		}

		return days;
	}


	function rDay(year, month, day){
			this.year = year;
			this.month = month;
			this.day = day;
		}


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

	announcement.prototype.isRun = function(date){
		var run = false;
		for(let i = 0; i < this.days.length;i++){
			var d = this.days[i];
			if((d.year == date.year) && (d.month == date.month) && (d.day == date.day)){
				run = true;
			}
		}
		return run;
	}

	var isFirst(r1,r2){
		var is = false;
		if(r1.year < r2.year)
			is = true;
		if(r1.month < r2.year)
			is = true;
		if(r1.day < r2.day)
			is = true;

		return is;
	}

const con = mysql.createPool({
	connectionLimit: 100,
	host: "us-cdbr-iron-east-03.cleardb.net",
	user: "bfa4f0b845d82b",
	password:"971911e2",
	port: 3306,
	database: "heroku_01d0e57e990d5bb",
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

var announcements = [];

var announcementList = {
	runToday: new Array,
	notRunToday: new Array,
	new: new Array
}

app.get("/", (req, res, next) =>{
	res.render('home');
})

app.get("/data", (req,res,next) =>{
	con.query("select * from announcements", function(err, result,fields){
		if(err){
			console.log(err.stack);
		}
		announcements = [];
		announcementList.runToday = [];
		announcementList.notRunToday = [];
		announcementList.new = [];
		for(let i = 0; i < result.length;i++){
			var addate;
			var start = result[i].startdate;
			var end = result[i].enddate;
			var add = JSON.parse(result[i].addates);
			var text = result[i].atext;
			announcements[announcements.length] = new announcement(start.getFullYear(),start.getMonth()+1,start.getDate(),end.getFullYear(),end.getMonth()+1,end.getDate(),text);

			for(let j = 0; j < add.length; j++){
				addate = new Date(add[i]);
				announcements[announcements.length-1].addDay(addate.getFullYear(),addate.getMonth(),addate.getDate());
			}
		}

		for(let i = 0; i < announcements.length;i++){
			if(announcements[i].isRun(date)){
				announcementList.runToday[announcementList.runToday.length] = announcements[i];
			}else {
				announcementList.notRunToday[announcementList.notRunToday.length] = announcements[i];
			}
		}

		res.json(announcementList);
	});
})

app.get("/script", (req, res, next) =>{
	res.render("script",date)
})

app.post("/submission", (req, res, next) =>{
	var exDates = [];
	var exDatesJSON;
	var numExDates = Object.keys(req.body).length-2;
	var startdate = req.body.startdate[0];
	var enddate = req.body.startdate[1];
	var text = req.body.text;

	if(numExDates == 1){
		exDates[exDates.length] = req.body.date;
	}
	else if(numExDates > 1){
		var r1,r2,temp;
		for(let i = 0; i <= numExDates;i++){
			r1 = exDates[exDates.length-1];
			r1 = req.body.date[i];
			exDates[exDates.length] = req.body.date[i];
		}
	}
	exDatesJSON = JSON.stringify(exDates);

	con.query("INSERT INTO announcements VALUES (?,?,?,?)",[startdate,enddate,exDatesJSON,text], function(err, result){
		if(err){
			console.log(err.stack);
		}
	});

	res.redirect("/")
	res.end()
})

http.listen(port, function(){
  console.log('listening on *:' + port);
});
 // Connects server to port; Typical Ports: 3000, 5000, 8000, 8080

module.exports = app
