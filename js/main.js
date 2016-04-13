// The most javascript of them all

//First line of main.js...wrap everything in a self-executing anonymous function to move to local scope
(function(){

    //pseudo-global variables
    var csvArray = ["varA", "varB", "varC", "varD", "varE"]; //list of attributes
    var expressed = csvArray[0]; //initial attribute

    //begin script when window loads
    window.onload = setMap();

    //set up choropleth map
    function setMap(){
        //map frame dimensions
        var width = 960,
            height = 460;

        //create new svg container for the map
        var map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);

    //create Albers equal area conic projection centered on France
    var projection = d3.geo.albers()
    .rotate([108, 0])
    .center([-3.64, 34.0])
    .parallels([29.5, 45.5])
    .scale(3000)
    .translate([width / 2, height / 2])
    .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    //use queue.js to parallelize asynchronous data loading
    d3_queue.queue()
        .defer(d3.csv, "data/Arizona_shp/PopAge2014.csv") //load attributes from csv
        .defer(d3.json, "data/Arizona_shp/AZcountydata.topojson") //load background spatial data
        .await(callback);

    function callback(error, csvData, arizona){
        //translate europe TopoJSON
        var arizonaCounties = topojson.feature(arizona, arizona.objects.AZcountydata).features;
        
        var counties = map.selectAll(".Polygon")
            .data(arizonaCounties)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "Polygon " + d.properties.COUNTY;
                })
            .attr("d", path);

        //examine the results
        console.log(arizonaCounties);   

        //loop through dummy array regions to label similar regions
        for (var a=0; a<csvArray.length; a++){
            //assign all attributes and values
            var val = parseFloat(csvData[attr]); //get csv attribute value
            csvArray[attr] = val; //assign attribute and value to geojson properties
        
        };
        
    };

    //function to create color scale generator
    function makeColorScale(data){
        var colorClasses = [
            "#f7de9c",
            "#e1bf61",
            "#b59334",
            "#7c5f10",
            "#56420c"
        ];

        //create color scale generator
        var colorScale = d3.scale.quantile()
            .range(colorClasses);

        //build array of all values of the expressed attribute
        var domainArray = [];
        for (var i=0; i<data.length; i++){
            var val = parseFloat(data[i][expressed]);
            domainArray.push(val);
        };

        //assign array of expressed values as scale domain
        colorScale.domain(domainArray);

        return colorScale;
        };  


    };

})(); //last line of main.js