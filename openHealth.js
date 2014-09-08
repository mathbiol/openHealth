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
    "NY Medicare Inpatient":"http://health.data.ny.gov/resource/2yck-xisk.json",
    // DSRIP NY
    // Hospital Inpatient Prevention Quality Indicators
    "NY DSRIP Hospital Inpatient Prevention Quality Indicators by Zip Code":"http://health.data.ny.gov/resource/5q8c-d6xq.json",
    "NY DSRIP Hospital Inpatient Prevention Quality Indicators by County":"http://health.data.ny.gov/resource/iqp6-vdi4.json",
    "NY DSRIP Medicaid Prevention Quality Indicators for Adult Hospital Discharges by Patient Zip Code: Beginning 2011":"http://health.data.ny.gov/resource/izyt-3msa.json",
    "NY DSRIP Medicaid Inpatient Prevention Quality Indicators for Adult Discharges by Patient County: Beginning 2011":"http://health.data.ny.gov/resource/6kjt-7svn.json",
    "NY DSRIP Medicaid Beneficiaries, Inpatient Admissions, and Emergency Room Visits by Zip Code: Beginning 2012":"http://health.data.ny.gov/resource/m2wt-pje4.json",
    "NY DSRIP Medicaid Chronic Conditions, Inpatient Admissions and Emergency Room Visits by County: Beginning 2012":"http://health.data.ny.gov/resource/wybq-m39t.json",
    "NY DSRIP Medicaid Chronic Conditions, Inpatient Admissions and Emergency Room Visits by Zip Code: Beginning 2012":"http://health.data.ny.gov/resource/2yck-xisk.json",
    "NY DSRIP Medicaid Hospital Inpatient Potentially Preventable Readmission Rates by Hospital: Beginning 2011":"http://health.data.ny.gov/resource/ckvf-rbyn.json",
    "NY DSRIP Medicaid Program Enrollment by Month: Beginning 2009":"http://health.data.ny.gov/resource/m4hz-kzn3.json",
    // Medicaid Inpatient Admissions and Emergency Room Visits
    // "NY DSRIP Medicaid Beneficiaries, Inpatient Admissions, and Emergency Room Visits by Zip Code: Beginning 2012":"http://health.data.ny.gov/resource/m2wt-pje4.json",
    // "NY DSRIP Medicaid Chronic Conditions, Inpatient Admissions and Emergency Room Visits by Zip Code: Beginning 2012":"http://health.data.ny.gov/resource/2yck-xisk.json",
    //"NY DSRIP Medicaid Chronic Conditions, Inpatient Admissions and Emergency Room Visits by County: Beginning 2012":"http://health.data.ny.gov/resource/wybq-m39t.json",
    "NY DSRIP Medicaid Potentially Preventable Emergency Visit (PPV) Rates by Patient County: Beginning 2011":"http://health.data.ny.gov/resource/cr7a-34ka.json",
    "NY DSRIP Medicaid Potentially Preventable Emergency Visits (PPV) by Patient Zip Code: Beginning 2011":"http://health.data.ny.gov/resource/khkm-zkp2.json",
    "NY DSRIP Medicaid Inpatient Prevention Quality Indicators (PDI) for Pediatric Discharges by Patient County: Beginning 2011":"http://health.data.ny.gov/resource/64yg-akce.json",
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
