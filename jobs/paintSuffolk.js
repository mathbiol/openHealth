console.log("1. paintSuffolk.js loaded");


openHealth.getScript(["//cdnjs.cloudflare.com/ajax/libs/d3/3.4.11/d3.min.js","https://www.google.com/jsapi","//square.github.io/crossfilter/crossfilter.v1.min.js","//dc-js.github.io/dc.js/js/dc.js","//dc-js.github.io/dc.js/css/dc.css"],function(){
	console.log("2. library dependencies satisfied");

	paintSuffolk=(function(){
		var res={};// results
        res.zipSuffolk=["501","544","6390","11701","11702","11703","11704","11705","11706","11707","11708","11713","11715","11716","11717","11718","11719","11720","11721","11722","11724","11725","11726","11727","11729","11730","11731","11733","11735","11738","11739","11740","11741","11742","11743","11745","11746","11747","11749","11750","11751","11752","11754","11755","11757","11760","11763","11764","11766","11767","11768","11769","11770","11772","11775","11776","11777","11778","11779","11780","11782","11784","11786","11787","11788","11789","11790","11792","11794","11795","11796","11798","11805","11901","11930","11931","11932","11933","11934","11935","11937","11939","11940","11941","11942","11944","11946","11947","11948","11949","11950","11951","11952","11953","11954","11955","11956","11957","11958","11959","11960","11961","11962","11963","11964","11965","11967","11968","11969","11970","11971","11972","11973","11975","11976","11977","11978","11980","STATEWIDE"];   
        res.urls = res.zipSuffolk.map(function(z){return "https://health.data.ny.gov/resource/5q8c-d6xq.json?patient_zipcode="+z});
        res.inData = function(x){ // x is the content of a text file read by <input> inside document.getElementById("ask_for_data")
        	res.docs = openHealth.txt2docs(x)
        	document.getElementById('ask_for_data').innerHTML='<p style="color:green">'+
        	' > <b style="color:blue">'+res.docs.length+' entries found</b>, note that it was assumed that first row contained parameter names: '
        	+'<span style="color:blue">['+Object.getOwnPropertyNames(res.docs[0])+']</span>'
        	+'<br><span id="parameterChoice"> > Chose parameter <select id="selectParm" style="color:blue"></select> and the parametr values <select id="selectParmValues" style="color:blue"></select> to <input type="button" style="color:red" id="representOnTheMap" value="represent on the map" onclick="paintSuffolk.representOnTheMap()"></span>'
        	+"</p>";
        	res.tab=openHealth.docs2tab(res.docs);
        	res.docs=openHealth.tab2docs(res.tab);
        	res.representOnTheMap=function(){
        		console.log('3. representing on the Map');
        		document.getElementById("parameterChoice").innerHTML=' > under development .. come back by the end of the afternoon';

        	}

        	// UI stuff from here on
        	if(!res.tab.Zip){
        		document.getElementById('ask_for_data').innerHTML='<p style="color:red">ERROR: couldn\'t find a "Zip" parameter in your data file</p>';
        	}else{
        		openHealth.getJSON("jobs/zips_suffolk_HD_geoNew.json",function(zipMap){
        			res.zipMap=zipMap;
        			res.div0=document.createElement('div');
        			document.getElementById('openHealthJob').appendChild(res.div0);
        			res.div0.id="divZipMapSuffolk";
        			var selectParm=document.getElementById('selectParm')
        			Object.getOwnPropertyNames(res.docs[0]).map(function(p){
        				if(p!=="Zip"&typeof(res.docs[0][p])=='string'){
        					var opt = document.createElement('option');selectParm.appendChild(opt);
        					opt.value=p;opt.textContent=p;
        				}
        			})
        			var selectParmValues=document.getElementById('selectParmValues')
        			Object.getOwnPropertyNames(res.docs[0]).map(function(p){
        				if(p!=="Zip"&typeof(res.docs[0][p])=='number'){
        					var opt = document.createElement('option');selectParmValues.appendChild(opt);
        					opt.value=p;opt.textContent=p;
        				}
        			})
        			//res.bt = document.getElementById("representOnTheMap");
        			//res.bt.onClick=function(){paintSuffolk.representOnTheMap()};
        			//4

        			

        			//res.div0.innerHTML="<table><tr><td>1</td><td>2</td></tr></table>";
        			


        			4
        		})
        	}
        	
        	
        }


        document.getElementById('openHealthJob').innerHTML=
        	'<p style="color:green" id="ask_for_data">'+
        	' > Load your data (PHI ok, the data wont\' leave your browser, this is strictly client side computing):'+
        	'<br>'
        	'</p>';
        	var p = document.getElementById("ask_for_data");
        	var inData = document.createElement('input');p.appendChild(inData);
        	inData.type="file";
        	inData.onchange=function(evt){
        		var reader = new FileReader();
        		reader.onload=function(x){
					var txt=x.target.result;
					res.inData(txt);
				}
        		reader["readAsText"](evt.target.files[0]);
        	}
        	


        /*
        openHealth.sodas(res.urls,undefined,function(dt){
			res.tab = openHealth.docs2tab(dt);
			dt=openHealth.tab2docs(res.tab);
			res.dt=dt
            document.getElementById('openHealthJob').innerHTML='<span style="color:green"> > <b style="color:blue">'+dt.length+'</b> PQI Suffolk records found in <a href="https://health.data.ny.gov/Health/Hospital-Inpatient-Prevention-Quality-Indicators-P/5q8c-d6xq" target=_blank>https://health.data.ny.gov</a> (ref# <a href="https://health.data.ny.gov/resource/5q8c-d6xq.json" target=_blank>5q8c-d6xq</a>)<br> > Hospital Inpatient Prevention Quality Indicators (PQI) for Adult Discharges by Zip Code (SPARCS): Beggining 2009 <br><span style="color:red" id="jobMsg">Assembling visualization ...</span></span>';
        	4
		})
		*/


	return res
	})();




})

