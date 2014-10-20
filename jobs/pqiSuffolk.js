console.log("pqiSuffolk.js")

// https://health.data.ny.gov/Health/Hospital-Inpatient-Prevention-Quality-Indicators-P/5q8c-d6xq
// get all data with a set of zip codes


// start with the dependencies
openHealth.getScript(["//cdnjs.cloudflare.com/ajax/libs/d3/3.4.11/d3.min.js","https://www.google.com/jsapi","//square.github.io/crossfilter/crossfilter.v1.min.js","//dc-js.github.io/dc.js/js/dc.js","//dc-js.github.io/dc.js/css/dc.css","jobs/zipSuffolkPop.js"],function(){ // after satisfying d3 dependency

	
    pqi=(function(){
		var res={};// results
        var zipSuffolk=["501","544","6390","11701","11702","11703","11704","11705","11706","11707","11708","11713","11715","11716","11717","11718","11719","11720","11721","11722","11724","11725","11726","11727","11729","11730","11731","11733","11735","11738","11739","11740","11741","11742","11743","11745","11746","11747","11749","11750","11751","11752","11754","11755","11757","11760","11763","11764","11766","11767","11768","11769","11770","11772","11775","11776","11777","11778","11779","11780","11782","11784","11786","11787","11788","11789","11790","11792","11794","11795","11796","11798","11805","11901","11930","11931","11932","11933","11934","11935","11937","11939","11940","11941","11942","11944","11946","11947","11948","11949","11950","11951","11952","11953","11954","11955","11956","11957","11958","11959","11960","11961","11962","11963","11964","11965","11967","11968","11969","11970","11971","11972","11973","11975","11976","11977","11978","11980","STATEWIDE"];   
        var urls = zipSuffolk.map(function(z){return "https://health.data.ny.gov/resource/5q8c-d6xq.json?patient_zipcode="+z});
        openHealth.sodas(urls,undefined,function(dt){
			var tab = openHealth.docs2tab(dt);
			dt=openHealth.tab2docs(tab);
			res.dt=dt
            document.getElementById('openHealthJob').innerHTML='<span style="color:green"> > <b style="color:blue">'+dt.length+'</b> PQI Suffolk records found in <a href="https://health.data.ny.gov/Health/Hospital-Inpatient-Prevention-Quality-Indicators-P/5q8c-d6xq" target=_blank>https://health.data.ny.gov</a> (ref# <a href="https://health.data.ny.gov/resource/5q8c-d6xq.json" target=_blank>5q8c-d6xq</a>)<h4 style="color:navy">Hospital Inpatient Prevention Quality Indicators (PQI) for Adult Discharges by Zip Code (SPARCS): Beggining 2009</h4> <span style="color:red" id="jobMsg">Assembling visualization ...</span></span>';
            document.getElementById('openHealthJob').innerHTML+='<table><tr><td id="suffolkYearPie"></td><td id="suffolkChoropleth"></td></tr></table><table><tr><td id="suffolkObservedPqi"></td><td  id="suffolkExpectedPqi">...</td></tr></table>';
            
            openHealth.getJSON("jobs/zips_suffolk_HD_geoNew.json",function(zipMap){
            	pqi.zipMap=zipMap;
            	pqi.zipProperties={};
            	zipMap.features.map(function(zi){
            		pqi.zipProperties[zi.properties.ZCTA5CE10]=zi.properties;
            	})

                console.log("map loaded");
                var C_Map = dc.geoChoroplethChart("#suffolkChoropleth");
                var C_Pie = dc.pieChart("#suffolkYearPie");
                var C_Obs = dc.rowChart("#suffolkObservedPqi");
                var C_Exp = dc.bubbleChart("#suffolkExpectedPqi");
				
                
                // Set dimensions and groups
                var cf=crossfilter(dt);
                var zips = cf.dimension(function(d){return d.patient_zipcode});
                //var G_zips = zips.group().reduceSum(function(d){return d.observed_rate_per_100_000_people});
                var G_zips_reduce={};
				var U_zips = openHealth.unique(tab.patient_zipcode).sort();
				U_zips.map(function(u){G_zips_reduce[u]={p:0,n:0,expt:0}})
				var G_zips = zips.group().reduce(
					// reduce in
					function(p,v){
						G_zips_reduce[v.patient_zipcode].p+=v.observed_rate_per_100_000_people;
						G_zips_reduce[v.patient_zipcode].expt+=v.expected_rate_per_100_000_people;
						G_zips_reduce[v.patient_zipcode].n+=1;
						//if(G_zips_reduce[v.patient_zipcode].n>0){return G_zips_reduce[v.patient_zipcode].p/G_zips_reduce[v.patient_zipcode].n}
						if(G_zips_reduce[v.patient_zipcode].n>0){return G_zips_reduce[v.patient_zipcode].p/G_zips_reduce[v.patient_zipcode].expt}
						else{return 0}
					},
					// reduce out
					function(p,v){
						G_zips_reduce[v.patient_zipcode].p-=v.observed_rate_per_100_000_people;
						G_zips_reduce[v.patient_zipcode].expt-=v.expected_rate_per_100_000_people;
						G_zips_reduce[v.patient_zipcode].n-=1;
						//if(G_zips_reduce[v.patient_zipcode].n>0){return G_zips_reduce[v.patient_zipcode].p/G_zips_reduce[v.patient_zipcode].n}
						if(G_zips_reduce[v.patient_zipcode].n>0){return G_zips_reduce[v.patient_zipcode].p/G_zips_reduce[v.patient_zipcode].expt}
						else{return 0} 
					},
					// ini
					function(){return 0}
            	)
                
                
                
                var years = cf.dimension(function(d){return d.year});
                var G_years = years.group()
				var pqis = cf.dimension(function(d){return d.pqi_name});
				//var G_Observed = pqis.group().reduceSum(function(d){return d.observed_rate_per_100_000_people})
				res.G_Observed_reduce={};
				res.G_Expect_reduce={};
				res.U_pqis = openHealth.unique(tab.pqi_name).sort();
				res.U_pqis.map(function(u){res.G_Observed_reduce[u]={p:0,expt:0,n:0}})
				res.U_pqis.map(function(u){res.G_Expect_reduce[u]={p:0,expt:0,n:0}})
				var G_Observed = pqis.group().reduce(
					// reduce in
					function(p,v){
						res.G_Observed_reduce[v.pqi_name].p+=v.observed_rate_per_100_000_people;
						res.G_Observed_reduce[v.pqi_name].expt+=v.expected_rate_per_100_000_people;
						res.G_Observed_reduce[v.pqi_name].n+=1;
						res.G_Observed_reduce[v.pqi_name].ratio=res.G_Observed_reduce[v.pqi_name].p/res.G_Observed_reduce[v.pqi_name].expt;
						if(res.G_Observed_reduce[v.pqi_name].n>0){return res.G_Observed_reduce[v.pqi_name].p/res.G_Observed_reduce[v.pqi_name].n}
						else{return 0}
						//return res.G_Observed_reduce[v.pqi_name].p/res.G_Observed_reduce[v.pqi_name].expt
						
					},
					// reduce out
					function(p,v){
						res.G_Observed_reduce[v.pqi_name].p-=v.observed_rate_per_100_000_people;
						res.G_Observed_reduce[v.pqi_name].expt-=v.expected_rate_per_100_000_people;
						res.G_Observed_reduce[v.pqi_name].n-=1;
						res.G_Observed_reduce[v.pqi_name].ratio=res.G_Observed_reduce[v.pqi_name].p/res.G_Observed_reduce[v.pqi_name].expt;
						if(res.G_Observed_reduce[v.pqi_name].n>0){return res.G_Observed_reduce[v.pqi_name].p/res.G_Observed_reduce[v.pqi_name].n}
						else{return 0}
						//return res.G_Observed_reduce[v.pqi_name].p/res.G_Observed_reduce[v.pqi_name].expt
					},
					// ini
					function(){return 0}
            	)

            	var expects = cf.dimension(function(d){return d.patient_zipcode}); // because we'll be bubling by zip code
                var G_expects = expects.group().reduce(
					// reduce in
					function(p,v){
						res.G_Expect_reduce[v.pqi_name].p+=v.observed_rate_per_100_000_people;
						res.G_Expect_reduce[v.pqi_name].expt+=v.expected_rate_per_100_000_people;
						res.G_Expect_reduce[v.pqi_name].n+=1;
						res.G_Expect_reduce[v.pqi_name].ratio=res.G_Expect_reduce[v.pqi_name].p/res.G_Expect_reduce[v.pqi_name].expt;
						if(res.G_Expect_reduce[v.pqi_name].n>0){return res.G_Expect_reduce[v.pqi_name].p/res.G_Expect_reduce[v.pqi_name].n}
						else{return 0}
						//return res.G_Expect_reduce[v.pqi_name].p/res.G_Expect_reduce[v.pqi_name].expt
						
					},
					// reduce out
					function(p,v){
						res.G_Expect_reduce[v.pqi_name].p-=v.observed_rate_per_100_000_people;
						res.G_Expect_reduce[v.pqi_name].expt-=v.expected_rate_per_100_000_people;
						res.G_Expect_reduce[v.pqi_name].n-=1;
						res.G_Expect_reduce[v.pqi_name].ratio=res.G_Expect_reduce[v.pqi_name].p/res.G_Expect_reduce[v.pqi_name].expt;
						if(res.G_Expect_reduce[v.pqi_name].n>0){return res.G_Expect_reduce[v.pqi_name].p/res.G_Expect_reduce[v.pqi_name].n}
						else{return 0}
						//return res.G_Observed_reduce[v.pqi_name].p/res.G_Observed_reduce[v.pqi_name].expt
					},
					// ini
					function(){return 0}
            	)
				
				
				
				
				G_zips.n=G_zips.all().length;

                C_Map.width(800)
                    .height(500)
                    .dimension(zips)
                    .projection(d3.geo.albersUsa().scale(28000).translate([-8350,2400]))
                    .group(G_zips)
					//.colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
                    //.colors(d3.scale.quantize().range([d3.rgb(255,0,0).toString(), d3.rgb(255,255,0).toString()]))
                    //.colors(d3.scale.quantile().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
                    //.colorDomain([-100, 1000])
					.colors(d3.scale.linear().domain([-1,0,0.95,1.1,1.75,10]).range(["silver","green","green","yellow","red","black"]))
					.overlayGeoJson(zipMap.features, "zip", function (d) {
						//console.log(d.properties.ZCTA5CE10)
                        return d.properties.ZCTA5CE10;
                    })
                    .title(function(d) {
                    	G_zips_reduce
                    	4
                        //return Math.round(d.value)+" per 100,000 @ zip "+d.key;
                        if(openHealth.data.suffolkCounty.zipPop[d.key]){
                        	if (G_zips_reduce[d.key]){
                        		return "obs/expt="+Math.round(G_zips_reduce[d.key].p/G_zips_reduce[d.key].n)+"/"+Math.round(G_zips_reduce[d.key].expt/G_zips_reduce[d.key].n)+" ("+G_zips_reduce[d.key].n+") @zip"+d.key+" "+openHealth.data.suffolkCounty.zipPop[d.key].name+", pop "+openHealth.data.suffolkCounty.zipPop[d.key].pop;	
                        	} else{
                        		return "zip"+d.key+" "+openHealth.data.suffolkCounty.zipPop[d.key].name+", pop "+openHealth.data.suffolkCounty.zipPop[d.key].pop;	
                        	}
                        	
                        } else {
                        	return "zip"+d.key;
                        }
                    })
					.colorAccessor(function(d, i){
						if(d){return d}
						else{return -1}
					})
					/*
                    .colorAccessor(function(d, i){
						if(i==0){G_zips.dst=openHealth.memb(G_zips.all().map(function(d){return d.value}))} // update distribution
                        //console.log(i,d)
						if(d){return openHealth.memb([d],G_zips.dst)[0]}
						else{return -1}
                    })
					*/
                    
                C_Pie
                    .width(250)
					.height(220)
					.radius(100)
					.innerRadius(30)
					.dimension(years)
					.group(G_years)
					.title(function(d){return d.year});
                
                C_Obs
					.width(400)
					//.height(220)
					.height(G_Observed.size()*30)
					.margins({top: 5, left: 10, right: 10, bottom: 20})
					.dimension(pqis)
					.group(G_Observed)
					.colors(d3.scale.linear().domain([-1,0,0.95,1.1,1.75,10]).range(["silver","green","green","yellow","red","brown"]))
					.colorAccessor(function(d, i){
						/*
						if (i==0){ // capture the distribution
							res.ObsExp=[];
							res.U_pqis.sort().map(function(u,i){res.ObsExp.push(res.G_Observed_reduce[u].p/res.G_Observed_reduce[u].expt)})
							res.ObsExp_dist=openHealth.memb(res.ObsExp)	
						}
						return openHealth.memb([res.ObsExp[i]],res.ObsExp_dist)[0]
						if(d.value){return d.value}
						else{return -1}
						*/
						return res.G_Observed_reduce[d.key].ratio;
						
					})
					.title(function(d){
						var expt = Math.round(res.G_Observed_reduce[d.key].expt/res.G_Observed_reduce[d.key].n);
						return Math.round(d.value)+' per 100,000 observed, '+Math.round(100*d.value/expt)+'% of expected '+expt
					})
					


				//*
				// get boundary value for bubble chart
				var getMinMax=function(a){ // for atribute a, say "p" or "expt"
					var zz = [];
					zipSuffolk.map(function(z){
						if(G_zips_reduce[z]){
							zz.push(G_zips_reduce[z][a]/G_zips_reduce[z].n)
						}
					})
					return [openHealth.min(zz),openHealth.max(zz)]
				}
				
				C_Exp
					.width(G_Observed.size()*30)
					.height(G_Observed.size()*30)
					.margins({top: 10, right: 50, bottom: 30, left: 40})
					.transitionDuration(1500)
					.dimension(expects)
					.group(G_expects)
					.x(d3.scale.linear().domain(getMinMax('expt')))
					.y(d3.scale.linear().domain(getMinMax('p')))
					.elasticY(true)
        			.elasticX(true)
					.r(d3.scale.linear().domain([0, 4000]))
					.keyAccessor(function (r) { 			// <-- X values
						if(G_zips_reduce[r.key].n){return G_zips_reduce[r.key].expt/G_zips_reduce[r.key].n}
						else{return 0}
					})
					.valueAccessor(function (r) { 			// <-- Y values
						if(G_zips_reduce[r.key].n){return G_zips_reduce[r.key].p/G_zips_reduce[r.key].n}
						else{return 0}
					})
					.radiusValueAccessor(function (r) { 			// <-- X values
						//console.log(r,openHealth.data.suffolkCounty.zipPop[r.key])
						//if(openHealth.data.suffolkCounty.zipPop[r.key])
						if(openHealth.data.suffolkCounty.zipPop[r.key]){
							return Math.sqrt(openHealth.data.suffolkCounty.zipPop[r.key].pop)
						} else {return 0}
						
						//return G_zips_reduce[r.key].p/G_zips_reduce[r.key].expt
					})
					.colors(d3.scale.linear().domain([-1,0,0.95,1.1,1.75,10]).range(["silver","green","green","yellow","red","brown"]))
					.colorAccessor(function (d) {
            			//return d.value
            			return G_zips_reduce[d.key].p/G_zips_reduce[d.key].expt
        			})
					.xAxisLabel('Expected, per 100,000')
					.yAxisLabel('Observed, per 100,000')
					.renderHorizontalGridLines(true) // (optional) render horizontal grid lines, :default=false
        			.renderVerticalGridLines(true) // (optional) render vertical grid lines, :default=false
        			.yAxisPadding(10)
        			.xAxisPadding(10)
        			.maxBubbleRelativeSize(0.3)
        			.label(function (p) {
        				if(openHealth.data.suffolkCounty.zipPop[p.key]){
        					return openHealth.data.suffolkCounty.zipPop[p.key].name+' ('+p.key+')'
        				} else {
        					return p.key;
        				}
        			})
        
        

				//*/


                
                dc.renderAll();
                
                // post-charting
				
				$('.dc-chart g.row text').css('fill','black');
                
                document.getElementById("jobMsg").textContent="";
                
                res.G_zips_reduce=G_zips_reduce;
				res.charts={C_Map:C_Map,C_Pie:C_Pie,C_Obs:C_Obs,G_zips:G_zips,G_Observed:G_Observed,G_years:G_years}//,C_Exp:C_Exp}
                
            })
            
            
            
        })
		
		return res
    })()

})
