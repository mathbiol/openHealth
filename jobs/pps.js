console.log('pps master tool, using firebase')

openHealth.require(
    [
        'https://cdn.firebase.com/js/client/2.1.2/firebase.js'
    ], function(){
        console.log("firebase, loaded, loading pps data now")
        openHealth.getJSON("https://soda-189203.use1-2.nitrousbox.com/pps",function(x){
            openHealth.data.pps=x
            openHealth.data.ppsStr=x.map(function(xi){
                return JSON.stringify(xi)
            })
            // create UI
            var div0 = document.getElementById('openHealthJob')
            if(!div0){
                div0=document.createElement('div')
                div0.id='openHealthJob'
                document.body.appendChild(div0)
            }
            div0.innerHTML='<h4 style="color:green">Querying Janos\' PPS list</h4>(starting point for a user-maintained masterlist?)<div style="color:navy"><input id="ppsQueryInput" style="color:blue" size=50> type or paste query</div><div id="ppsQueryResults" style="color:blue"></div>'
            ppsQueryInput.onkeyup=function(){
                if(ppsQueryInput.value.length>3){
                    // query stringified array
                    var res=[]
                    openHealth.data.ppsStr.forEach(function(r,i){
                        if(r.match(new RegExp(ppsQueryInput.value,'i'))){
                            res.push(openHealth.data.pps[i])
                        }
                    })
                    ppsQueryResults.innerHTML='# results found: '+res.length
                    ppsQueryResults.appendChild(openHealth.crossdoc2html(
                        openHealth.docs2tab(res),
                        ppsQueryInput.value+'.csv'
                    ))
                }
                4

            }
        })

    }
)

