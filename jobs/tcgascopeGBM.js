console.log('tcgascope.js loaded')

openHealth.require('tcga',function(){
    // GBM
    GBMfun=function(){
        // Extract AGE
        openHealth.tcga.dt.clinical_patient_gbm.age=openHealth.tcga.dt.clinical_patient_gbm.age_at_initial_pathologic_diagnosis.map(function(xi){
            return parseInt(xi)
        })
        // Extract SURVIVAL
        openHealth.tcga.dt.clinical_patient_gbm.survival=openHealth.tcga.dt.clinical_patient_gbm.days_to_death.map(function(xi,i){
            if(xi=="[Not Applicable]"){
                xi = openHealth.tcga.dt.clinical_patient_gbm.days_to_last_followup[i] // this is not ideal so we'll need to flag the vital status in teh analysis
            }
            return parseInt(xi)
        })
        openHealth.tcga.dt.clinical_patient_gbm.dead=openHealth.tcga.dt.clinical_patient_gbm.vital_status.map(function(xi){
            return xi=="Dead"
        })
        openHealth.tcga.dt.clinical_patient_gbm.score=openHealth.tcga.dt.clinical_patient_gbm.karnofsky_performance_score.map(function(xi,i){
            if(!parseFloat(xi)){return NaN}
            else{return parseInt(xi)}	// karnofsky_performance_score
        })

        



        // Create Docs
        var docs = openHealth.tab2docs(openHealth.tcga.dt.biospecimen_slide_gbm) // one doc per image
        // index patients by bcr code
        var patient = {}
        openHealth.tab2docs(openHealth.tcga.dt.clinical_patient_gbm).forEach(function(xi){
            patient[xi.bcr_patient_barcode]=xi
        })
        // add patient info to slide docs
        docs=docs.map(function(xi,i){
            var bcr=xi.bcr_sample_barcode.match(/[^-]+-[^-]+-[^-]+/)[0]
            var p = patient[bcr]
            if(p){
                xi.patient=bcr
                xi.age=p.age
                xi.dead=p.dead
                xi.survival=p.survival
                xi.gender=p.gender
                xi.race=p.race
                xi.score=p.score
                xi.karnofsky_performance_score=p.karnofsky_performance_score
            }else{
                console.log('patient '+bcr+' not found for slide '+i)
            }           
            return xi
        })
        // remove docs with no patient info
        var d = []
        docs.forEach(function(xi){
            if(xi.patient){
                d.push(xi)
            }
        })
        docs=d;
        openHealth.tcga.dt.gbmDocs=docs
        openHealth.tcga.dt.gbmTab=openHealth.docs2tab(openHealth.tcga.dt.gbmDocs)
        openHealthJob.innerHTML='<div id="openHealthJobMsg" style="color:red">TCGA Data retrieved, processing it ...</div><div id="openHealthJobDC"></div>'

        // ---- UI Dimensional scalling ---
        openHealth.getScript(["//cdnjs.cloudflare.com/ajax/libs/d3/3.4.11/d3.min.js","https://www.google.com/jsapi","//square.github.io/crossfilter/crossfilter.v1.min.js","//dc-js.github.io/dc.js/js/dc.js","//dc-js.github.io/dc.js/css/dc.css"],function(){ // after satisfying d3 dependency
            openHealthJobMsg.textContent="Assembling charts ..."
            openHealthJobDC.innerHTML='<table><tr><td style="vertical-align:top"><table><tr><td style="vertical-align:top"><div>% Necrotic Cells:</div><div id="percent_necrosis"></div><div>% Tumor Nuclei:</div><div id="percent_tumor_nuclei"></div><div>Karnofsky Score:</div><div id="karnofsky_performance_score"></div></td><td style="vertical-align:top"><div>% Tumor Cells:</div><div id="percent_tumor_cells"></div><div>Location:</div><div id="section_location"></div><div>Gender:</div><div id="gender"></div><div>Race:</div><div id="race"></div><div id="slideImagesHeader">Slide Images:</div><div id="slideImages"></div></td><td style="vertical-align:top"><div>% Stromal Cells:</div><div id="percent_stromal_cells"></div><div>% Lymphocyte Infiltration:</div><div id="percent_lymphocyte_infiltration"></div><div>% Monocyte Infiltration:</div><div id="percent_monocyte_infiltration"></div><div>% Neutrophil Infiltration:</div><div id="percent_neutrophil_infiltration"></div><div id="tcgaPatientsHeader">TCGA patients:</div><div id="tcgaPatients"></div></td></tr></table></td><td style="vertical-align:top"><h3>GBM Tumor progression</h3><div id="tumorProgression">...</div>Legend: color indicates Karnofsky performance score diameter; indicates number of images</td></tr></table>'
            var docs = openHealth.tcga.dt.gbmDocs
            var tab = openHealth.tcga.dt.gbmTab

             C = {}, D={}, G={}, U={}, R={}

            /*
            var scaleVal=function(v){
            	return Math.log10(v+1)
            }
            var unScaleVal=function(v){
            	return Math.pow(10,parseFloat(v))-1
            }
            */
            
            var cf=crossfilter(docs);
            
			/*
			// % NECROSIS
            D.percent_necrosis=cf.dimension(function(d){
                return d.percent_necrosis
            })
            R.percent_necrosis={}
            U.percent_necrosis = openHealth.tcga.sortPercent(openHealth.unique(tab.percent_necrosis))
            //openHealth.sort(openHealth.unique(tab.percent_necrosis.map(function(x){if(x=="[Not Available]"){return -1}else{return parseInt(x)}})))[0].map(function(x){if(x==-1){return "[Not Available]"}else{return JSON.stringify(x)}})
            U.percent_necrosis.forEach(function(u){
                R.percent_necrosis[u]={c:0}
            })
            G.percent_necrosis=D.percent_necrosis.group().reduce(
              // reduce in
		      function(p,v){
		      	R.percent_necrosis[v.percent_necrosis].c+=1
		        return R.percent_necrosis[v.percent_necrosis].c
		      },
		      // reduce out
		      function(p,v){
		      	R.percent_necrosis[v.percent_necrosis].c-=1
		        return R.percent_necrosis[v.percent_necrosis].c
		      },
			  // ini
			  function(){return 0}
            )
            
            
            C.percent_necrosis=dc.rowChart("#percent_necrosis")
            	.width(300)
            	.height(U.percent_necrosis.length*15)
           		.dimension(D.percent_necrosis)
           		.group(G.percent_necrosis)
           		.ordering(function(d){
           			if(d.key=="[Not Available]"){return -1}
           			else{return parseInt(d.key)}
           		})
           		//.title(function(d){
           		//	return d.key+="%"
           		//})
			*/

			var addRowChard=function(parm,Uparm,fun){
            D[parm]=cf.dimension(function(d){
                return d[parm]
            })
            R[parm]={}
            if(!Uparm){
            	U[parm] = openHealth.tcga.sortPercent(openHealth.unique(tab[parm]))
            } else {
            	U[parm] = Uparm
            }
            U[parm].forEach(function(u){
                R[parm][u]={c:0}
            })
            G[parm]=D[parm].group().reduce(
              // reduce in
		      function(p,v){		      	
		      	return R[parm][v[parm]].c+=1
		      },
		      // reduce out
		      function(p,v){
		      	return R[parm][v[parm]].c-=1
		      },
			  // ini
			  function(){return 0}
            )
            C[parm]=dc.rowChart("#"+parm)
            	.width(300)
            	.height(40+U[parm].length*15)
           		.dimension(D[parm])
           		.elasticX(true)
           		.group(G[parm])
           		.ordering(function(d){
           			if(d.key=="[Not Available]"){return -1}
           			else{return parseInt(d.key)}
           		})
           		//.xAxis().tickFormat(function(v){return unScaleVal(v)})
           		
           		//.title(function(d){
           		//	return d.key+="%"
           		//})
           	if(fun){
				fun(C[parm])
			}

			}

			

			

			addRowChard('percent_necrosis')
			addRowChard('percent_tumor_cells')
			addRowChard('percent_stromal_cells')
			addRowChard('percent_tumor_nuclei')
			addRowChard('percent_lymphocyte_infiltration')
			addRowChard('percent_monocyte_infiltration')
			addRowChard('percent_neutrophil_infiltration')
			addRowChard('section_location',openHealth.unique(openHealth.tcga.dt.gbmTab.section_location))
			addRowChard('gender',openHealth.unique(openHealth.tcga.dt.gbmTab.gender))
			addRowChard('race',openHealth.unique(openHealth.tcga.dt.gbmTab.race))
			
			
			C.tumorProgression = dc.bubbleChart("#tumorProgression");
			D.tumorProgression = cf.dimension(function(d){return d.patient})
			R.tumorProgression={}
			openHealth.unique(openHealth.tcga.dt.gbmTab.patient).map(function(u){
				R.tumorProgression[u]={c:0}
			})
			G.tumorProgression = D.tumorProgression.group().reduce(
				// reduce in
		      function(p,v){
		      	return R.tumorProgression[v.patient].c+=1
		      },
		      // reduce out
		      function(p,v){
		      	return R.tumorProgression[v.patient].c-=1
		      },
			  // ini
			  function(){return 0}
       		)

       		C.tumorProgression
       			.width(1000)
       			.height(1000)
       			.dimension(D.tumorProgression)
       			.group(G.tumorProgression)
       			.keyAccessor(function(v){ // <-- X values
       				return patient[v.key].survival
       			})
       			.valueAccessor(function(v){ // <-- Y values
       				return patient[v.key].age
       			})
       			.radiusValueAccessor(function (v) {
       				return v.value/2
       			})
       			.x(d3.scale.linear())
       			.y(d3.scale.linear())
       			.elasticY(true)
        		.elasticX(true)
        		.xAxisLabel('Survival (days)')
				.yAxisLabel('Age (years)')
				.colors(d3.scale.linear().domain([-1,0,40,80,90,100]).range(["silver","red","red","yellow","green","green"]))
				.colorAccessor(function (d,i) {
					var v = patient[d.key].score
					if(isNaN(v)){return -1}
					else{return v}
				})

					
			addRowChard(
				'karnofsky_performance_score',
				openHealth.unique(openHealth.tcga.dt.gbmTab.karnofsky_performance_score),
				function(CRT){
					CRT
						.colors(d3.scale.linear().domain([-1,0,40,80,90,100]).range(["silver","red","red","yellow","green","green"]))
						.colorAccessor(function (d,i) {
							if(i==0){ // things done a single time
								console.log('list images and patients')
								var nPatients = 0, nSlides=0
								tcgaPatients.innerHTML=""
								C.tumorProgression.data().forEach(function(d){
									if(d.value>0){
										nPatients++
										var p = document.createElement('p')
										p.innerHTML=nPatients+') <a href="http://www.cbioportal.org/case.do?case_id='+d.key+'&cancer_study_id=gbm_tcga" target=_blank>'+d.key+'</a>'
										tcgaPatients.appendChild(p)

									}
									nPatients+=(d.value>0)
									nSlides+=d.value
								})
								
								tcgaPatientsHeader.textContent='TCGA patients ('+nPatients+'):'
								slideImagesHeader.textContent='Slide Images ('+nSlides+'):'
								
								
							}
							var v = parseFloat(d.key)
							if(isNaN(v)){return -1}
							else{return v}
						})
				}
			)		


           	
            dc.renderAll();

            $('.dc-chart g.row text').css('fill','black')
            var AddXAxis = function (chartToUpdate, displayText){
            	chartToUpdate.svg()
                .append("text")
                .attr("class", "x-axis-label")
                .attr("text-anchor", "right")
                .attr("x", chartToUpdate.width()*0.7)
                .attr("y", chartToUpdate.height()-0)
                .text(displayText);
			}
            AddXAxis(C.percent_necrosis,'# found')
            AddXAxis(C.percent_tumor_cells,'# found')
            AddXAxis(C.percent_stromal_cells,'# found')
            AddXAxis(C.percent_tumor_nuclei,'# found')
            AddXAxis(C.percent_lymphocyte_infiltration,'# found')
            AddXAxis(C.percent_monocyte_infiltration,'# found')
            AddXAxis(C.percent_neutrophil_infiltration,'# found')
            AddXAxis(C.section_location,'# found')
            AddXAxis(C.gender,'# found')
            AddXAxis(C.race,'# found')
            // clear bootstrap to make room
            document.getElementById('openHealth').className=""

            
            

            

            openHealthJobMsg.textContent=""



        })

                


    }

    get_biospecimen_slide_gbm=function(){
        //localforage.removeItem('biospecimen_slide_gbm')
        localforage.getItem('biospecimen_slide_gbm',function(x){
            if(!x){
                openHealth.tcga.getTable("gbm/bcr/biotab/clin/nationwidechildrens.org_biospecimen_slide_gbm.txt",
                function(x){
                    openHealth.tcga.dt['biospecimen_slide_gbm']=x
                    localforage.setItem('biospecimen_slide_gbm',x)
                    console.log('biospecimen_slide_gbm loaded from TCGA and cached for this machine')
                    GBMfun()
                },
                0,
                2
                )
            } else{
                console.log('biospecimen_slide_gbm retrieved from cache')
                openHealth.tcga.dt['biospecimen_slide_gbm']=x
                GBMfun()
            }

        })
    }




    localforage.getItem('clinical_patient_gbm',function(x){
        //localforage.removeItem('clinical_patient_gbm')
        if(!x){
            openHealth.tcga.getTable("gbm/bcr/biotab/clin/nationwidechildrens.org_clinical_patient_gbm.txt",
              function(x){
                openHealth.tcga.dt['clinical_patient_gbm']=x
                localforage.setItem('clinical_patient_gbm',x)
                console.log('clinical_patient_gbm loaded from TCGA and cached for this machine')
                get_biospecimen_slide_gbm()
              },
              1,
              3
            )
        } else{
            console.log('clinical_patient_gbm retrieved from cache')
            openHealth.tcga.dt['clinical_patient_gbm']=x
            get_biospecimen_slide_gbm()
        }

    })
    
})