// The most javascript of them all


//First line of main.js...wrap everything in a self-executing anonymous function to move to local scope
(function(){

    //pseudo-global variables
    var csvArray = [0,1,2,3]; //list of attributes
    var expressed = csvArray[0,1,2,3,4];


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
            .defer(d3.csv, "data/Arizona_shp/AZAge2014.csv") //load attributes from csv
            .defer(d3.json, "data/Arizona_shp/AZcountydata.topojson") //load background spatial data
            .await(callback);

        function callback(error, csvData, arizona){

            //translate europe TopoJSON
            var arizonaCounties = topojson.feature(arizona, arizona.objects.AZcountydata).features;
            
            function setEnumerationUnits(arizonaCounties, map, path, colorScale){

                var counties = map.selectAll(".COUNTY")
                    .data(arizonaCounties)
                    .enter()
                    .append("path")
                    .attr("class", function(d){
                        return "COUNTY " + d.properties.OBJECTID;
                    })
                    .attr("d", path)
                    .style("fill", function(d){
                        return colorScale(d.properties.COUNTY[expressed]);
                    });

            };

            //examine the results
            console.log(arizonaCounties);  

            console.log(csvData[0]);

            //build large array of all values for later
            for (var i=0; i<arizonaCounties.length; i++){
                csvArray[i] = csvData[i]; 
            };

            console.log(csvArray);

            //create the color scale
            var colorScale = makeColorScale(csvData);

            console.log(colorScale);

            setEnumerationUnits(arizonaCounties, map, path, colorScale);
        
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

            console.log(data.length);

            //build array of all values of the expressed attribute
            var domainArray = data;

            console.log(csvArray);

            for (var j=0; j<csvArray.length; j++) {

            }

            //assign array of expressed values as scale domain
            colorScale.domain(csvArray);

            console.log(colorScale);

            return colorScale;

        };  


    };

})(); //last line of main.js