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
		return "../Images/Pokeball.png"
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

    //preload the image
    var img = new Image();
    img.src = image;
    addLoadEvent(img);

    return image;
}

//Returns the description of a Pokemon given a JSON and a generation (int)
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

//Calculate combat value of a Pokemon
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

//Extract the first type of the Pokemon given its raw data
//This is the primary type if it's a single type
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

//Extract the second type of the Pokemon given its raw data
//This is the primary type if it exists
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

//preload an image given an image source
function addLoadEvent(func)
{
	var oldonload = window.onload;
	if (typeof window.onload != 'function')
    {
		window.onload = func;
	}
    else
    {
		window.onload = function()
        {
			if (oldonload)
            {
				oldonload();
			}
			func();
		}
	}
}

//An array of all pokemon in dex order
//All lowercase, spaces and special characters stripped
var pkmnlist =
[
	"NONE", "bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard", "squirtle", "wartortle", "blastoise", "caterpie",
	"metapod", "butterfree", "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot", "rattata", "raticate",
	"spearow", "fearow", "ekans", "arbok", "pikachu", "raichu", "sandshrew", "sandslash", "nidoranfemale", "nidorina",
	"nidoqueen", "nidoranmale", "nidorino", "nidoking", "clefairy", "clefable", "vulpix", "ninetales", "jigglypuff", "wigglytuff",
	"zubat", "golbat", "oddish", "gloom", "vileplume", "paras", "parasect", "venonat", "venomoth", "diglett",
	"dugtrio", "meowth", "persian", "psyduck", "golduck", "mankey", "primeape", "growlithe", "arcanine", "poliwag",
	"poliwhirl", "poliwrath", "abra", "kadabra", "alakazam", "machop", "machoke", "machamp", "bellsprout", "weepinbell",
	"victreebel", "tentacool", "tentacruel", "geodude", "graveler", "golem", "ponyta", "rapidash", "slowpoke", "slowbro",
	"magnemite", "magneton", "farfetchd", "doduo", "dodrio", "seel", "dewgong", "grimer", "muk", "shellder",
	"cloyster", "gastly", "haunter", "gengar", "onix", "drowzee", "hypno", "krabby", "kingler", "voltorb",
	"electrode", "exeggcute", "exeggutor", "cubone", "marowak", "hitmonlee", "hitmonchan", "lickitung", "koffing", "weezing",
	"rhyhorn", "rhydon", "chansey", "tangela", "kangaskhan", "horsea", "seadra", "goldeen", "seaking", "staryu",
	"starmie", "mrmime", "scyther", "jynx", "electabuzz", "magmar", "pinsir", "tauros", "magikarp", "gyarados",
	"lapras", "ditto", "eevee", "vaporeon", "jolteon", "flareon", "porygon", "omanyte", "omastar", "kabuto",
	"kabutops", "aerodactyl", "snorlax", "articuno", "zapdos", "moltres", "dratini", "dragonair", "dragonite", "mewtwo",
	"mew", "chikorita", "bayleef", "meganium", "cyndaquil", "quilava", "typhlosion", "totodile", "croconaw", "feraligatr",
	"sentret", "furret", "hoothoot", "noctowl", "ledyba", "ledian", "spinarak", "ariados", "crobat", "chinchou",
	"lanturn", "pichu", "cleffa", "igglybuff", "togepi", "togetic", "natu", "xatu", "mareep", "flaaffy",
	"ampharos", "bellossom", "marill", "azumarill", "sudowoodo", "politoed", "hoppip", "skiploom", "jumpluff", "aipom",
	"sunkern", "sunflora", "yanma", "wooper", "quagsire", "espeon", "umbreon", "murkrow", "slowking", "misdreavus",
	"unown", "wobbuffet", "girafarig", "pineco", "forretress", "dunsparce", "gligar", "steelix", "snubbull", "granbull",
	"qwilfish", "scizor", "shuckle", "heracross", "sneasel", "teddiursa", "ursaring", "slugma", "magcargo", "swinub",
	"piloswine", "corsola", "remoraid", "octillery", "delibird", "mantine", "skarmory", "houndour", "houndoom", "kingdra",
	"phanpy", "donphan", "porygon2", "stantler", "smeargle", "tyrogue", "hitmontop", "smoochum", "elekid", "magby",
	"miltank", "blissey", "raikou", "entei", "suicune", "larvitar", "pupitar", "tyranitar", "lugia", "hooh",
	"celebi", "treecko", "grovyle", "sceptile", "torchic", "combusken", "blaziken", "mudkip", "marshtomp", "swampert",
	"poochyena", "mightyena", "zigzagoon", "linoone", "wurmple", "silcoon", "beautifly", "cascoon", "dustox", "lotad",
	"lombre", "ludicolo", "seedot", "nuzleaf", "shiftry", "taillow", "swellow", "wingull", "pelipper", "ralts",
	"kirlia", "gardevoir", "surskit", "masquerain", "shroomish", "breloom", "slakoth", "vigoroth", "slaking", "nincada",
	"ninjask", "shedinja", "whismur", "loudred", "exploud", "makuhita", "hariyama", "azurill", "nosepass", "skitty",
	"delcatty", "sableye", "mawile", "aron", "lairon", "aggron", "meditite", "medicham", "electrike", "manectric",
	"plusle", "minun", "volbeat", "illumise", "roselia", "gulpin", "swalot", "carvanha", "sharpedo", "wailmer",
	"wailord", "numel", "camerupt", "torkoal", "spoink", "grumpig", "spinda", "trapinch", "vibrava", "flygon",
	"cacnea", "cacturne", "swablu", "altaria", "zangoose", "seviper", "lunatone", "solrock", "barboach", "whiscash",
	"corphish", "crawdaunt", "baltoy", "claydol", "lileep", "cradily", "anorith", "armaldo", "feebas", "milotic",
	"castform", "kecleon", "shuppet", "banette", "duskull", "dusclops", "tropius", "chimecho", "absol", "wynaut",
	"snorunt", "glalie", "spheal", "sealeo", "walrein", "clamperl", "huntail", "gorebyss", "relicanth", "luvdisc",
	"bagon", "shelgon", "salamence", "beldum", "metang", "metagross", "regirock", "regice", "registeel", "latias",
	"latios", "kyogre", "groudon", "rayquaza", "jirachi", "deoxys", "turtwig", "grotle", "torterra", "chimchar",
	"monferno", "infernape", "piplup", "prinplup", "empoleon", "starly", "staravia", "staraptor", "bidoof", "bibarel",
	"kricketot", "kricketune", "shinx", "luxio", "luxray", "budew", "roserade", "cranidos", "rampardos", "shieldon",
	"bastiodon", "burmy", "wormadam", "mothim", "combee", "vespiquen", "pachirisu", "buizel", "floatzel", "cherubi",
	"cherrim", "shellos", "gastrodon", "ambipom", "drifloon", "drifblim", "buneary", "lopunny", "mismagius", "honchkrow",
	"glameow", "purugly", "chingling", "stunky", "skuntank", "bronzor", "bronzong", "bonsly", "mimejr", "happiny",
	"chatot", "spiritomb", "gible", "gabite", "garchomp", "munchlax", "riolu", "lucario", "hippopotas", "hippowdon",
	"skorupi", "drapion", "croagunk", "toxicroak", "carnivine", "finneon", "lumineon", "mantyke", "snover", "abomasnow",
	"weavile", "magnezone", "lickilicky", "rhyperior", "tangrowth", "electivire", "magmortar", "togekiss", "yanmega", "leafeon",
	"glaceon", "gliscor", "mamoswine", "porygonz", "gallade", "probopass", "dusknoir", "froslass", "rotom", "uxie",
	"mesprit", "azelf", "dialga", "palkia", "heatran", "regigigas", "giratina", "cresselia", "phione", "manaphy",
	"darkrai", "shaymin", "arceus", "victini", "snivy", "servine", "serperior", "tepig", "pignite", "emboar",
	"oshawott", "dewott", "samurott", "patrat", "watchog", "lillipup", "herdier", "stoutland", "purrloin", "liepard",
	"pansage", "simisage", "pansear", "simisear", "panpour", "simipour", "munna", "musharna", "pidove", "tranquill",
	"unfezant", "blitzle", "zebstrika", "roggenrola", "boldore", "gigalith", "woobat", "swoobat", "drilbur", "excadrill",
	"audino", "timburr", "gurdurr", "conkeldurr", "tympole", "palpitoad", "seismitoad", "throh", "sawk", "sewaddle",
	"swadloon", "leavanny", "venipede", "whirlipede", "scolipede", "cottonee", "whimsicott", "petilil", "lilligant", "basculin",
	"sandile", "krokorok", "krookodile", "darumaka", "darmanitan", "maractus", "dwebble", "crustle", "scraggy", "scrafty",
	"sigilyph", "yamask", "cofagrigus", "tirtouga", "carracosta", "archen", "archeops", "trubbish", "garbodor", "zorua",
	"zoroark", "minccino", "cinccino", "gothita", "gothorita", "gothitelle", "solosis", "duosion", "reuniclus", "ducklett",
	"swanna", "vanillite", "vanillish", "vanilluxe", "deerling", "sawsbuck", "emolga", "karrablast", "escavalier", "foongus",
	"amoonguss", "frillish", "jellicent", "alomomola", "joltik", "galvantula", "ferroseed", "ferrothorn", "klink", "klang",
	"klinklang", "tynamo", "eelektrik", "eelektross", "elgyem", "beheeyem", "litwick", "lampent", "chandelure", "axew",
	"fraxure", "haxorus", "cubchoo", "beartic", "cryogonal", "shelmet", "accelgor", "stunfisk", "mienfoo", "mienshao",
	"druddigon", "golett", "golurk", "pawniard", "bisharp", "bouffalant", "rufflet", "braviary", "vullaby", "mandibuzz",
	"heatmor", "durant", "deino", "zweilous", "hydreigon", "larvesta", "volcarona", "cobalion", "terrakion", "virizion",
	"tornadus", "thundurus", "reshiram", "zekrom", "landorus", "kyurem", "keldeo", "meloetta", "genesect", "chespin",
	"quilladin", "chesnaught", "fennekin", "braixen", "delphox", "froakie", "frogadier", "greninja", "bunnelby", "diggersby",
	"fletchling", "fletchinder", "talonflame", "scatterbug", "spewpa", "vivillon", "litleo", "pyroar", "flabebe", "floette",
	"florges", "skiddo", "gogoat", "pancham", "pangoro", "furfrou", "espurr", "meowstic", "honedge", "doublade",
	"aegislash", "spritzee", "aromatisse", "swirlix", "slurpuff", "inkay", "malamar", "binacle", "barbaracle", "skrelp",
	"dragalge", "clauncher", "clawitzer", "helioptile", "heliolisk", "tyrunt", "tyrantrum", "amaura", "aurorus", "sylveon",
	"hawlucha", "dedenne", "carbink", "goomy", "sliggoo", "goodra", "klefki", "phantump", "trevenant", "pumpkaboo",
	"gourgeist", "bergmite", "avalugg", "noibat", "noivern", "xerneas", "yveltal", "zygarde", "diancie", "hoopa",
	"volcanion",
];