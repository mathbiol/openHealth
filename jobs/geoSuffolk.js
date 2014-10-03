console.log("geoSuffolk.js")

openHealth.getJSON("jobs/zips_us_geo.json",function(x){
    var y = {
        features:[],
        type:"FeatureCollection"
    }
    
    var zipSuffolk=["501","544","6390","11701","11702","11703","11704","11705","11706","11707","11708","11713","11715","11716","11717","11718","11719","11720","11721","11722","11724","11725","11726","11727","11729","11730","11731","11733","11733","11738","11739","11740","11741","11742","11743","11745","11746","11747","11749","11750","11751","11752","11754","11755","11757","11760","11763","11764","11766","11767","11768","11769","11770","11772","11775","11776","11777","11778","11779","11780","11782","11784","11786","11787","11788","11789","11790","11792","11794","11795","11796","11798","11805","11901","11930","11931","11932","11933","11934","11935","11937","11939","11940","11941","11942","11944","11946","11947","11948","11949","11950","11951","11952","11953","11954","11955","11956","11957","11958","11959","11960","11961","11962","11963","11964","11965","11967","11968","11969","11970","11971","11972","11973","11975","11976","11977","11978","11980"];
    x.features.map(function(f){
        if(f.properties.STATE=="NY"){
            var isSuffolk=false
            zipSuffolk.map(function(z){if(f.properties.ZIP==z){isSuffolk=true}})
            if(isSuffolk){
                y.features.push(f);
            }
        }
    })
    openHealth.saveFile(JSON.stringify(y),"zips_suffolk_geo.json")
    openHealthJob.innerHTML='<p style="color:navy">You should have a file named "zips_suffolk_geo.json" pushed into your Downloads folder just now. <br>This file was produced by combing a <a href="https://raw.githubusercontent.com/mathbiol/openHealth/gh-pages/jobs/zips_us_geo.json" target=_blank>reference geoJSON file</a> with the shapes of all US zips codes for those that are included in NY\' <a href="https://github.com/mathbiol/openHealth/blob/gh-pages/jobs/zips_suffolk_geo.json" target=_blank>Suffolk county</a>.</p>'
})



