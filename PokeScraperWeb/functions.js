/**
This script contains functions that are related to extracting
various items from the Pokemon API

Note that by binding getEntry to a variable, you can access many attributes

Ex: var dexJSON = getEntry(50) //Diglett's Entry
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
    //if some function wants to get the 0th pokemon entry
	if (dexNumber == 0)
	{
		return undefined;//NOPE
	}
	
	//check if the data is in session storage first
    if(sessionStorage.getItem(dexNumber))
    {
        return JSON.parse(sessionStorage.getItem(dexNumber));
    }
    
    //create new http request
    var xhr = new XMLHttpRequest();
    var url = null;
    var entry = null;
    
    //create url to query server and get response
    url = "http://pokeapi.co/api/v1/pokemon/" + dexNumber + "/";
    xhr.open("GET", url, false);
    xhr.send();
    
	//store the pokemon data and return it
    entry = JSON.parse(xhr.response.valueOf());
    sessionStorage.setItem(dexNumber, JSON.stringify(entry));
    return entry;
}

//Returns url to an image given a JSON formatted Pokedex Entry
function getImage(dexJSON)
{
	//if you want to get the image to a non-existant entry
	if (dexJSON == undefined)
	{
		return "Images/Pokeball.png"
	}
	
	//see if the url image is in sessionstorage
	var key = dexJSON.national_id + "_image";
	if(sessionStorage.getItem(key))
    {
        return sessionStorage.getItem(key);
    }
	
    //request the pokedex data for a particular pokedex entry number
    var xhr = new XMLHttpRequest();
    
    //extract the url for the array of urls for a pokemon's sprites
    //select first entry in array and request for the sprite data
    var imguri = "http://pokeapi.co" + dexJSON.sprites[0].resource_uri;
    xhr.open("GET", imguri, false);	
    xhr.send();
    
    //store the url of the image and return it
    var image = "http://pokeapi.co" + JSON.parse(xhr.response).image;
	sessionStorage.setItem(key, image);
    return image;
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

function calcRatio(hp, at, sat, spd)
{
    return Math.round((hp+at+sat)/spd)/10;
}

//Return a calculated BMI given height and weight (meters, kilograms)
function calcBMI(height, weight)
{
    return Math.round((weight)/(height * height) * 10) / 10;
}

//Given a string, return the string	with first letter capitalized
function capitalizeFirstLetter(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getType1(dexJSON)
{
    //the array of types. may come in handy later, when we want to filter by type.
    var typeArray = dexJSON.types;
    
    //Many Poker Manz are dual-typed. First, let's handle the first type.
    var type1 = JSON.stringify(typeArray[0]); //type1 = what will eventually hold the type.
    type1 = type1.substring(9, type1.length-1);
    var lastChar = type1.indexOf('"');
    type1 = type1.substring(0,lastChar);
    
    return capitalizeFirstLetter(type1);
    
}

function getType2(dexJSON)
{
    var typeArray = dexJSON.types;
    
    var type2 = JSON.stringify(typeArray[1]);
    
    if (type2!=undefined) 
    {
        type2 = type2.substring(9, type2.length-1);
        lastChar=type2.indexOf('"');
        type2=type2.substring(0,lastChar);		
        return capitalizeFirstLetter(type2);
    }
    return "";
}

function isInArray(number)
{
    if(downloadPokemon[number] === undefined)
    {
        return true;
    }
    return false;
}