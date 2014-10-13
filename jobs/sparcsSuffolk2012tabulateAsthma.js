console.log("sparcsSuffolk2012.js loaded")

sparcsSuffolk2012={};
sparcsSuffolk2012.url="https://health.data.ny.gov/resource/u4ud-w55t.json?hospital_county=Suffolk&ccs_diagnosis_code=128";
sparcsSuffolk2012.loadData=function(fun){
	if(!fun){fun=function(x){
		sparcsSuffolk2012.docs=x;
		sparcsSuffolk2012.tab=openHealth.docs2tab(sparcsSuffolk2012.docs)
		sparcsSuffolk2012.attrs=Object.getOwnPropertyNames(sparcsSuffolk2012.tab)
		console.log('.docs has '+sparcsSuffolk2012.docs.length+' entries')
	}}
	openHealth.sodaAll(sparcsSuffolk2012.url,false,fun)

	return this
}
s=sparcsSuffolk2012;

// load data

s.loadData(function(x){
	s.tab=openHealth.docs2tab(x);
	s.docs=openHealth.tab2docs(s.tab);
	console.log(x.length+" entries loaded from "+s.url)
	
	// extract Medicaid only reccords
	s.medicaid={};
	s.medicaid.docs=[];
	s.docs.map(function(d){
		if(d.source_of_payment_1=="Medicaid"||d.source_of_payment_2=="Medicaid"){
			s.medicaid.docs.push(d)
		}
	})
	s.medicaid.tab=openHealth.docs2tab(s.medicaid.docs)
	console.log(s.medicaid.docs.length+" Medicaid entries found")
	$("#openHealthJob").html('<p style="color:green">Ready to analyse the <b style="color:blue">'+s.docs.length+' Asthma</b> (ccs_diagnosis_code=128) entries in the public data <a href="https://health.data.ny.gov/Health/Hospital-Inpatient-Discharges-SPARCS-De-Identified/u4ud-w55t">"Hospital Inpatient Discharges (SPARCS De-Identified): 2012"</a> for Suffolk county, <b style="color:blue">'+s.medicaid.docs.length+'</b> of which from Medicaid patients</p>')
	$("#openHealthJob").append('<h4> Cross-tabulation counts for all entries and also for Medicat entries only: </h4>')
	$("#openHealthJob").append('<p> Count <select id="parm1"></select> against <select id="parm2"></select><input id="tabulate" type="button" value="Tabulate"></p>')
	s.Uparms = Object.getOwnPropertyNames(s.tab).sort();
	s.Uparms.map(function(u){
		$('#parm1').append('<option value="'+u+'">'+u+'</option>')
		$('#parm2').append('<option value="'+u+'">'+u+'</option>')
	})
	$("#openHealthJob").append('<hr><div id="allPatients"><h3>All patients</h3></div></hr><hr><div id="medicaidPatients"><h3>Medicaid patients</h3></div></hr>');
	var bt = document.getElementById('tabulate')
	document.getElementById('parm1').value='ccs_procedure_description'
	document.getElementById('parm2').value='facility_name'
	bt.onclick=function(){
		$('#allPatients').html("<h3>All patients ("+s.docs.length+")</h3>")
		$('#medicaidPatients').html("<h3>Medicaid patients ("+s.medicaid.docs.length+")</h3>")
		var selParm1 = document.getElementById('parm1').value;
		var selParm2 = document.getElementById('parm2').value;
		var Up1 = openHealth.unique(s.tab[selParm1])
		var Up2 = openHealth.unique(s.tab[selParm2])
		$('#allPatients').append(openHealth.crossdoc2html(
			openHealth.tabulateCount(s.tab,selParm1,selParm2,Up1,Up2),
			'counts of '+selParm1+' vs '+selParm2+' for all patients.csv'
		));
		$('#medicaidPatients').append(openHealth.crossdoc2html(
			openHealth.tabulateCount(s.medicaid.tab,selParm1,selParm2,Up1,Up2),
			'counts of '+selParm1+' vs '+selParm2+' for Medicaid patients.csv'
		));
		
		//console.log(Date(),this)
	}

	return this
})



