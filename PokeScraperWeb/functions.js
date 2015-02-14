/**
This script contains functions that are related to extracting
various items from the Pokemon API

Note that by binding getEntry to a variable, you can access many attributes

Ex: 	var dexJSON = getEntry(50) //Diglett's Entry
		var attack = dexJSON.attack;
		var weight = dexJSON.weight;

Be mindful of what units measurements come in.
For example, the API gives weight in hectograms or some other weird junk.

So  weight/10 gives you kilograms
and height/10 gives you meters
**/

//Returns the JSON Formatted Pokedex Data given a Dex Number
function getEntry(dexNumber)
{
	//create new http request
	var xhr = new XMLHttpRequest();
	var url = null;
	var dexJSON = null;
	
	//create url to query server and get response
	url = "http://pokeapi.co/api/v1/pokemon/" + dexNumber + "/";
	xhr.open("GET", url, false);
	xhr.send();
	
	//return the parsed response (JSON format)
	return JSON.parse(xhr.response.valueOf());
}

//Returns url to an image given a JSON formatted Pokedex Entry
function getImage(dexJSON)
{
	//request the pokedex data for a particular pokedex entry number
	var xhr = new XMLHttpRequest();
	
	//extract the url for the array of urls for a pokemon's sprites
	//select first entry in array and request for the sprite data
	var imguri = "http://pokeapi.co" + dexJSON.sprites[0].resource_uri;
	xhr.open("GET", imguri, false);	
	xhr.send();
	
	//return the url of the image
	return "http://pokeapi.co" + JSON.parse(xhr.response).image;
}

//returns the description of a Pokemon given a JSON and a generation (int)
function getDesc(dexJSON, gen)
{
	var xhr = new XMLHttpRequest();
	
	//default description will be a generation 1 description
	var dexurl = "http://pokeapi.co" + dexJSON.descriptions[0].resource_uri
	
	// extract the description of a particular generation
	//
	// the JSON has an array of description objects that contains:
	// 1) name of the object (pokemonName_gen_1, pokemonName_gen_3...) and
	// 2) url to the actual text description
	dexJSON.descriptions.forEach(function(entry)
	{
		//if the substring is found in the description name
		if (entry.name.indexOf("gen_" + gen) != -1)
		{			
			dexurl = "http://pokeapi.co" + entry.resource_uri
		}	
	});
	
	//send request
	xhr.open("GET", dexurl, false);
	xhr.send();
	
	//return
	return JSON.parse(xhr.response).description
}