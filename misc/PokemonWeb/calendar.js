//Simple script that converts date and time to pokemon sprites

printTime(getTime());

//Retrieves current system date and time
//Returns an array of the values 
function getTime()
{
	var today = new Date();	
	var seconds	= today.getSeconds();
	var minutes	= today.getMinutes();
	var hours = today.getHours();
	
	//formats hours into 12-hr format
	if (hours === 0)
	{
		//midnight (00:00) is 12:00
		hours = 12;
	}
	else if (hours > 12)
	{
		//converts 24-hr format to 12 hr-format
		hours -= 12;
	}
	
	var date = today.getDate();
	var month = today.getMonth() + 1;	//(months start at 0)
	var year = today.getFullYear();
	
	return [seconds, minutes, hours, date, month, year];
}

//Prints the date/time as images provided an array of data
function printTime(calendar)
{
	//separate four digit year to 2+2 digit year
	var yearFirst = calendar[5].toString().substring(0,2);
	var yearSecond = calendar[5].toString().substring(2);
	
	//generate a string of xml code
	var out = "";
	out += 	"<img src='" + getImage(calendar[2]) + "'> :"
		+ 	"<img src='" + getImage(calendar[1]) + "'> :"
		+ 	"<img src='" + getImage(calendar[0]) + "'><br>"		
		+ 	"<img src='" + getImage(calendar[4]) + "'>/"
		+ 	"<img src='" + getImage(calendar[3]) + "'>/"
		+ 	"<img src='" + getImage(yearFirst) + "'>"
		+ 	"<img src='" + getImage(yearSecond) + "'>" 
		+ 	"<br>";
		
	out += 	"The time is: " + calendar[2] + ":"
		+ pad(calendar[1]) + ":"
		+ pad(calendar[0]) + "<br>The date is: "		
		+ calendar[4] + "/"
		+ calendar[3] + "/"
		+ yearFirst + yearSecond + "<br>";

	//output generated string to div on html
	document.getElementById("id01").innerHTML += out;
	document.getElementById("id01").style.fontSize = "xx-large";
}

//Gets url to an image given a pokedex entry number
function getImage(number)
{
	//request the pokedex data for a particular pokedex entry number
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://pokeapi.co/api/v1/pokemon/" + number + "/", false);
	xhr.send();	
	
	//extract the url for the array of urls for a pokemon's sprites
	//select first entry in array and request for the sprite data
	var imguri = "http://pokeapi.co" + JSON.parse(xhr.response).sprites[0].resource_uri;
	xhr.open("GET", imguri, false);	
	xhr.send();
	
	//extract the url of the sprite image file
	img = "http://pokeapi.co" + JSON.parse(xhr.response).image
	return img;
}

//Pads a number with leading zero if less than 10
function pad(n) 
{
    return (n < 10) ? ("0" + n) : n;
}