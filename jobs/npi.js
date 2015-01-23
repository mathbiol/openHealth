console.log("npi.js job")

getNpiInfoJob = function(){
    // it all happens here
    if(document.getElementById('openHealthJob')){
        getNpiInfoJob.buildUI('openHealthJob')
    }
    
}

getNpiInfoJob.buildUI=function(div0){
    if(typeof(div0)=='string'){div0=document.getElementById(div0)}
    div0.innerHTML='NPI: <input id=inputNpi value="1548485139" style="color:blue"> <button id="inputNpiButton">enter</button> <a href="https://data.medicare.gov/resource/3uxj-hea6" target=_blank>source</a><div id="getNpiInfoJobResults" style="color:blue"> ... click or press enter ... </div>';
    var bt = document.getElementById('inputNpiButton')
    bt.onclick=function(){
        openHealth.npi(inputNpi.value,function(x){
            var d = document.getElementById("getNpiInfoJobResults")
            var n = x.length
            if(n>0){
                x=openHealth.docs2tab(x)
                // sort attributes and remove
                var xx={}
                Object.getOwnPropertyNames(x).forEach(function(a){
                    console.log(a)
                    xx[a]={}; // to make sure it not be an Array
                    x[a].map(function(ai,i){
                        xx[a][i]=ai 
                    })
                })
                x=xx;
                d.innerHTML='<span style="color:green">'+n+' entries were found with NPI '+inputNpi.value+':</span>'
                d.appendChild(openHealth.crossdoc2html(x,"NPI "+inputNpi.value+".csv",true))
            } else {
                d.innerHTML='<span style="color:red">no entries were found with NPI '+inputNpi.value+':</span>'
            }
                
        })
    }



    4
}


if(!window.openHealth){
    var s = document.createElement('script')
    s.src="https://mathbiol.github.io/openHealth/openHealth.js"
    s.onload=function(){
        getNpiInfoJob()
    }
}else{
    getNpiInfoJob()
}



