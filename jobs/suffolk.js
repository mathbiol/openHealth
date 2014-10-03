console.log("suffolk.js :-)")

// maps in d3
// http://bost.ocks.org/mike/map/


openHealth.getScript(["//cdnjs.cloudflare.com/ajax/libs/d3/3.4.11/d3.min.js","https://www.google.com/jsapi","//square.github.io/crossfilter/crossfilter.v1.min.js","//dc-js.github.io/dc.js/js/dc.js","//dc-js.github.io/dc.js/css/dc.css","http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js","http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css"],function(){ // after satisfying d3 dependency
    // after dependencies satisfied
    (function(){
        var divJob=document.getElementById('openHealthJob');
        // get choropleth for Suffolk County
        console.log("loading map ...")
        // loading topojson for the whole country first
        
        openHealth.getJSON("jobs/zips_suffolk_geo.json",function(zipMap){    
            /*var zipMap=x;
            console.log("... done");
            // extracting zip codes for Suffolk county
            //suffolkMap=JSON.parse(JSON.stringify(usMap)); // clone country map
            var suffolkInd=[];
            var zipSuffolk=["501","544","6390","11701","11702","11703","11704","11705","11706","11707","11708","11713","11715","11716","11717","11718","11719","11720","11721","11722","11724","11725","11726","11727","11729","11730","11733","11733","11738","11739","11740","11741","11742","11743","11745","11746","11747","11749","11750","11751","11752","11754","11755","11757","11760","11763","11764","11766","11767","11768","11769","11770","11772","11775","11776","11777","11778","11779","11780","11782","11784","11786","11787","11788","11789","11790","11792","11794","11795","11796","11798","11805","11901","11930","11931","11932","11933","11934","11935","11937","11939","11940","11941","11942","11944","11946","11947","11948","11949","11950","11951","11952","11953","11954","11955","11956","11957","11958","11959","11960","11961","11962","11963","11964","11965","11967","11968","11969","11970","11971","11972","11973","11975","11976","11977","11978","11980"];
            zipMap.objects.zip_codes_for_the_usa.geometries.map(function(g,i){
                if(g.properties.state=="NY"){ // check only for NY zips 
                    var isSuffolk=false
                    zipSuffolk.map(function(z){
                        if(g.properties.zip==z){isSuffolk=true}
                    })
                    if(isSuffolk){
                        suffolkInd.push(i)
                    }
                }
            })
            // create suffolk collection
            zipMap.objects.zip_codes_suffolk={
                type:"GeometryCollection",
                geometries:[]
            }
            // populate suffolk zip codes
            suffolkInd.map(function(i){
                zipMap.objects.zip_codes_suffolk.geometries.push(
                    zipMap.objects.zip_codes_for_the_usa.geometries[i]
                )
            })
            */
            divJob.innerHTML='<div id="suffolkChoropleth"></div>'
            openHealth.getJSON("https://health.data.ny.gov/resource/m2wt-pje4.json?county=Suffolk%20",function(dt){
                console.log("data loaded");
                suffolkMap = dc.geoChoroplethChart("#suffolkChoropleth");
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
                var bbox=[openHealth.min(xy[0]),openHealth.min(xy[1]),openHealth.max(xy[0]),openHealth.max(xy[1])]
                
                zipMap.features=zipMap.features.map(function(f){
                    f.bbox=bbox;                 
                    return f
                })
                zipMap.bbox=bbox;
                
                //var projection = d3.geo.mercator()
                //.center([-73,40])
        //.scale(200)
        //.translate([width/2, height]);
                
                suffolkMap.width(990)
                    .height(500)
                    .dimension(zips)
                    //.projection(d3.geo.mercator().scale(1000))
                    .group(total_admits)
                    .overlayGeoJson(zipMap.features, "zips", function (d) {
                        return d.properties.ZIP;
                    })
                    //.projection()
                    
                     
                dc.renderAll();
                //openHealth.saveFile(JSON.stringify(zipMap),'lala.json')
                4
            })
            
            
            //var cf = 
            
        })
        
        
        
        
        4
    })()
})



