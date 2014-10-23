console.log("sparcsSuffolk2012.js loaded")
openHealth.getJSON.cache=false;console.log("cache disabled")

sparcsSuffolk2012={};
sparcsSuffolk2012.url=[
	"http://health.data.ny.gov/resource/u4ud-w55t.json?source_of_payment_1=Self-Pay&hospital_county=Suffolk"
	]
sparcsSuffolk2012.loadData=function(fun){
	if(!fun){fun=function(x){
		sparcsSuffolk2012.docs=x;
		sparcsSuffolk2012.tab=openHealth.docs2tab(sparcsSuffolk2012.docs)
		sparcsSuffolk2012.attrs=Object.getOwnPropertyNames(sparcsSuffolk2012.tab)
		console.log('.docs has '+sparcsSuffolk2012.docs.length+' entries')
	}}
	openHealth.sodas(sparcsSuffolk2012.url,false,fun)

	return this
}
s=sparcsSuffolk2012;

// load data

s.loadData(function(x){
	var xx=[];
	
	s.medicaid={};
	s.medicaid.docs=[];
	for(var i=0;i<x.length;i++){
		if(!x[i].source_of_payment_2){
			x[i].source_of_payment_2=x[i].source_of_payment_1;
			4
		}
		4
		if((x[i].source_of_payment_1=="Self-Pay")&&(x[i].source_of_payment_2=="Self-Pay")){
			x[i].source_of_payment=x[i].source_of_payment_1
			delete x[i].source_of_payment_1
			delete x[i].source_of_payment_2
			xx.push(x[i]);
		}
		else if(x[i].source_of_payment_1=="Medicaid"||x[i].source_of_payment_2=="Medicaid"){ // extract Medicaid reccords
			s.medicaid.docs.push(x[i])
		}
	}
	s.tab=openHealth.docs2tab(xx);
	s.docs=openHealth.tab2docs(s.tab);
	console.log(xx.length+" entries loaded from "+s.url)
	
	// clean docs

	s.medicaid.tab=openHealth.docs2tab(s.medicaid.docs)
	console.log(s.medicaid.docs.length+" Medicaid entries found")
	$("#openHealthJob").html('<p style="color:green">Ready to analyse the <b style="color:blue">'+s.docs.length+' Self-Pay</b> (as documented by source_of_payment_1 and 2) entries in the public data <a href="https://health.data.ny.gov/resource/u4ud-w55t">"Hospital Inpatient Discharges (SPARCS De-Identified): 2012"</a> for Suffolk county')
	$("#openHealthJob").append('<p> Count <select id="parm1"></select> against <select id="parm2"></select>: <input id="tabulate" type="button" value="Tabulate"></p>')
	s.Uparms = Object.getOwnPropertyNames(s.tab).sort();
	s.Uparms.map(function(u){
		$('#parm1').append('<option value="'+u+'">'+u+'</option>')
		$('#parm2').append('<option value="'+u+'">'+u+'</option>')
	})
	$("#openHealthJob").append('<hr><div id="allPatients"><h3>All Self-Pay patients</h3></div></hr><hr>');
	var bt = document.getElementById('tabulate')
	document.getElementById('parm1').value='ccs_procedure_description'
	document.getElementById('parm2').value='facility_name'
	bt.onclick=function(){
		$('#allPatients').html("<h3>All Self-Pay patients ("+s.docs.length+")</h3>")
		var selParm1 = document.getElementById('parm1').value;
		var selParm2 = document.getElementById('parm2').value;
		var Up1 = openHealth.unique(s.tab[selParm1])
		var Up2 = openHealth.unique(s.tab[selParm2])
		$('#allPatients').append(openHealth.crossdoc2html(
			openHealth.tabulateCount(s.tab,selParm1,selParm2,Up1,Up2),
			'counts of '+selParm1+' vs '+selParm2+' for all Self-Pay patients.csv'
		));
		
		
		//console.log(Date(),this)
	}

	return this
})



