// The most javascript of them all

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
    .center([-3.64, 33.6])
    .parallels([29.5, 45.5])
    .scale(3000)
    .translate([width / 2, height / 2])
    .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    //use queue.js to parallelize asynchronous data loading
    d3_queue.queue()
        .defer(d3.csv, "data/Arizona_shp/2014PopAge.csv") //load attributes from csv
        .defer(d3.json, "data/Arizona_shp/AZcountydata.topojson") //load background spatial data
        .await(callback);

    function callback(error, csvData, arizona){
        //translate europe TopoJSON
        var arizonaCounties = topojson.feature(arizona, arizona.objects.AZcountydata).features;
        
        var counties = map.selectAll(".Polygon")
            .data(arizonaCounties)
            .enter()
            .append("path")
            .attr("class", "COUNTY")
            .attr("d", path);

        //examine the results
        console.log(arizonaCounties);
        
    
    };

};