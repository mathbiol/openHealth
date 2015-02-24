console.log('open health tcga extension')

openHealth.tcga=(function(oh){
    var tcga={dt:{}}
    tcga.scope=function(){}
    tcga.call={}
    tcga.getText=function(url,fun){ // get TCGA file content
        if(!fun){fun=function(x){console.log(x);return 'done'}}
        var u0 = "https://tcga-data.nci.nih.gov/tcgafiles/ftp_auth/distro_ftpusers/anonymous/tumor/"
        if(!url.match(/^http/)){url=u0+url}
        //url = "https://script.google.com/macros/s/AKfycbxQM65ZKIKLhf_0W__BsaS9q_bof-O_ncPcnr5I8eii-q2tHGg/exec?url="+url
        var uid = "tcgaCall"+Math.random().toString().slice(2)
        tcga.call[uid]=fun
        url = "https://script.google.com/macros/s/AKfycbyU3x7wOEuxFbzzcuW6vcVMii9be3ujqyoaTpoWllQUONNU1j9a/exec?url="+url+"&callback=openHealth.tcga.call."+uid
        openHealth.getScript(url) // note that second argument, some fun, is not needed because this is being called with a JSONP-style callback
        return tcga
    }
    tcga.text2table=function(x,La,Lv){
        var xx = x.split(/\n/).map(function(xi){
            return xi.split(/\t/)
        })
        if(xx.slice(-1)[0].length==1&xx.slice(-1)[0][0].length==0){xx.pop(-1)} // last row is empty
        var n = xx.length, m=xx[0].length
        // get attr names from secon row
        var y={}
        if(!La){La=0} // default row with attribute names is the 1st
        if(!Lv){Lv=1} // default row with attribute names is the 2nd
        xx[La].forEach(function(xj,j){
            y[xj]=[]
            for(var i=Lv;i<n;i++){
                y[xj][i-Lv]=xx[i][j]
            }
        })
        return y
    }
    tcga.getTable=function(url,fun,La,Lv){ // get text with .getText and then parse it into a table
        tcga.getText(url,function(x){
            fun(tcga.text2table(x,La,Lv))
        })
        return tcga
    }
    tcga.sortPercent=function(x){ // sort percent values
        return openHealth.sort(x.map(function(x){if(x=="[Not Available]"){return -1}else{return parseInt(x)}}))[0].map(function(x){if(x==-1){return "[Not Available]"}else{return JSON.stringify(x)}})
    }
    return tcga
})(openHealth)