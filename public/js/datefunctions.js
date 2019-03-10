	function calcDayofWeek(dday){
		let day = "";
		switch(dday){
			case 1:
				day = "Monday";
				break;
			case 2:
				day = "Tuesday";
				break;
			case 3:
				day = "Wednesday";
				break;
			case 4:
				day = "Thursday";
				break;
			case 5:
				day = "Friday";
				break;
			case 6:
				day = "Sunday";
				break;
			default:
				day = "Error";
				break;
		}
		return day;
	}

	function calcMonth(dmonth){
		let month = "";
		switch(dmonth){
			case 1:
				month = "January";
				break;
			case 2:
				month = "February";
				break;
			case 3:
				month = "March";
				break;
			case 4:
				month = "April";
				break;
			case 5:
				month = "May";
				break;
			case 6:
				month = "June";
				break;
			case 7:
				month = "July";
				break;
			case 8:
				month = "August";
				break;
			case 9:
				month = "September";
				break;
			case 10:
				month = "October";
				break;
			case 11:
				month = "November";
				break;
			case 12:
				month = "December";
				break;
			default:
				month = "Error";
				break;
		}
		return month;
	}

	function suffix(dday){
		dday = dday % 10;
		let suffix = "";
		if(dday == 1)
			suffix = "st";
		else if(dday == 2)
			suffix = "nd";
		else if(dday == 3)
			suffix = "rd";
		else
			suffix = "th";

		return suffix;
	}

	function rDay(year, month, day){
			this.year = year;
			this.month = month;
			this.day = day;
		}

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
