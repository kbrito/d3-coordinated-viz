// The most javascript of them all

//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){
    //use queue.js to parallelize asynchronous data loading
    d3_queue.queue()
        .defer(d3.csv, "data/unitsData.csv") //load attributes from csv
        .defer(d3.json, "data/EuropeCountries.topojson") //load background spatial data
        .defer(d3.json, "data/FranceProvinces.topojson") //load choropleth spatial data
        .await(callback);
};