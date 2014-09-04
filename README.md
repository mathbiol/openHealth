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
This openHealth library is being developed as a helper in interoperating with public data sources for Health data. This JavaScript library creates a single object in the DOM namespace following the same "namespace pollution" approach common in analytical environments such as Matlab and R.

### API

#### SODA services

A substancial number of Open Health Data resources are delivered through [Socrata](http://www.socrata.com/products/open-data-cloud-platform) Open Data API webs services ([SODA](http://dev.socrata.com/consumers/getting-started.html)).


* openHealth.soda("URL or URL reference",fun)
```` javascript
openHealth.soda("NY Medicare Inpatient") // deliver that data to the console
openHealth.soda("NY Medicare Inpatient",function(x){NYmed=x;console.log("done") // deliver that data to a global variable NYmed
openHealth.soda("http://health.data.ny.gov/resource/2yck-xisk.json") // same data, using the URL directly
// for list of URL references for SODA data see
openHealth.sodaData
````