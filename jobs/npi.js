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
    inputNpi.onkeyup=function(ev){
        if(ev.keyCode==13){bt.click()}
    }
    bt.onclick=function(){
        openHealth.npi(inputNpi.value,function(x){
            var d = document.getElementById("getNpiInfoJobResults")
            var n = x.length
            if(n>0){
                x=openHealth.docs2tab(x)
                // sort attributes and remove
                var xx={}
                Object.getOwnPropertyNames(x).forEach(function(a){
                    //console.log(a)
                    xx[a]={}; // to make sure it not be an Array
                    x[a].map(function(ai,i){
                        xx[a][i]=ai 
                    })
                })
                x=xx;
                d.innerHTML='<span style="color:green">'+n+' entries were found with NPI '+inputNpi.value+', summary:<div id="NpiInfoJobResultsSummary">...</div></span><hr>Raw data:'
                d.appendChild(openHealth.crossdoc2html(x,"NPI "+inputNpi.value+".csv",true))
                // custumized summary
                var tableHTML = '<table id="NpiInfoJobResultsSummaryTable" style="color:navy;border-spacing:10px;border-collapse:separate;vertical-align:top">';
                tableHTML += '<tr style="vertical-align:top"><td>Name:</td><td id="npiName"></td><td id="npiNameMore"></td></tr>'
                tableHTML += '<tr style="vertical-align:top"><td>Address:</td><td id="npiAddress"></td><td id="npiAddressMore"></td></tr>'
                tableHTML += '<tr style="vertical-align:top"><td>Group:</td><td id="npiGroup"></td><td id="npiGroupMore"></td></tr>'
                tableHTML += '</table>'
                NpiInfoJobResultsSummary.innerHTML=tableHTML
                //Name
                npiName.textContent=x.frst_nm[0]+' '+x.mid_nm[0]+' '+x.lst_nm[0]
                npiName.style.color="blue"
                npiNameMore.textContent=' NPI:'+inputNpi.value
                //Address
                var sz = []; // state and zip code
                for(var i=0;i<n;i++){
                    var z = ""+x.zip[i]
                    sz.push(x.st[i]+z.slice(0,5)+'-'+z.slice(5))
                }
                sz=openHealth.unique(sz)
                npiAddress.innerHTML=sz.join('<br>')
                npiAddress.style.color="blue"

                // Address More
                var addresses=[]
                for(var i=0;i<n;i++){
                    var z = ""+x.zip[i]
                    addresses.push(x.adr_ln_1[i]+', '+x.cty[i]+' '+x.st[i]+z.slice(0,5)+'-'+z.slice(5))
                }
                addresses=openHealth.unique(addresses)
                npiAddressMore.innerHTML=addresses.join('<br>')


                4


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



