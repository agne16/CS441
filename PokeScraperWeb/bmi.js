/**
This script iterates over a range of pokemon to get the following:
Image
ID
NAME
Description
HEIGHT
Weight

BMI is calculated and the data is used to create an HTML table

Dependencies:
	functions.js
*/

//buildTable is the entry point of script, just supply a start and end ID

////////////////////////////////////////////////////////////////////
//////////////////////////FUNCTIONS/////////////////////////////////
////////////////////////////////////////////////////////////////////

function buildTable(start, end, gen)
{
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
		
	//iterate over a range of pokedex entries
	for(var i = start; i <= end; ++i)
	{
		var dexJSON = getEntry(i);
		var height = dexJSON.height / 10;
		var weight = dexJSON.weight / 10;
		
		out += "<tr>"
			+ "<td width='150'><img src='" + getImage(dexJSON) + "'></td>"
			+ "<td>" + dexJSON.national_id + "</td>"
			+ "<td width='100'>" + dexJSON.name + "</td>"
			+ "<td width='250'>" + getDesc(dexJSON, gen) + "</td>"
			+ "<td>" + height + " m</td>"
			+ "<td>" + weight + " kg</td>"
			+ "<td>" + calcBMI(height,weight) + "</td>"
			+ "<td>" + interpretBMI(calcBMI(height,weight)) + "</td>"
			+ "</tr>";
	}
	
	out += "</table>";
	document.getElementById("id01").innerHTML += out
}

//Return a calculated BMI given height and weight (meters, kilograms)
function calcBMI(height, weight)
{
	return Math.round((weight)/(height * height) * 10) / 10;
}

//Returns an English interpretation given a BMI
function interpretBMI(bmi){
	if (bmi < 18.5)
	{
		return "Underweight";
	}
	else if (bmi >= 18.5 && bmi <= 24.9)
	{
		return "Normal Weight";
	}
	else if (bmi >= 25 && bmi <= 29.9)
	{
		return "Overweight";
	}
	else if (bmi >= 30 && bmi <= 34.9)
	{
		return "Obese";
	}
	else if (bmi >= 35 && bmi <= 39.9)
	{
		return "Severe Obesity";
	}
	else if (bmi >= 40 && bmi <= 44.9)
	{
		return "Morbid Obesity";
	}
	else if (bmi >= 45)
	{
		return "Super Obesity";
	}
	else 
	{
		return "I am error";
	}
}

