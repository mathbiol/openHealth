console.log("pqiSuffolk.js")

// https://health.data.ny.gov/Health/Hospital-Inpatient-Prevention-Quality-Indicators-P/5q8c-d6xq
// get all data with a set of zip codes

// start with the dependencies
openHealth.getScript(["//cdnjs.cloudflare.com/ajax/libs/d3/3.4.11/d3.min.js","https://www.google.com/jsapi","//square.github.io/crossfilter/crossfilter.v1.min.js","//dc-js.github.io/dc.js/js/dc.js","//dc-js.github.io/dc.js/css/dc.css"],function(){ // after satisfying d3 dependency


    pqi=(function(){
        var zipSuffolk=["501","544","6390","11701","11702","11703","11704","11705","11706","11707","11708","11713","11715","11716","11717","11718","11719","11720","11721","11722","11724","11725","11726","11727","11729","11730","11731","11733","11738","11739","11740","11741","11742","11743","11745","11746","11747","11749","11750","11751","11752","11754","11755","11757","11760","11763","11764","11766","11767","11768","11769","11770","11772","11775","11776","11777","11778","11779","11780","11782","11784","11786","11787","11788","11789","11790","11792","11794","11795","11796","11798","11805","11901","11930","11931","11932","11933","11934","11935","11937","11939","11940","11941","11942","11944","11946","11947","11948","11949","11950","11951","11952","11953","11954","11955","11956","11957","11958","11959","11960","11961","11962","11963","11964","11965","11967","11968","11969","11970","11971","11972","11973","11975","11976","11977","11978","11980","STATEWIDE"];   
        var urls = zipSuffolk.map(function(z){return "https://health.data.ny.gov/resource/5q8c-d6xq.json?patient_zipcode="+z});
        openHealth.sodas(urls,undefined,function(dt){
            document.getElementById('openHealthJob').innerHTML='<span style="color:green"> > <b style="color:blue">'+dt.length+'</b> PQI Suffolk records found in <a href="https://health.data.ny.gov/Health/Hospital-Inpatient-Prevention-Quality-Indicators-P/5q8c-d6xq" target=_blank>https://health.data.ny.gov</a> (ref# 5q8c-d6xq)<br> > Hospital Inpatient Prevention Quality Indicators (PQI) for Adult Discharges by Zip Code (SPARCS): Beggining 2009 <br><span style="color:red" id="jobMsg">Assembling visualization ...</span></span>';
            document.getElementById('openHealthJob').innerHTML+='<table><tr><td id="suffolkChoropleth">map goes here</td></tr></table><table><tr><td id="suffolkYearPie">year</td><td id="suffolkObservedPqi">pqi</td><td  id="suffolkExpectedPqi">predicted vs observed</td></tr></table>';
            
            openHealth.getJSON("jobs/zips_suffolk_HD_geo.json",function(zipMap){
                console.log("map loaded");
                var C_Map = dc.geoChoroplethChart("#suffolkYearPie");
                //var C_Pie = dc.pieChart("#suffolkChoropleth");
                //var C_Obs = dc.barChart("#suffolkObservedPqi");
                //var C_Exp = dc.barChart("#suffolkExpectedPqi");
                
                
                var cf=crossfilter(dt);
                var zips = cf.dimension(function(d){return d.patient_zipcode});
                var G_zips = zips.group().reduceSum(
                    function(d){return Math.random()*1000}
                )
                
                /*zips.group().reduce(
                    // reduce in
                    function(p,v){return Math.random()*1000},
                    // reduce out
                    function(p,v){return Math.random()*1000},
                    // ini
                    function(){return Math.random()*1000}
                
                )*/
                
                var year = cf.dimension(function(d){return d.year});
                var pqi = cf.dimension(function(d){return d.pqi_name});
                
                C_Map.width(990)
                    .height(500)
                    .dimension(zips)
                    .projection(d3.geo.albersUsa().scale(28000).translate([-8200,2400]))
                    .group(G_zips)
                    .overlayGeoJson(zipMap.features, "zip", function (d) {
                        return d.properties.ZCTA5CE10;
                    })
                    .title(function(d) {
                        return "zip: " + d.patient_zipcode;
                    })
                    .colorAccessor(function(d, i){return Math.random()*1000})
                dc.renderAll();
                
                document.getElementById("jobMsg").textContent="";
                
                4
                
            })
            
            
            
        })
    })()

})
