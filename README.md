#### **OpenHealth**, a [web computing](https://en.wikipedia.org/wiki/Web_computing) sandbox to explore public health data.
Live tool at https://mathbiol.github.io/openHealth.

To incorporate openHealth into your tool/analysis, all you need is 
``` HTML
<script src="https://mathbiol.github.io/openHealth/openHealth.js"></script>
```
or, if you have jQuery, 

``` javascript
$.getScript("https://mathbiol.github.io/openHealth/openHealth.js")
```
OpenHealth is a stand alone JavaScript library to help interoperating with public data sources of Health data. It creates a single object, **openHealth** in the DOM namespace following the same "namespace pollution" approach common in analytical environments such as Matlab and R.

### API example

Full documentation will be developed in the [wiki](https://github.com/mathbiol/openHealth/wiki)

#### SODA services

A substancial number of Open Health Data resources are delivered through [Socrata](http://www.socrata.com/products/open-data-cloud-platform) Open Data API webs services ([SODA](http://dev.socrata.com/consumers/getting-started.html)).


* openHealth.soda("URL or URL reference",fun)
```` javascript
// deliver that data to the console
openHealth.soda("NY Medicare Inpatient") 
// deliver that data to a global variable NYmed
openHealth.soda("NY Medicare Inpatient",function(x){NYmed=x;console.log("done")})
// same data, using the URL directly
openHealth.soda("http://health.data.ny.gov/resource/2yck-xisk.json") 
// for list of URL references for SODA data see
openHealth.sodaData
````
