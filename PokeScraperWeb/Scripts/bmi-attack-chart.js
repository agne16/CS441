var validNums = false;
var start = 1;
var end = 6;
var attacks = true;
var speeds = false;
var attackAndSpeed = false;
var invert=false;
var title = "Attack vs BMI";
var vertAxis="Attack";
var horizAxis = "BMI";
var searchType = "";
var types;
var searchingType = false;
google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

/**
 *function previous(id)
 *redraws the chart with the six previous Pokemon, in Dex order.
 *@param id - the ID of the html element that called this function.
 */
function previous(id)
{
    if (start-6>0) {
        start=start-6
        end = start+5;
        drawChart();
    }
}

/**
 *function next(id)
 *redraws the chart with the six next Pokemon in National Dex order.
 *@param id - the ID of the html element that called this function
 */
function next(id)
{
    if (end+6<649) {
        end=end+6;
        start=end-5;
        
        drawChart();
    }
}

/**
 *function searchByName
 *searches an array of the entire Pokedex for the name of the Pokemon entered in the input field
 *with ID "searchThisName".
 *@param id - the id of the html element that called it.
 */
function searchByName(id)
{
    var found = false;
    var name = document.getElementById("searchThisName").value.toLowerCase().replace(/[^a-zA-Z]/g, "");
    var i = 0;
    for(i=1;i<650;i++)
    {
        if (pkmnlist[i]==name)
        {
            start = i;
            end=i;
            found = true;
        }
    }
    if (!found)
    {
        //alert("Pokerman not found.");
    }
    drawChart();
}

/**
 *function displayCustomRange
 *Takes the text entered into the aptly named fields
 *and redraws the chart with those indexes.
 *@param id - the id of the html element that called this function.
 */
function displayCustomRange(id)
{
    var newStart = document.getElementById("startIdx").value;
    var newEnd = document.getElementById("endIdx").value;
    if (newStart>0 && newEnd<650)
    {
        start = parseInt(newStart);
        end = parseInt(newEnd);
        drawChart();
    }
    else
    {
        alert("Invalid inputs. Chart not redrawn. You dick.");
    }
}

/**
 *function switchAttribute
 *Toggles the axis between attack, speed, or both.
 *@param id - the id of the button that called this function.
 */
function switchAttribute(id)
{
    attacks=false;
    speeds=false;
    attackAndSpeed=false;
    if (id == "Attack")
    {
	attacks = true;
	vertAxis = "Attack";
    }
        if (id == "Speed")
    {
	speeds = true;
	vertAxis = "Speed";
    }
        if (id == "Both")
    {
	attackAndSpeed = true;
	vertAxis = "Attack and Speed";
    }
    drawChart();
}

/**
 *Inverts the X and Y Axis.
 *@param id - the id of the button that called this function.
 */
function invertAxis(id)
{
    invert = !invert;
    drawChart();
}

/**
*Lists only Pokemon of a user-specified type in the range given.
*@param id - the id of the element that called this function.
*/
function searchByType(id)
{
    var found = false;
    for(var i = 0;i<types.length;i++)
    {
        if(types[i]==id)
        {
            found = true;
            alert("found");
            break;
        }
    }
    if(found)
    {
        searchType = id;
        searchingType = true;
        drawChart();
    }
}

function clearType(id)
{
    searchType = id;
    searchingType = false;
    drawChart();
}

function drawChart()
{ 
    var data = new google.visualization.DataTable();

    data.addColumn('number', 'x');

    types = 
	[
        "Normal",
        "Fire",
        "Water",
        "Electric",
        "Grass",
        "Ice",
        "Fighting",
        "Poison",
        "Ground",
        "Flying",
        "Psychic",
        "Bug",
        "Rock",
        "Ghost",
        "Dragon",
        "Dark",
        "Steel",
        "Fairy",
    ];

    for (var i = 0; i < types.length; i++)
    {
        data.addColumn('number', types[i]);
        data.addColumn({type: 'string', role: 'tooltip', 'p': {'html': true}});
    }
    
    var vals = [];
    //if (start == end)
    //{
    //    end++;
    //}
    for(var i = start;i<=end;i++)
    {
        var dexJSON = getEntry(i);
        var height = dexJSON.height / 10;
        var weight = dexJSON.weight / 10;
        //var ratio = calcRatio(dexJSON.hp,dexJSON.attack,dexJSON.sp_atk,dexJSON.speed);
        var name = dexJSON.name;
	var att;
	if (attacks==true)
	{
	    att = dexJSON.attack;
	}
	
	if (speeds==true)
	{
	    att = dexJSON.speed;
	}
	
	if (attackAndSpeed==true)
	{
	    att = dexJSON.attack;
	    att+= dexJSON.speed;
	}

        var bmi = calcBMI(height, weight);
        var typeArray = dexJSON.types;
        
        //Protip: Theres a fuction to get types
        //Many Poker Manz are dual-typed. First, let's handle the first type.
        var type1 = getType1(dexJSON);
        var colorType = type1;
        
        //now on to type2.
        var type2 = getType2(dexJSON);
        var toAdd = false;
        if (!searchingType)
        {
            toAdd = true;
        }
        var check = searchingType && (searchType == type1);
        var check2 = type2 != null && searchType == type2;
        var finalCheck = check||check2;
        if (finalCheck)
        {
            toAdd = true;
        }
        if (type2!="")
        {
            colorType=type2;
            type2=type2.substring(0,lastChar)+"/";
        }

        var finalType = type2+type1;
        var image = '<img src="'+ getImage(dexJSON)+'"/>';
        var htmlContent2 = '<table>'+
            '<tr>'+
            '<td>'+image+'</td>'+
            '<td><table style="width:100%">'+
            '<tr>'+
            '<td>'+ name +'</td>' +
            '</tr>'+
            '<tr>'+
            '<td>'+vertAxis+': ' + att+'</td>'+
            '</tr>'+
            '<tr>'+
            '<td>'+horizAxis+': '+bmi+'</td>'+
            '<tr>'+
            '<td>Type(s) '+finalType+
            '</tr>'+
            '</table>' +
            '</td>'+
            '</tr>' +
            '</table>'
        /**
        *This mess is how you add data points to the chart. Each data point has three paramters: 
        *bmi, att, and tooltip (aka htmlContent2). bmi always goes in the first index. htmlContent2 always goes
        *right after att. Where att goes depends on the Pokemon's type.
        */

        //initialize an array of null
        var column = [];//not sure if the right var name. seems right
        var attPos = -1;
        for(var j=0; j < 37; j++)
        {
            column[j] = null;
        }

        //figure out index that attack will be stored in array
        if (colorType=="Normal")
        {
            attPos = 1;
        }
        else if (colorType=="Fire")
        {
            attPos = 3;
        }
        else if (colorType=="Water")
        {
            attPos = 5;
        }
        else if (colorType=="Electric")
        {
            attPos = 7;
        }
        else if (colorType=="Grass")
        {
            attPos = 9;
        }
        else if (colorType=="Ice")
        {
            attPos = 11;
        }
        else if (colorType=="Fighting")
        {
            attPos = 13;
        }
        else if (colorType=="Poison")
        {
            attPos = 15;
        }
        else if (colorType=="Ground")
        {
            attPos = 17;
        }
        else if (colorType=="Flying")
        {
            attPos = 19;
        }
        else if (colorType=="Psychic")
        {
            attPos = 21;
        }
        else if (colorType=="Bug")
        {
            attPos = 23;
        }
        else if (colorType=="Rock")
        {
            attPos = 25;
        }
        else if (colorType=="Ghost")
        {
            attPos = 27;
        }
        else if (colorType=="Dragon")
        {
            attPos = 29;
        }
        else if (colorType=="Dark")
        {
            attPos = 31;
        }
        else if (colorType=="Steel")
        {
            attPos = 33;
        }
        else if (colorType=="Fairy")
        {
            attPos = 35;
        }

        //if a type was found
        if(attPos != -1)
        {
            //fill in column and add it to table
	    if (invert)
	    {
		column[0]=att;
		column[attPos]=bmi;
	    }
	    else
	    {
            column[0] = bmi;
            column[attPos] = att;
	    }
	    column[attPos + 1] = htmlContent2;
	    if (toAdd) {
	        vals.push(column);
	    }
        }

    }//end of gathering all pokedex entries
    data.addRows(vals);
    var horizTitle = horizAxis;
    var vTitle=vertAxis;
    if (invert)
    {
	horizTitle=vertAxis;
	vTitle = horizAxis;
    }
    title = vTitle + " vs " + horizTitle;
    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
    var options =
        {
            fontName: "Pokemon GB",
            title: title,
            vAxis:
            {
                title: vTitle,
                viewWindow:
                {
                    min: 0
                }

            },
            hAxis:
            {
                title: horizTitle,
                viewWindow:
                {
                    min: 0
                }
            },

            series:
            {                
                0  : { color: '#A8A77A'}, //Normal    
                1  : { color: '#EE8130'}, //Fire      
                2  : { color: '#6390F0'}, //Water     
                3  : { color: '#F7D02C'}, //Electric   
                4  : { color: '#7AC74C'}, //Grass     
                5  : { color: '#96D9D6'}, //Ice       
                6  : { color: '#C22E28'}, //Fighting   
                7  : { color: '#A33EA1'}, //Poison    
                8  : { color: '#E2BF65'}, //Ground    
                9  : { color: '#A98FF3'}, //Flying    
                10 : { color: '#F95587'}, //Psychic   
                11 : { color: '#A6B91A'}, //Bug       
                12 : { color: '#B6A136'}, //Rock      
                13 : { color: '#735797'}, //Ghost     
                14 : { color: '#6F35FC'}, //Dragon    
                15 : { color: '#705746'}, //Dark      
                16 : { color: '#B7B7CE'}, //Steel     
                17 : { color: '#D685AD'}, //Fairy     
            },

            tooltip:
            {
                isHtml: true
            },

            pointSize:20
        }//options

    chart.draw(data, options);
    document.getElementById('startIdx').value = ''+start;
    document.getElementById('endIdx').value = ''+end;
    //{width: 400, height: 240, titleX: 'Attack', titleY: 'BMI', legend: 'none', pointSize: 5}
}//drawChart