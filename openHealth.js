console.log("openHealth loaded")

openHealth=function(){}
openHealth.ini=function(){
this.buildUI=function(){};
this.data={}; // <-- put your data here
this.plugins={}; // <-- put your plugins here
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
		// check for the possibility that this is a css sheet
		if(src.match(/\.css/)){
			var lk = document.createElement('link');
			lk.rel='stylesheet';
        	lk.href = src;
        	if(!!fun){lk.onload=fun} // if there is a callback run it
        	document.head.appendChild(lk);
        	return src
		} else { // it's javascript 
			var s = document.createElement('script');
			s.src = src;
			if(!!fun){s.onload=fun} // if there is a callback run it
			document.head.appendChild(s);
			return src; // I never know what to do about returns in asynchronous calls ...
		}	
    } 
};

this.xhr=function(url,meth,fun){ // XMLHttpRequest
    if(typeof(meth)=="function"){fun=meth;meth="GET"} // in case this is a regular GET call
    if(!meth){meth="GET"}
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

this.getText=function(url,fun){  
	if(!fun){fun = function(x){console.log(x)}}
    if(!this.getText.cache){ // if caching not enabled
        this.xhr(url,function(x){fun(x.target.responseText)});
    } else {
        var key = encodeURIComponent(url);
        localforage.getItem(key,function(x){
            if(!x){ // if item not found
                var moreFun = function(x){
					var y = x.target.responseText;
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

this.getParms=function(url){
	var p = {};
	if(!url){url=window.location.search.match(/[\?&]([^=\?]+=[^=\?&]+)/g)}
	else{url=url.match(/[\?&]([^=\?]+=[^=\?&]+)/g)}
	if(url){
		url.map(function(m){return m.match(/[^\?&=\/]+/g)})
		   .map(function(av){p[av[0]]=av[1]});
	}
	return p
}

this.getText.cache=false

this.sodaData={ // some reference SODA data links 
    "NY Medicare Inpatient":"http://health.data.ny.gov/resource/2yck-xisk.json",
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
	"DSRIP Medicaid Program Enrollment by Month: Beginning 2009":"https://health.data.ny.gov/resource/m4hz-kzn3.json",
    "DSRIP Hospital Inpatient Discharges (SPARCS De-Identified): 2012":"https://health.data.ny.gov/resource/u4ud-w55t.json"
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
    return this
}
this.soda2=function(url,q,fun){ // operate SODA2 services
    if(!url.match("http[s]{0,1}://")){ // if url is not a URL then assume it is an entry of openHealth.sodaData
        url=this.sodaData[url];
    }
    if(typeof(q)=="object"){
		if(url.match(/\?/)){var qq="&"}
		else{var qq="?"}
        var F = Object.getOwnPropertyNames(q);
        F.forEach(function(fi){
            qq+='$'+fi+'='+q[fi]+'&';
        })
        q=qq.slice(0,qq.length-1); // remove the last &
    }
    return this.soda(url,q,fun)
}

this.sodaAll=function(url,q,fun,xx,fun0){ // version of soda2 that keeps reading reccords untill all are retrieved
	// for example: openHealth.sodaAll("https://health.data.ny.gov/resource/u4ud-w55t.json?hospital_county=Suffolk",false,function(x){y=x;console.log("done")})
	if(!q){q={}};
	if(!q.limit){q.limit=10000};
	if(typeof(q.offset)=="undefined"){q.offset=0}else{q.offset+=q.limit};
	if(!xx){xx=[]} // the array being assembled throughout multiple calls
	if(!fun0){fun0=fun} // to carry original fun all eh way to the end
	var moreFun = function(x){
		xx=xx.concat(x);
		console.log([xx.length,x.length,q.limit,q.offset,url])
		//console.log(xx);
		//if(lala){
		if(x.length<q.limit){fun0(xx)} // reached the end of the line, just have the original fun and be done with it
		else{openHealth.sodaAll(url,q,moreFun,xx,fun0)}
		//lala=false
		//}
	}
	return this.soda2(url,q,moreFun)
}

this.sodas=function(urls,q,fun,xx){ // version of sodaAll with multiple urls, for example, to load from a list of zip codes
	//console.log(urls[0]);
	//var urlsi = urls;
	if(typeof(urls)=="string"){urls=[urls]} // so it can handle a single url too
	if(!xx){xx=[]}
	if(urls.length>0){ // keep going
		var funLater=function(x){
			openHealth.sodas(urls.slice(1),q,fun,x)
		}
		this.sodaAll(urls[0],q,funLater,xx)
	}else{
		fun(xx);
	}
}

this.object2query=function(q){
	if(typeof(q)=="object"){
		var qq=""
        var F = Object.getOwnPropertyNames(q);
        F.forEach(function(fi){
            qq+=fi+'='+q[fi]+'&';
        })
        q=qq.slice(0,qq.length-1); // remove the last &
    }
    return q
}

this.txt2docs=function(txt){
	if (txt[0]=='['){ // txt is json
		var docs = JSON.parse(txt);
	} else { //txt should be tab delimited text
		var y = txt.split(/[\n\r]/).map(function(xi){return xi.split(/\t/).map(function(c){return c.replace(/["\,]/g,'')})});
		var docs=[];
		var parms = y[0];
		for(var i=1;i<y.length-1;i++){
			docs[i-1]={};
			parms.map(function(p,j){
				docs[i-1][p]=y[i][j];
			})
		}
	}
	return docs
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
        if(!tab[Fj].join('').match(/[^\d\.\s]/g)){
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

this.avgKeyValue=function(tab,key,val,x){ // find avverage value of a key value pair 
	// i.e. openHealth.avgKeyValue(paintSuffolk.tab,"Disease state","Septicemia","Rate per 1000")
	var tabKey = tab[key];
	tabKeyVal=[];
	tabKey.map(function(k,i){
		if(k===val){tabKeyVal.push(tab[x][i])}
	})
	return this.sum(tabKeyVal)/tabKeyVal.length
}

this.avgKeyValues=function(tab,key,vals,x){ // aplies .avgKeyValue to all values
	var y={}
	vals.map(function(v){
		y[v]=openHealth.avgKeyValue(tab,key,v,x)
	})
	return y
}

this.countKeyValue=function(tab,key,val,x){ // count entries of a key value pair 
	// i.e. openHealth.countKeyValue(paintSuffolk.tab,"Disease state","Septicemia","Rate per 1000")
	var tabKey = tab[key];
	tabKeyVal=[];
	i=0;
	tabKey.map(function(k,i){
		if(k===val){i++}
	})
	return i
}

this.countKeyValues=function(tab,key,vals,x){ // aplies .avgKeyValue to all values
	var y={}
	vals.map(function(v){
		y[v]=openHealth.countKeyValue(tab,key,v,x)
	})
	return y
}

this.list=function(x){
	for(var i=0;i<x.length;i++){
		console.log(i+1,x[i])
	}
}

this.saveFile=function(x,fileName) { // x is the content of the file
	// var bb = new Blob([x], {type: 'application/octet-binary'});
	// see also https://github.com/eligrey/FileSaver.js
	var bb = new Blob([x]);
   	var url = URL.createObjectURL(bb);
	var a = document.createElement('a');
   	a.href=url;
	if (fileName){
		if(typeof(fileName)=="string"){ // otherwise this is just a boolean toggle or something of the sort
			a.download=fileName;
		}
		a.click() // then download it automatically 
	} 
	return a
}

this.countUnique=function(x){ // creates object with unique counts for each attribute fount in array x
	var u = this.unique(x);
	var c = {};
	u.map(function(ui){c[ui]=0});
	x.map(function(xi){c[xi]++});
	return c
}

this.transpose=function (x){ // transposes 2D array
        if(!Array.isArray(x[0])){y=[x]}  // in case x is a 1D Array
        else{
                var y=[],n=x.length,m=x[0].length;
                for(var j=0;j<m;j++){
                        y[j]=[];
                        for(var i=0;i<n;i++){
                                y[j][i]=x[i][j];
                        }
                }
        }
        return y
}

this.max=function(x){ //return maximum value of array
        return x.reduce(function(a,b){if(a>b){return a}else{return b}})
}

this.min=function(x){ //return maximum value of array
        return x.reduce(function(a,b){if(a<b){return a}else{return b}})
}

this.sum=function(x){
	if(Array.isArray(x[0])){return x.map(function(xi){return openHealth.sum(xi)})}
	else{return x.reduce(function(a,b){return a+b})};
}

this.sort=function(x){ // [y,I]=sort(x), where y is the sorted array and I contains the indexes
	x=x.map(function(xi,i){return [xi,i]});
	x.sort(function(a,b){return a[0]-b[0]});	
	return this.transpose(x)
}

this.interp1=function(X,Y,XI){ // linear interpolation, remember X is supposed to be sorted
	var n = X.length;
	var YI = XI.map(function(XIi){
		var i=openHealth.sum(X.map(function(Xi){if (Xi<XIi){return 1}else{return 0}}));
		if (i==0){return Y[0]} // lower bound
		else if (i==n){return Y[n-1]} // upper bound
		else{return (Y[i-1]+(XIi-X[i-1])*(Y[i]-Y[i-1])/(X[i]-X[i-1]))}
	});
	return YI
}

this.memb=function(x,dst){ // builds membership function
	var n = x.length-1;
	if(!dst){
		dst = this.sort(x);
		Ind=dst[1];
		dst[1]=dst[1].map(function(z,i){return i/(n)});
		var y = x.map(function(z,i){return dst[1][Ind[i]]});
		return dst;
	}
	else{ // interpolate y from distributions, dst
		var y = this.interp1(dst[0],dst[1],x);
		return y;
	}
	
}

this.tabulateCount=function(tab,p1,p2,Up1,Up2){//tabulate parameter p1 against p2, optional: arrays with unique values
	if(Array.isArray(tab)){tab=this.tab2docs(tab)} // in case an array of docs is being submitted
	if(!Up1){Up1 = this.unique(tab[p1])}
	if(!Up2){Up2 = this.unique(tab[p2])}
	var tabcount={}
	// prepare table structure
	Up1.map(function(p1){
		tabcount[p1]={}
		Up2.map(function(p2){
			tabcount[p1][p2]=0			
		})
	})
	var j=0
	for(var i=0;i<tab[p1].length;i++){
		tabcount[tab[p1][i]][tab[p2][i]]+=1
		j++
	}
	console.log(j+' counted')
	return tabcount
}

this.tabulateSum=function(tab,p1,p2,pv,Up1,Up2){//tabulate parameter p1 against p2, optional: arrays with unique values
	if(Array.isArray(tab)){tab=this.tab2docs(tab)} // in case an array of docs is being submitted
	if(!Up1){Up1 = this.unique(tab[p1])}
	if(!Up2){Up2 = this.unique(tab[p2])}
	var tabsum={}
	// prepare table structure
	Up1.map(function(p1){
		tabsum[p1]={}
		Up2.map(function(p2){
			tabsum[p1][p2]=0			
		})
	})
	var j=0
	for(var i=0;i<tab[p1].length;i++){
		tabsum[tab[p1][i]][tab[p2][i]]+=tab[pv][i]
		j++
	}
	console.log(j+' counted')
	return tabsum
}


this.crossdoc2csv=function(d,title){
	if(!title){title=Date()+'.csv'}
	var csv=title;
	// header
	var rr=Object.getOwnPropertyNames(d).sort(); //rows
	var cc=Object.getOwnPropertyNames(d[rr[0]]).sort() //columns
	cc.map(function(p2){
		csv+=','+p2.replace(/[;,]/g,' ')
	})
	csv+='\n'
	// body
	rr.map(function(p1){
		csv+=p1.replace(/[;,]/g,' ');
		cc.map(function(p2){
			csv+=','+d[p1][p2];
		})
		csv+='\n'
	})
	return csv
}

this.crossdoc2html=function(d,title,sort){ // create table from cross-document
	if(!title){title=Date()+'.csv'}
    var html = '<table border=1 style="color:navy">';
    var rows = Object.getOwnPropertyNames(d);
    if(sort){rows.sort()}
    var cols = [""].concat(Object.getOwnPropertyNames(d[rows[0]]));
    // header
    html +='<tr>';
    for(j=0;j<cols.length;j++){html+='<th style="text-align:right">'+cols[j]+'</th>'};
    html +='</tr>';
    // body
    for(i=0;i<rows.length;i++){
        html +='<tr>';
        html +='<th>'+rows[i]+'</th>'; // row label
        for(j=1;j<cols.length;j++){html+='<td style="text-align:right;color:blue">'+d[rows[i]][cols[j]]+'</td>'}
        html +='</tr>';
    }    
    html += '</table>';
	// download button
	var div = document.createElement('div');
	div.innerHTML=html;
	var bt = document.createElement('input');
	bt.type = "button";bt.value = "Download";bt.style.backgroundColor="yellow";bt.style.color="blue";
	var sp = document.createElement('span');sp.textContent=' as CSV with filename: ';sp.style.color="navy";
	var ipTitle = document.createElement('input');ipTitle.size=100;ipTitle.style.color="green";ipTitle.value=title;
	//lala = bt;
	bt.d=d;// the data
	bt.onclick=function(){
		var title = this.parentElement.childNodes[3].value;
		openHealth.saveFile(openHealth.crossdoc2csv(this.d,title),title);
		//console.log(this)
	}
	div.appendChild(bt);
    div.appendChild(sp);
    div.appendChild(ipTitle);
	return div;
}

this.markdown=function(x){ // basic markdown2html
    x = x.replace(/\[([^\]]+)\]\(([^\)]+)\)/g,'<a href="$2" target=_blank>$1</a>'); // links
    x = x.replace(/\n/g,'<br>'); // new lines
    return x;
}

this.log=function(x){
    var div = document.getElementById("openHealthJob")
    if(div){
       var p = document.createElement('p');
       p.innerHTML=openHealth.markdown(x);
       div.appendChild(p);
    } else{
       console.log(x);
    }
}

this.createLog=function(h){ // create log div, if posiible, within an existing openHealth div
    var div0 = document.getElementById("openHealth");
    if(!div0){
        div0 = document.createElement('div');
        document.body.appendChild(div0);
    }
    var divLog = document.createElement('div');
    divLog.id="openHealthJob";
	if(h){divLog.innerHTML=h};
    div0.appendChild(divLog);
    return divLog;
}

this.startJobMsgURL=function(){ // post URL of job into the div.id="msg" if it exists
    var divMsg=document.getElementById("msg")
    if(divMsg){
        divMsg.innerHTML='Processing ... : <a href="'+window.location.search.slice(1)+'" target=_blank>'+window.location.search.slice(1)+'</a>';
        divMsg.style.color="red";
    }
	this.createLog('<p style="color:red">Executing job, please wait ...</p>')
}

this.endJobMsgURL=function(){ // post URL of job into the div.id="msg" if it exists
    var divMsg=document.getElementById("msg")
    if(divMsg){
		//document.getElementById("openHealthJob").innerHTML="";
        divMsg.style.color="blue";
        divMsg.innerHTML='Processing ... done : <a href="'+window.location.search.slice(1)+'" target=_blank>'+window.location.search.slice(1)+'</a>';
        setTimeout(function(){
            divMsg.innerHTML='Script (<a href="'+window.location.search.slice(1)+'" target=_blank>'+window.location.search.slice(1)+'</a>) processed <i>'+new Date(Date.now())+'</i>:';
            divMsg.style.color="green";
        },1000)
        
    }
}

this.npi=function(q,fun){ // retrieve data on a National Provider Identifier from CMS
	if(!q){q=1548485139} // default example
	if(!fun){fun = function(x){console.log(x)}}
	var url = 'https://data.medicare.gov/resource/3uxj-hea6.json?';
	// basic filtering
	if(typeof(q)=="number"){q=""+q} // if number convert to string
	q=openHealth.object2query(q) // if it is an object
	if(q.match(/^[\d]+$/)){q='npi='+q} // if the query is an integer then assume it is the NPI
	this.soda(url,q,fun)
	return this
}



}

// initiatize openHealth object
openHealth.ini();

// run external analysis if called with a search argument
window.onload=function(){
    if(window.location.search.length>0){
        console.log("window loaded");
        openHealth.startJobMsgURL();   
        openHealth.getScript(window.location.search.slice(1).replace(/\/$/,''),function(){
            openHealth.endJobMsgURL();
        });
        
    }
}
