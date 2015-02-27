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
		+ "<td>TYPE</td>"
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
		var name = dexJSON.name;
		var url = "http://bulbapedia.bulbagarden.net/wiki/"+name;
		
		//the array of types. may come in handy later, when we want to filter by type.
		var typeArray = dexJSON.types;
		//Many Poker Manz are dual-typed. First, let's handle the first type.
		var type1 = JSON.stringify(typeArray[0]); //type1 = what will eventually hold the type.
		type1 = type1.substring(9, type1.length-1);
		var lastChar = type1.indexOf('"');
		type1 = type1.substring(0,lastChar);
		
		//now on to type2.
		var type2 = JSON.stringify(typeArray[1]);
		
		if (type2!=undefined) {
			type2 = type2.substring(9, type2.length-1);
			lastChar=type2.indexOf('"');
			type2=type2.substring(0,lastChar)+"/";
		}
		
		//if it's undefined, set it equal to none.
		if (type2==undefined) {
			type2 = "";
		}
		
		var finalType = type2+type1;
		
		out += "<tr>"
			+ "<td width='150'>"+ "<a href='" + url +  "'target='_blank'</a><img src='" + getImage(dexJSON) +
			 "'/></td>"
			+ "<td>" + dexJSON.national_id + "</td>"
			+ "<td width='100'>" + name + "</td>"
			+ "<td>" + finalType+ "</td>"
			+ "<td>" + dexJSON.hp+ "</td>"
			+ "<td>" + dexJSON.attack+ "</td>"
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