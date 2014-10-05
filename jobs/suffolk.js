console.log("suffolk.js :-)")

// maps in d3
// http://bost.ocks.org/mike/map/
// for a quick fix http://leafletjs.com/ definetely worth a look
// ["http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js","http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css"]

openHealth.getScript(["//cdnjs.cloudflare.com/ajax/libs/d3/3.4.11/d3.min.js","https://www.google.com/jsapi","//square.github.io/crossfilter/crossfilter.v1.min.js","//dc-js.github.io/dc.js/js/dc.js","//dc-js.github.io/dc.js/css/dc.css"],function(){ // after satisfying d3 dependency
    // after dependencies satisfied
    (function(){
        var divJob=document.getElementById('openHealthJob');
        // get choropleth for Suffolk County
        console.log("loading map ...")
        // loading topojson for the whole country first
        
        openHealth.getJSON("jobs/zips_suffolk_HD_geo.json",function(zipMap){    
            
            divJob.innerHTML='<div id="suffolkChoropleth"></div>'
            openHealth.getJSON("https://health.data.ny.gov/resource/m2wt-pje4.json?county=Suffolk%20",function(dt){
                console.log("data loaded");
                var suffolkMap = dc.geoChoroplethChart("#suffolkChoropleth");
                var cf=crossfilter(dt);
                var zips = cf.dimension(function(d){return d.zip_code});
                var total_admits = zips.group().reduceSum(
                    function(d){return d.total_admits}
                )
                // find bounding box values
                var xy = openHealth.transpose(zipMap.features[0].geometry.coordinates[0]);
                var xyi=[];
                for(var i = 1;i<zipMap.features.length;i++){
                    if(zipMap.features[0].geometry){
                        xyi=openHealth.transpose(zipMap.features[1].geometry.coordinates[0]);
                        xy[0]=xy[0].concat(xyi[0]);
                        xy[1]=xy[1].concat(xyi[1]);
                    }
                }
                
                suffolkMap.width(990)
                    .height(500)
                    .dimension(zips)
                    .projection(d3.geo.albersUsa().scale(28000).translate([-8200,2400]))
                    .group(total_admits)
                    .overlayGeoJson(zipMap.features, "zips", function (d) {
                        return d.properties.ZCTA5CE10;
                    })
                dc.renderAll();    
            })  
        })
    })()
})



