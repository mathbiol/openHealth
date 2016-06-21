console.log('preparing for no TCGA service :-(')
// extract data cached in localforage
// also at https://www.googledrive.com/host/0BwwZEXS3GesiTjlHSmlOcEJaeDA/featurescape/fun/noTcga.js
// for example
// $.getScript('https://www.googledrive.com/host/0BwwZEXS3GesiTjlHSmlOcEJaeDA/featurescape/fun/noTcga.js')

noTcga=function(){
  localforage.keys(function(x){

      console.log(x.length+' keys found in localforage')

      x = x.filter(function(k){
        return (k.match('biospecimen_slide')||k.match('clinical_patient'))
      })

      x.map(function(k){
        localforage.getItem(k,function(d){
          console.log('retrieving ',k,d)
          jmat.saveFile(JSON.stringify(d),k+'.json')
        })
      })
      
    })
}


if(typeof(jmat)=='undefined'){
  $.getScript('https://jonasalmeida.github.io/jmat/jmat.js',function(){
    noTcga()
  })
}else{
  noTcga()
}




/* 
  localforage.keys(function(x){
      console.log(x.length+' keys found in localforage')
      x = x.filter(function(k){
        return (k.match('biospecimen_slide')||k.match('clinical_patient'))
      })

      x.map(function(k){
        localforage.getItem(k,function(d){
          d
        })
      })
    })
*/
