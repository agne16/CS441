var validNums = false;
var start = 1;
var end = 7;
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
        end = start+6;
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
        start=end-6;
        
        drawChart();
    }
}

/**
 *function searchByName
 *searches the ENTIRE Pokedex for the name of the Pokemon entered in the input field
 *with ID "searchThisName". Currently too slow.
 *@param id - the id of the html element that called it.
 */
function searchByName(id)
{
    var found = false;
    var name = document.getElementById("searchThisName").value;
    var i = 0;
    for(i=1;i<650;i++)
    {
        var dex = getEntry(i);
        if (dex.name==name)
        {
            start = i;
            end=i;
            found = true;
            drawChart();
            alert("found");
            break;
        }
    }
    if (!found)
    {
        alert("Pokerman not found.");
    }
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
function drawChart()
{ 
    var data = new google.visualization.DataTable();

    data.addColumn('number', 'x');

    var types = 
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
    for(var i = start;i<end;i++)
    {
        var dexJSON = getEntry(i);
        var height = dexJSON.height / 10;
        var weight = dexJSON.weight / 10;
        //var ratio = calcRatio(dexJSON.hp,dexJSON.speed,dexJSON.sp_atk,dexJSON.speed);
        var name = dexJSON.name;
        var spd = dexJSON.speed;
        var bmi = calcBMI(height, weight);
        var typeArray = dexJSON.types;
        
        //Protip: Theres a fuction to get types
        //Many Poker Manz are dual-typed. First, let's handle the first type.
        var type1 = getType1(dexJSON);
        var colorType = type1;
        
        //now on to type2.
        var type2 = getType2(dexJSON);	
        if (type2!="")
        {
            colorType=type2;
            type2=type2.substring(0,lastChar)+"/";
        }

        var finalType = type2+type1;
        var image = '<img src="'+ getImage(dexJSON)+'"/>';
        var htmlContent2 = '<table style="width:100%">'+
            '<tr>'+
            '<td>'+image+'</td>'+
            '<td><table style="width:100%">'+
            '<tr>'+
            '<td>'+ name +'</td>' +
            '</tr>'+
            '<tr>'+
            '<td>Speed: ' + spd+'</td>'+
            '</tr>'+
            '<tr>'+
            '<td>BMI: '+bmi+'</td>'+
            '<tr>'+
            '<td>Type(s) '+finalType+
            '</tr>'+
            '</table>' +
            '</td>'+
            '</tr>' +
            '</table>'
        /**
        *This mess is how you add data points to the chart. Each data point has three paramters: 
        *bmi, spd, and tooltip (aka htmlContent2). bmi always goes in the first index. htmlContent2 always goes
        *right after spd. Where spd goes depends on the Pokemon's type.
        */

        //initialize an array of null
        var column = [];//not sure if the right var name. seems right
        var spdPos = -1;
        for(var j=0; j < 37; j++)
        {
            column[j] = null;
        }

        //figure out index that speed will be stored in array
        if (colorType=="Normal")
        {
            spdPos = 1;
        }
        else if (colorType=="Fire")
        {
            spdPos = 3;
        }
        else if (colorType=="Water")
        {
            spdPos = 5;
        }
        else if (colorType=="Electric")
        {
            spdPos = 7;
        }
        else if (colorType=="Grass")
        {
            spdPos = 9;
        }
        else if (colorType=="Ice")
        {
            spdPos = 11;
        }
        else if (colorType=="Fighting")
        {
            spdPos = 13;
        }
        else if (colorType=="Poison")
        {
            spdPos = 15;
        }
        else if (colorType=="Ground")
        {
            spdPos = 17;
        }
        else if (colorType=="Flying")
        {
            spdPos = 19;
        }
        else if (colorType=="Psychic")
        {
            spdPos = 21;
        }
        else if (colorType=="Bug")
        {
            spdPos = 23;
        }
        else if (colorType=="Rock")
        {
            spdPos = 25;
        }
        else if (colorType=="Ghost")
        {
            spdPos = 27;
        }
        else if (colorType=="Dragon")
        {
            spdPos = 29;
        }
        else if (colorType=="Dark")
        {
            spdPos = 31;
        }
        else if (colorType=="Steel")
        {
            spdPos = 33;
        }
        else if (colorType=="Fairy")
        {
            spdPos = 35;
        }

        //if a type was found
        if(spdPos != -1)
        {
            //fill in column and add it to table
            column[0] = bmi;
            column[spdPos] = spd;
            column[spdPos + 1] = htmlContent2;
            vals.push(column);
        }

    }//end of gathering all pokedex entries
    
    data.addRows(vals);
    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
    var options =
        {
            title: "Speed vs BMI",
            vAxis:
            {
                title: "Speed",
                viewWindow:
                {
                    min: 0
                }

            },
            hAxis:
            {
                title: 'BMI',
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
    //{width: 400, height: 240, titleX: 'Speed', titleY: 'BMI', legend: 'none', pointSize: 5}
}//drawChart