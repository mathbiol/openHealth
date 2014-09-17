console.log("openHealth loaded")

openHealth=function(){}
openHealth.ini=function(){
this.buildUI=function(){};
this.getScript=function(src,fun){
    if(Array.isArray(src)){ // multiple scripts are being loaded
        if(src.length==1){
            openHealth.getScript(src[0],fun);
        }else{
            openHealth.getScript(src[0],function(){
                src.shift(); // remove [0]
                openHealth.getScript(src,fun);
            });          
        }        
    } else {
        var s = document.createElement('script');
        s.src = src;
        if(!!fun){s.onload=fun} // if there is a callback run it
        document.head.appendChild(s);
        return src; // I never know what to do about returns in asynchronous calls ...
    } 
};

this.xhr=function(url,meth,fun){ // XMLHttpRequest
    if(typeof(meth)=="function"){fun=meth;meth="GET"} // in case this is a regular GET call
    var r = new XMLHttpRequest();
    if(!!fun){r.onload=fun}; // calback
    r.open(meth,url,true);
    r.send();
    return r
}

this.getJSON=function(url,fun){
    
    if(!this.getJSON.cache){ // if caching not enabled
        this.xhr(url,function(x){fun(JSON.parse(x.target.responseText))});
    } else {
        var key = encodeURIComponent(url);
        localforage.getItem(key,function(x){
            if(!x){ // if item not found
                var moreFun = function(x){
                    var y = JSON.parse(x.target.responseText);
                    fun(y);
                    localforage.setItem(key,y);
                    //console.log('seting '+key);
                }
                openHealth.xhr(url,moreFun);
            } else {
                fun(x);
                //console.log('got '+key);
            }
        })
        
    }
    
}

this.getJSON.cache=true

this.sodaData={ // some reference SODA data links 
    // "NY Medicare Inpatient":"http://health.data.ny.gov/resource/2yck-xisk.json",
    // DSRIP NY
    // Hospital Inpatient Prevention Quality Indicators
    "DSRIP Hospital Inpatient Prevention Quality Indicators (PQI) for Adult Discharges by Zip Code (SPARCS): Beginning 2009":"https://health.data.ny.gov/resource/5q8c-d6xq.json",
    "DSRIP Hospital Inpatient Prevention Quality Indicators (PQI) for Adult Discharges by County (SPARCS): Beginning 2009":"https://health.data.ny.gov/resource/iqp6-vdi4.json",
    "DSRIP Medicaid Inpatient Prevention Quality Indicators (PQI) for Adult Discharges by Patient Zip Code: Beginning 2011":"https://health.data.ny.gov/resource/izyt-3msa.json",
    "DSRIP Medicaid Inpatient Prevention Quality Indicators (PQI) for Adult Discharges by Patient County: Beginning 2011":"https://health.data.ny.gov/resource/6kjt-7svn.json",
    "DSRIP Medicaid Beneficiaries, Inpatient Admissions and Emergency Room Visits by Zip Code: Beginning 2012":"https://health.data.ny.gov/resource/m2wt-pje4.json",
    "DSRIP Medicaid Chronic Conditions, Inpatient Admissions and Emergency Room Visits by County: Beginning 2012":"https://health.data.ny.gov/resource/wybq-m39t.json",
    "DSRIP Medicaid Chronic Conditions, Inpatient Admissions and Emergency Room Visits by Zip Code: Beginning 2012":"https://health.data.ny.gov/resource/2yck-xisk.json",
    "DSRIP Medicaid Hospital Inpatient Potentially Preventable Readmission (PPR) Rates by Hospital: Beginning 2011":"https://health.data.ny.gov/resource/ckvf-rbyn.json",
    // Medicaid Inpatient Admissions and Emergency Room Visits
    // "NY DSRIP Medicaid Beneficiaries, Inpatient Admissions, and Emergency Room Visits by Zip Code: Beginning 2012":"http://health.data.ny.gov/resource/m2wt-pje4.json",
    // "NY DSRIP Medicaid Chronic Conditions, Inpatient Admissions and Emergency Room Visits by Zip Code: Beginning 2012":"http://health.data.ny.gov/resource/2yck-xisk.json",
    //"NY DSRIP Medicaid Chronic Conditions, Inpatient Admissions and Emergency Room Visits by County: Beginning 2012":"http://health.data.ny.gov/resource/wybq-m39t.json",
    "DSRIP Medicaid Potentially Preventable Emergency Visit (PPV) Rates by Patient County: Beginning 2011":"https://health.data.ny.gov/resource/cr7a-34ka.json",
    "DSRIP Medicaid Potentially Preventable Emergency Visits (PPV) by Patient Zip Code: Beginning 2011":"https://health.data.ny.gov/resource/khkm-zkp2.json",
    "DSRIP Medicaid Inpatient Prevention Quality Indicators (PDI) for Pediatric Discharges by Patient County: Beginning 2011":"https://health.data.ny.gov/resource/64yg-akce.json",
	"DSRIP Medicaid Program Enrollment by Month: Beginning 2009":"https://health.data.ny.gov/resource/m4hz-kzn3.json"
    //"Medicaid Inpatient Prevention Quality Indicators (PDI) for Pediatric Discharges by Patient County: Beginning 2011":"http://health.data.ny.gov/resource/64yg-akce.json",
    // MIS
    // "NY DSRIP Discharge":"http://health.data.ny.gov/resource/ckvf-rbyn.json"
}
this.soda=function(url,q,fun){ // operate Socrata Open Data API (SODA), http://dev.socrata.com/docs/endpoints.html
    if(!url.match("http[s]{0,1}://")){ // if url is not a URL then assume it is an entry of openHealth.sodaData
        url=this.sodaData[url];
    }
    if(!q){q=""}
    if(typeof(q)=="function"){fun=q;q=""}
    if(!fun){fun=function(x){console.log(x)}}
    this.getJSON(url+q,fun);
    return url
}
this.soda2=function(url,q,fun){ // operate SODA2 services
    if(!url.match("http[s]{0,1}://")){ // if url is not a URL then assume it is an entry of openHealth.sodaData
        url=this.sodaData[url];
    }
    if(typeof(q)=="object"){
        var qq="?";
        var F = Object.getOwnPropertyNames(q);
        F.forEach(function(fi){
            qq+='$'+fi+'='+q[fi]+'&';
        })
        q=qq.slice(0,qq.length-1); // remove the last &
    }
    return this.soda(url,q,fun)
}
this.docs2tab=function(docs){ // convert array of docs into table
    var F = Object.getOwnPropertyNames(docs[0]);
    var m = F.length; // number of fields
    var n = docs.length; // number of docs
    var tab = {};
    for(j=0;j<m;j++){
        var Fj=F[j];
        tab[Fj]=[]; // initialize array for jth field
        for(i=0;i<n;i++){
            tab[Fj][i]=docs[i][Fj];
        }
        // recognize numeric types
        if(!tab[Fj].join('').match(/[^\d\.]/g)){
            tab[Fj] = tab[Fj].map(function(xi){
                return parseFloat(xi);
            })
        }
    }  
    return tab
}

this.tab2docs=function(tab){
    var docs=[];
    var F = Object.getOwnPropertyNames(tab);
    var n = tab[F[0]].length; // # rows
    var m = F.length; // # fields
    for(var i=0 ; i<n ; i++){
        docs[i]={};
        for(var j=0 ; j<m ; j++){
            docs[i][F[j]]=tab[F[j]][i];
        }
    }
    return docs
}

this.docs2docs=function(docs){ // recognize numerical types
    return this.tab2docs(this.docs2tab(docs))
}

this.unique=function (x){ // x should be an Array
	if(typeof(x)=='string'){x=x.split('')}; // if it is a string, break it into an array of its characters
	var u = []; // store unique here
	u[0]=x[0];
	for (var i=1; i<x.length; i++){
		// check if x[i] is new
		if (u.map(function(ui){return ui===x[i]}).reduce(function(a,b){return a+b})==0){
			u[u.length]=x[i];
		}
	}
	return u;
} 

this.crossdoc2html=function(d){ // create table from cross-document
    var html = '<table>';
    var rows = Object.getOwnPropertyNames(d);
    var cols = [""].concat(Object.getOwnPropertyNames(d[rows[0]]));
    // header
    html +='<tr>';
    for(j=0;j<cols.length;j++){html+='<th>'+cols[j]+'</th>'};
    html +='</tr>';
    // body
    for(i=0;i<rows.length;i++){
        html +='<tr>';
        html +='<th>'+rows[i]+'</th>'; // row label
        for(j=1;j<cols.length;j++){html+='<td>'+d[rows[i]][cols[j]]+'</td>'}
        html +='</tr>';
    }    
    html += '</table>';
    return html;
}

this.markdown=function(x){ // basic markdown2html
    x = x.replace(/\[([^\]]+)\]\(([^\)]+)\)/g,'<a href="$2" target=_blank>$1</a>'); // links
    x = x.replace(/\n/g,'<br>'); // new lines
    return x;
}

this.log=function(x){
    var div = document.getElementById("openHealthLog")
    if(div){
       var p = document.createElement('p');
       p.innerHTML=openHealth.markdown(x);
       div.appendChild(p);
    } else{
       console.log(x);
    }
}

this.startJobMsgURL=function(){ // post URL of job into the div.id="msg" if it exists
    var divMsg=document.getElementById("msg")
    if(divMsg){
        divMsg.innerHTML='Processing ... : <a href="'+window.location.search.slice(1)+'" target=_blank>'+window.location.search.slice(1)+'</a>';
        divMsg.style.color="red";
    }    
}

this.endJobMsgURL=function(){ // post URL of job into the div.id="msg" if it exists
    var divMsg=document.getElementById("msg")
    if(divMsg){
        divMsg.style.color="blue";
        divMsg.innerHTML='Processing ... done : <a href="'+window.location.search.slice(1)+'" target=_blank>'+window.location.search.slice(1)+'</a>';
        setTimeout(function(){
            divMsg.innerHTML='Script (<a href="'+window.location.search.slice(1)+'" target=_blank>'+window.location.search.slice(1)+'</a>) processed <i>'+new Date(Date.now())+'</i>:';
            divMsg.style.color="green";
        },1000)
        
    }    
}

this.createLog=function(){ // create log div, if posiible, within an existing openHealth div
    var div0 = document.getElementById("openHealth");
    if(!div0){
        div0 = document.createElement('div');
        document.body.appendChild(div0);
    }
    var divLog = document.createElement('div');
    divLog.id="openHealthLog";
    div0.appendChild(divLog);
    return divLog;
}

this.forceGraph=function(div,graph,width,height){
    if(!div){var div = document.createElement("div");document.body.appendChild(div)}
    if(typeof(div)=="string"){div=document.getElementById(div)}
    if(!width){width=960}
    if(!height){height=500}    
    var color = d3.scale.category20();
    var force = d3.layout.force()
        .charge(-120)
        .size([width, height]);
    var svg = d3.select(document.getElementById("openHealthD3")).append("svg")
        .attr("width", width)
        .attr("height", height);
    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();
    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });
      
      // Create the groups under svg
    var gnodes = svg.selectAll('g.gnode')
        .data(graph.nodes)
        .enter()
            .append('g')
            .classed('gnode', true);

       // Add one circle in each group
    var node = gnodes.append("circle")
        .attr("class", "node")
        .attr("r", function(d) { return d.r})
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

        // Append the labels to each group
        var labels = gnodes.append("text")
        .attr("x", 6)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

        force.on("tick", function() {
            // Update the links
            link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

            // Translate the groups
            gnodes.attr("transform", function(d) { 
                return 'translate(' + [d.x, d.y] + ')'; 
            });    

        });

  
        jQuery('.node').css('stroke','navy')
        jQuery('.node').css('stroke-width','1.5px')
        jQuery('.link').css('stroke','#999')
        jQuery('.link').css('stroke','.6')
        
        return force
    
    }

}

// initiatize openHealth object
openHealth.ini();

// run external analysis if called with a search argument
window.onload=function(){
    if(window.location.search.length>0){
        console.log("window loaded");
        openHealth.startJobMsgURL();   
        openHealth.getScript(window.location.search.slice(1),function(){
            openHealth.endJobMsgURL();
        });
        
    }
}
