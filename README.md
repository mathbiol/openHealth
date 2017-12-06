#### **OpenHealth**, a [web computing](https://en.wikipedia.org/wiki/Web_computing) sandbox to explore public health data.
Live tool at https://mathbiol.github.io/openHealth.

Published report: Almeida JS, Hajagos J, Crnosija I, T Kurc, M Saltz, J Saltz (2015) OpenHealth Platform for Interactive Contextualization of Population Health Open Data. Proceedings AMIA 2015: 297-305 [[PMID:26958160](https://www.ncbi.nlm.nih.gov/pubmed/26958160)].

To incorporate openHealth into your tool/analysis, all you need is 
``` HTML
<script src="https://mathbiol.github.io/openHealth/openHealth.js"></script>
```
or, if you have jQuery, 

``` javascript
$.getScript("https://mathbiol.github.io/openHealth/openHealth.js")
```
OpenHealth is a stand alone JavaScript library to help interoperating with public data sources of Health data. It creates a single object, **openHealth** in the DOM namespace following the same "namespace pollution" approach common in analytical environments such as Matlab and R.

### API examples

Full documentation in the [wiki](https://github.com/mathbiol/openHealth/wiki)

#### SODA services

A substancial number of Open Health Data resources are delivered through [Socrata](http://www.socrata.com/products/open-data-cloud-platform) Open Data API webs services ([SODA](http://dev.socrata.com/consumers/getting-started.html)).


* openHealth.soda("URL or URL reference",fun)
```` javascript
// deliver first 1,000 entries that data to the console
openHealth.soda("NY Medicare Inpatient") 
// deliver that data to a global variable NYmed
openHealth.soda("NY Medicare Inpatient",function(x){NYmed=x;console.log("done")})
// same data, using the URL directly
openHealth.soda("http://health.data.ny.gov/resource/2yck-xisk.json") 
// now get all 31,895 records in that dataset, in gulps of 10,000.
// the undefined second argument indicates no query constraints. It could be, for example, {limit:2000} 
openHealth.sodas("NY Medicare Inpatient",undefined,function(x){NYmed=x;console.log("done")})
// etc ...
// for list of URL references for SODA data see
openHealth.sodaData
````

### Application examples

<a href="http://mathbiol.github.io/openHealth/?jobs/pqiSuffolk.js" target=_blank><img src="http://mathbiol.github.io/openHealth/jobs/pqi.png"></a>

* <a href="http://mathbiol.github.io/openHealth/?jobs/pqiSuffolk.js" target=_blank>Preventable diseases in Suffolk County</a> (snapshot above, uses health.data.ny.gov and census.gov).
* <a href="http://mathbiol.github.io/openHealth/?jobs/sparcsSuffolk2012tabulateDiabetes.js" target=_blank>Hospital discharge of diabetic patients</a> (using health.data.ny.gov).
* <a href="https://mathbiol.github.io/openHealth/?jobs/npi.js" target=_blank>Extracting national data from the Unique professional ID assigned by NPPES (PNI), and crossing it with CCN numbers from affiliated Hospitals</a> (using data.medicare.gov).
* ...
