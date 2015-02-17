/**
This script iterates over a range of pokemon to get the following:
Image
ID
NAME
STATS

BMI is calculated and the data is used to create an HTML table

Dependencies:
	functions.js
*/

//buildTable is the entry point of script, just supply a start and end ID

////////////////////////////////////////////////////////////////////
//////////////////////////FUNCTIONS/////////////////////////////////
////////////////////////////////////////////////////////////////////
function buildTable(start, end)
{
	//initialize first row of table
	var out = "<table style='width:100%'>";
	out += "<tr>"
		+ "<td>SPRITE</td>"
		+ "<td>ID</td>"
		+ "<td>NAME</td>"
		+ "<td>HP</td>"
		+ "<td>ATTACK</td>"
		+ "<td>DEFENSE</td>"
		+ "<td>SPEC-ATK</td>"
		+ "<td>SPEC-DEF</td>"
		+ "<td>SPEED</td>"
		+ "<td>COMBAT VALUE</td>"
		+ "<td>BMI</td>"
		+ "</tr>";
		
	//iterate over a range of pokedex entries
	for(var i = start; i <= end; ++i)
	{
		var dexJSON = getEntry(i);
		var height = dexJSON.height / 10;
		var weight = dexJSON.weight / 10;
		var ratio = calcRatio(dexJSON.hp,dexJSON.attack,dexJSON.sp_atk,dexJSON.speed);
		
		out += "<tr>"
			+ "<td width='150'><img src='" + getImage(dexJSON) + "'></td>"
			+ "<td>" + dexJSON.national_id + "</td>"
			+ "<td width='100'>" + dexJSON.name + "</td>"
			+ "<td>" + dexJSON.hp + "</td>"
			+ "<td>" + dexJSON.attack + "</td>"
			+ "<td>" + dexJSON.defense + "</td>"
			+ "<td>" + dexJSON.sp_atk + "</td>"
			+ "<td>" + dexJSON.sp_def + "</td>"
			+ "<td>" + dexJSON.speed + "</td>"
			+ "<td>" + ratio + "</td>"
			+ "<td>" + calcBMI(height,weight) + "</td>"
			+ "</tr>";
	}
	
	out += "</table>";
	document.getElementById("id01").innerHTML += out
}

function calcRatio(hp,at,sat,spd)
{
	return Math.round((hp+at+sat)/spd)/10;
}

//Return a calculated BMI given height and weight (meters, kilograms)
function calcBMI(height, weight)
{
	return Math.round((weight)/(height * height) * 10) / 10;
}