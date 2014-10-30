console.log("chronicERSuffolk2012tabulate.js loaded")

ChronicERSuffolk2012={};
ChronicERSuffolk2012.url="https://health.data.ny.gov/resource/2yck-xisk.json?county=Suffolk%20";
ChronicERSuffolk2012.loadData=function(fun){
	if(!fun){fun=function(x){
		ChronicERSuffolk2012.docs=x;
		ChronicERSuffolk2012.tab=openHealth.docs2tab(ChronicERSuffolk2012.docs)
		ChronicERSuffolk2012.attrs=Object.getOwnPropertyNames(ChronicERSuffolk2012.tab)
		console.log('.docs has '+ChronicERSuffolk2012.docs.length+' entries')
	}}
	openHealth.sodaAll(ChronicERSuffolk2012.url,false,fun)

	return this
}
s=ChronicERSuffolk2012;

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
	s.medicaid.docs=s.docs // <-- reset
	s.medicaid.tab=openHealth.docs2tab(s.medicaid.docs)
	console.log(s.medicaid.docs.length+" Medicaid entries found")
	$("#openHealthJob").html('<p style="color:green">Ready to analyse the <b style="color:blue">'+s.docs.length+' Suffolk county records</b> found in [<a href="https://health.data.ny.gov/resource/2yck-xisk.json" target=_blank>2yck-xisk</a>], the public data for "<a href="https://health.data.ny.gov/resource/2yck-xisk" target=_blank>Medicaid Chronic Conditions, Inpatient Admissions and Emergency Room Visits by Zip Code: Beginning 2012</a>".</p>')
	$("#openHealthJob").append('<h4> Cross-tabulation sums for:</h4>')
	$("#openHealthJob").append('<p> Sum <select id="parmSum" style="color:blue"></select> for <select id="parm1"></select> against <select id="parm2"></select> <input style="background-color:yellow;color:blue" id="tabulate" type="button" value="Tabulate"></p>')
	s.Uparms = Object.getOwnPropertyNames(s.tab).sort();
	s.Uparms.map(function(u){
		$('#parmSum').append('<option value="'+u+'">'+u+'</option>')
		$('#parm1').append('<option value="'+u+'">'+u+'</option>')
		$('#parm2').append('<option value="'+u+'">'+u+'</option>')
	})
	$("#openHealthJob").append('<hr><div id="allPatients"><h3>Summation:</h3></div></hr><hr><div id="medicaidPatients"><h3># reccords used</h3></div></hr>');
	var bt = document.getElementById('tabulate')
	document.getElementById('parmSum').value='er_visits'
	document.getElementById('parm1').value='zip_code'
	document.getElementById('parm2').value='major_diagnostic_category'
	bt.onclick=function(){
		var parmSum = document.getElementById('parmSum').value;
		var selParm1 = document.getElementById('parm1').value;
		var selParm2 = document.getElementById('parm2').value;
		var Up1 = openHealth.unique(s.tab[selParm1])
		var Up2 = openHealth.unique(s.tab[selParm2])
		$('#allPatients').html("<h3>Summation ("+openHealth.sum(s.tab[parmSum])+")</h3>")
		$('#medicaidPatients').html("<h3># records used ("+s.medicaid.docs.length+")</h3>")
		$('#allPatients').append(openHealth.crossdoc2html(
			openHealth.tabulateSum(s.tab,selParm1,selParm2,parmSum,Up1,Up2),
			'sum of '+parmSum+' of '+selParm1+' vs '+selParm2+' .csv'
		));
		$('#medicaidPatients').append(openHealth.crossdoc2html(
			openHealth.tabulateCount(s.medicaid.tab,selParm1,selParm2,Up1,Up2),
			'counting reccords for '+selParm1+' vs '+selParm2+' .csv'
		));
		
		//console.log(Date(),this)
	}

	return this
})



