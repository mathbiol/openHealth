console.log("sparcsSuffolk2012.js")

// https://health.data.ny.gov/Health/Hospital-Inpatient-Discharges-SPARCS-De-Identified/u4ud-w55t

// Hospital Inpatient Discharges (SPARCS De-Identified): 2012
//The Statewide Planning and Research Cooperative System (SPARCS) Inpatient De-identified dataset 
//contains discharge level detail on patient characteristics, diagnoses, treatments, services, and charges. 
// This data contains basic record level detail regarding the discharge; however the data does not contain 
// protected health information (PHI) under Health Insurance Portability and Accountability Act (HIPAA). 
//The health information is not individually identifiable; all data elements considered identifiable have been redacted. 
//For example, the direct identifiers regarding a date have the day and month portion of the date removed. 
// A downloadable file with this data is available for ease of download at: 
// https://health.data.ny.gov/Health/Hospital-Inpatient-Discharges-SPARCS-De-Identified/3m9u-ws8e. 
//For more information check out: http://www.health.ny.gov/statistics/sparcs/ or go to the “About” tab.


// openHealth.sodaAll("https://health.data.ny.gov/resource/u4ud-w55t.json?hospital_county=Suffolk",false,function(x){y=x;console.log("done")}