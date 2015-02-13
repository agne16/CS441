//initialize first row of table
var out = "<table style='width:100%'>";
out += "<tr>"
	+ "<td>SPRITE</td>"
	+ "<td>ID</td>"
	+ "<td>NAME</td>"
	+ "<td>DESC</td>"
	+ "<td>HEIGHT</td>"
	+ "<td>WEIGHT</td>"
	+ "<td>BMI</td>"
	+ "<td>STATUS</td>"
	+ "</tr>";

//iterates over a range of pokedex entries
for(var i = 1; i <= 10; ++i){
	//get pokedex entry given the entry number
	var xhr = new XMLHttpRequest();
	var url = null;
	var dexJSON = null;
	url = "http://pokeapi.co/api/v1/pokemon/" + i + "/";
	xhr.open("GET", url, false);
	xhr.send();
	dexJSON = xhr.response.valueOf();
	
	//extract the url to the arrays of descriptions and sprites
	var dexurl = "http://pokeapi.co" + JSON.parse(dexJSON).descriptions[0].resource_uri
	var imguri = "http://pokeapi.co" + JSON.parse(dexJSON).sprites[0].resource_uri;
	
	//extract the pokedex entry description
	xhr.open("GET", dexurl, false);
	xhr.send();
	var dexEntry = JSON.parse(xhr.response).description
	
	//extract the url to the sprite image
	xhr.open("GET", imguri, false);
	xhr.send()
	var img = "http://pokeapi.co" + JSON.parse(xhr.response).image
	
	//request the server for the pokedex data
	url = "http://pokeapi.co/api/v1/pokemon/" + i + "/";
	xhr.open("GET", url, false);
	xhr.send();
	dexJSON = JSON.parse(xhr.response);
	
	//do various conversions/calulations
	var height = dexJSON.height / 10;
	var weight = dexJSON.weight / 10;
	var bmi = calcBMI(height, weight);
	
	//generate xml code for a row in table
	out += "<tr>"
		+ "<td width='150'><img src='" + img + "'></td>"
		+ "<td>" + dexJSON.national_id + "</td>"
		+ "<td width='100'>" + dexJSON.name + "</td>"
		+ "<td width='250'>" + dexEntry + "</td>"
		+ "<td>" + height + " m</td>"
		+ "<td>" + weight + " kg</td>"
		+ "<td>" + bmi + "</td>"
		+ "<td>" + interpretBMI(bmi) + "</td>"
		+ "</tr>";
}//end forloop

//end the xml code and output to div in html
out += "</table>";
document.getElementById("id01").innerHTML += out;

//////////////////////////////////////////////
////////////////Functions/////////////////////
//////////////////////////////////////////////

//Calculate BMI
function calcBMI(height, weight){
	return Math.round((weight)/(height * height) * 10) / 10;
}

//Returns an English interpretation given a BMI
function interpretBMI(bmi){
	if (bmi < 18.5){return "Underweight";}
	else if (bmi >= 18.5 && bmi <= 24.9){return "Normal Weight";}
	else if (bmi >= 25 && bmi <= 29.9){return "Overweight";}
	else if (bmi >= 30 && bmi <= 34.9){return "Obese";}
	else if (bmi >= 35 && bmi <= 39.9){return "Severe Obesity";}
	else if (bmi >= 40 && bmi <= 44.9){return "Morbid Obesity";}
	else if (bmi >= 45){return "Super Obesity";}
	else {return "I am error";}
}