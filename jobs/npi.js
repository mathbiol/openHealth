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
                d.innerHTML='<span style="color:green">'+n+' entries were found with NPI '+inputNpi.value+', summary here, <a href="#rawData">raw data</a> further below:<div id="NpiInfoJobResultsSummary">...</div></span><hr><h3 id="rawData" style="color:green">Raw data:</h3>'
                d.appendChild(openHealth.crossdoc2html(x,"NPI "+inputNpi.value+".csv",true))
                // custumized summary
                var tableHTML = '<table id="NpiInfoJobResultsSummaryTable" style="color:navy;border-spacing:10px;border-collapse:separate;vertical-align:top">';
                tableHTML += '<tr style="vertical-align:top"><td>Name:</td><td id="npiName"></td><td id="npiNameMore"></td></tr>'
                tableHTML += '<tr style="vertical-align:top"><td>Address:</td><td id="npiAddress"></td><td id="npiAddressMore"></td></tr>'
                tableHTML += '<tr style="vertical-align:top"><td>Group:</td><td id="npiGroup"></td><td id="npiGroupMore"></td></tr>'
                tableHTML += '<tr style="vertical-align:top"><td>Primary Speciality:</td><td id="npi1arySpeciality"></td><td id="npi1arySpecialityMore"></td></tr>'
                tableHTML += '<tr style="vertical-align:top"><td>Hospital Affiliation:</td><td id="npiHospAfl"></td><td id="npiHospAflMore"></td></tr>'
                tableHTML += '</table>'
                NpiInfoJobResultsSummary.innerHTML=tableHTML
                //Name
                var nm = []
                for(var i=0;i<n;i++){
                    nm.push(x.frst_nm[i]+' '+x.mid_nm[i]+' '+x.lst_nm[i])
                }
                nm=openHealth.unique(nm)
                npiName.innerHTML=nm.join('<br>')
                if(nm.length>1){npiName.style.color="red"}
                else{npiName.style.color="blue"}
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

                // group
                var gr=[];
                for(var i=0;i<n;i++){
                    gr.push(x.org_pac_id[i])
                }
                gr=openHealth.unique(gr)
                npiGroup.innerHTML=gr.join('<br>')
                npiGroup.style.color="blue"

                // groupMore
                var grMore=[];
                if(gr.length>1){
                    for(var i=0;i<n;i++){
                        grMore.push(x.org_pac_id[i]+':'+x.org_lgl_nm[i])
                    }
                    grMore=openHealth.unique(grMore)
                    npiGroupMore.innerHTML=grMore.join('<br>')
                } else {
                    for(var i=0;i<n;i++){
                        grMore.push(x.org_lgl_nm[i]+'')
                    }
                    grMore=openHealth.unique(grMore)
                    npiGroupMore.innerHTML=grMore.join('<br>')
                }
                //Primary spciality
                var pr=[];
                for(var i=0;i<n;i++){
                    pr.push(x.pri_spec[i])
                }
                pr=openHealth.unique(pr)
                npi1arySpeciality.innerHTML=pr.join('<br>')
                npi1arySpeciality.style.color="blue"

                // Hospital affiliations
                var m = Object.getOwnPropertyNames(x).filter(function(a){return a.match('hosp_afl_lbn_')}).length
                var af=[];
                for(var i=0;i<n;i++){
                    for(var j=0;j<m;j++){
                        af.push('<button id="'+x['hosp_afl_'+(j+1)][i]+'">'+x['hosp_afl_lbn_'+(j+1)][i]+'</button>')
                    }
                }
                af=openHealth.unique(af)
                npiHospAfl.innerHTML=af.join('<br>')
                npiHospAfl.style.color="blue"
                var showHospInfo=function(that){
                    npiHospAflMore.innerHTML='<span style="color:red">retrieving information for CCN#'+that.id+'...</span>'
                    that.style.color="green"
                    openHealth.soda("https://data.medicare.gov/resource/xubh-q36u.json?provider_id="+that.id,function(x){
                        var pre = JSON.stringify(x,false,3)
                        pre=pre.replace(/\{\\\"address\\\"\:\\"/g,'').replace(/\\\"/g,'').replace(/city\:/,' ').replace(/state\:/,' ').replace(/\,zip\:[^\}]*\}/,x[0].zip_code)
                        npiHospAflMore.innerHTML='<a href="https://data.medicare.gov/resource/xubh-q36u" target=_blank>data.medicare.gov</a>:<pre>'+pre+'</pre>'
                    })
                    
                }
                hi=[]
                for(var h = 0; h<npiHospAfl.children.length; h=h+2){
                    npiHospAfl.children[h].onclick=function(){showHospInfo(this)}
                    
                }

                //http://data.medicare.gov/resource/xubh-q36u.json?provider_id=330043


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



