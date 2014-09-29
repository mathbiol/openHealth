console.log('analysis "2014-08-03.js"')
// a.     What are medicaid patients  they being hospitalized for? (leading causes of hospitalization) 
//                                               i.     Primary diagnosis (top ten)
//                                             ii.     Proportion with psych comorbidity (what are they)
//                                            iii.     Top secondary diagnoses

// --- change message ---
divMsg=document.getElementById("msg")
divMsg.innerHTML='Process: <a href="'+window.location.search.slice(1)+'" target=_blank>'+window.location.search.slice(1)+'</a>';
divMsg.style.color="red";

// --- create log div ---
div0 = document.getElementById("openHealth");
divLog = document.createElement('div');
divLog.id="openHealthJob";
div0.appendChild(divLog);

// load data and analyse it:
var log=openHealth.log;    
openHealth.getScript("https://jmat.googlecode.com/git/jmat.js",function(){
url = "http://health.data.ny.gov/resource/2yck-xisk.json?county=Suffolk%20";
log('Getting data from <a href="'+url+'" target=_blank>'+url+'</a> on '+new Date(Date.now()));
openHealth.soda(url,function(docs){
    console.log(docs);
    log("Number of documents: "+docs.length);
    log("fields: <i>"+Object.getOwnPropertyNames(docs[0]).join(", ")+"</i>");
    //log("fields = "+JSON.stringify(Object.getOwnPropertyNames(docs[0]),null,3));
    
    var tab = openHealth.docs2tab(docs);
    
    // --- Primary diagnosis (top ten) ---
    
    log("<h3>i. Primary diagnosis (<i>major_diagnostic_category</i>)</h3>")
    
    var D = jmat.unique(tab.major_diagnostic_category);
    var C = ["er_recips","er_visits","ip_admits","ip_recips","recip_condition"];
    var countMajDiag={}
    D.map(function(d){
        countMajDiag[d]={};
        C.map(function(c){
            countMajDiag[d][c]=0;
        })
    }); 
    for(var i=0;i<docs.length;i++){
        for(var j=0;j<C.length;j++){
            countMajDiag[tab.major_diagnostic_category[i]][C[j]]+=tab[C[j]][i];
        }
    }
    log(openHealth.crossdoc2html(countMajDiag));
    
    log("<h3>ii. Proportion with psych comorbidity</i></h3>")
    
    log("... in progress ...")
    
    log("<h3>iii. Top secondary diagnoses (<i>episode_disease_category</i>)</h3>")
    
    var D = jmat.unique(tab.episode_disease_category);
    var C = ["er_recips","er_visits","ip_admits","ip_recips","recip_condition"];
    var countSecDiag={}
    D.map(function(d){
        countSecDiag[d]={};
        C.map(function(c){
            countSecDiag[d][c]=0;
        })
    }); 
    for(var i=0;i<docs.length;i++){
        for(var j=0;j<C.length;j++){
            countSecDiag[tab.episode_disease_category[i]][C[j]]+=tab[C[j]][i];
        }
    }
    log(openHealth.crossdoc2html(countSecDiag));
    
    
    divMsg.style.color="blue";
    4
})

})





