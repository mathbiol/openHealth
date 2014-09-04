console.log("openHealth loaded")

openHealth=function(){}

openHealth.buildUI=function(){}

openHealth.getScript=function(src,fun){
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
    
    
}