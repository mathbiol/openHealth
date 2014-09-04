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
    return url
}
}

openHealth.ini();