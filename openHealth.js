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
    this.xhr(url,function(x){fun(JSON.parse(x.target.responseText))});
}

this.sodaData={ // some reference SODA data links
    /*
    Jonas,
    https://www.health.ny.gov/health_care/medicaid/redesign/dsrip_performance_data/
    The CSV format can be downloaded:
    https://health.data.ny.gov/Health/Medicaid-Chronic-Conditions-Inpatient-Admissions-a/2yck-xisk
    For each zip and year there should be two rows. You can add these rows together as they are two distinct sets of people. The Medicaid dual eligible with Medicare (usually over 65) and the straight Medicaid Members.
    Janos
    */    
    "NY Medicare Inpatient":"http://health.data.ny.gov/resource/2yck-xisk.json",
    
}
this.soda=function(url,q,fun){ // operate Socrata Open Data API (SODA), http://dev.socrata.com/docs/endpoints.html
    if(!url.match("http[s]{0,1}://")){ // if url is not a URL then assume it is an entry of openHealth.sodaData
        url=this.sodaData[url];
    }
    if(typeof(q)=="function"){fun=q;q=""}
    if(!fun){fun=function(x){console.log(x)}}
    this.getJSON(url,fun);
    return url
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
        if(!tab[Fj].join('').match(/[\D]/g)){
            tab[Fj] = tab[Fj].map(function(xi){
                return parseFloat(xi);
            })
        }
    }  
    return tab
}

this.crossdoc2html=function(d){ // create table from cross-document
    var html = '<table>';
    var rows = Object.getOwnPropertyNames(d);
    var cols = [""].concat(Object.getOwnPropertyNames(d[rows[0]]));
    // header
    html +='<tr>';
    for(j=0;j<cols.length;j++){
        html+='<th>'+cols[j]+'</th>';
    }
    html +='</tr>';
    // body
    for(i=0;i<rows.length;i++){
        html +='<tr>';
        html +='<th>'+rows[i]+'</th>'; // row label
        for(j=1;j<cols.length;j++){
            html+='<td>'+d[rows[i]][cols[j]]+'</td>';
        }
        html +='</tr>';
    }    
    html += '</table>';
    return html;
}

this.log=function(x){
    console.log(x);
    var div = document.getElementById("openHealthLog")
    if(div){
       var p = document.createElement('p');
       p.innerHTML=x.replace(/\n/g,'<br>');
       div.appendChild(p);
    }
}
}

// initiatize openHealth object
openHealth.ini();

// run external analysis if called as a search argument
if(window.location.search.length>0){
    openHealth.getScript(window.location.search.slice(1))
}
