// https://www.health.ny.gov/health_care/medicaid/redesign/dsrip_performance_data/
// Generic Dashboar with real-time analytics of DSRIP data sources
// we'll use this exercise to advance the analytics environment

openHealth.getScript("https://cdnjs.cloudflare.com/ajax/libs/d3/3.4.11/d3.min.js",function(){ // after satisfying d3 dependency

dsrip=(function(){
    var y={ // dsrip object returned at the end
        dt:{},
    }
    //prepare stout
    var println = openHealth.log;
    var divLog = openHealth.createLog(); // creates div for html printout
    var divD3 = document.createElement('div');divD3.id="openHealthD3";
    document.getElementById("openHealth").appendChild(divD3);
    println('<h4 style="color:blue">DSRIP dashboard<h4>');
    println("Let's query all [SODA](http://dev.socrata.com/consumers/getting-started.html) data sources listed by [DSRIP](https://www.health.ny.gov/health_care/medicaid/redesign/dsrip_performance_data/) and see what we get.");
    //list DSRIP data sources
    var D = Object.getOwnPropertyNames(openHealth.sodaData);
    var j=0;
    for(var i=D.length-1;i>=0;i--){
        if(!D[i].match('DSRIP')){
            D.splice(i,1);
        } else {
            var Lid = String.fromCharCode(65+j);
            println('<button style="color:navy" onclick="dsrip.dataButton(this)">'+Lid+'</button> ['+D[i]+']('+openHealth.sodaData[D[i]]+')');
            y.dt[Lid]={
                url:D[i],
                selected:false
            }
            j++;
        }
    }
    
    y.dataButton=function(bt){
        var dt = dsrip.dt[bt.textContent];
        if(dt.bt){dt.bt = bt}; // button just pressed
        if(!dt.selected){dt.selected=true}else{dt.selected=false} // switch
        if(dt.selected){ // data selected for processing?
            bt.style.color="red";
            bt.style.backgroundColor="yellow";
            var fun = function (x){
                dt.attr=Object.getOwnPropertyNames(x[0]); // attributes
                dsrip.updateDash(bt.textContent); // update D3 forced graph dashboad
            }
            openHealth.soda2(dt.url,{limit:1},fun)
        } else {
            bt.style.color="green"
            bt.style.backgroundColor="CCFF99";
        }
    }
    
    y.updateDash=function(id){
        var dt = dsrip.dt[id];
        dsrip.graph={
          nodes:[{name:id,group:1}],
          links:[]
        }
        // add attributes and links
        dt.attr.forEach(function(a,i){
          dsrip.graph.nodes.push({name:a,group:2})
          dsrip.graph.links.push({"source":0,"target":i+1,"value":1})
        })
        graph=dsrip.graph;
        4
        var width = 960,height = 500;
        var color = d3.scale.category20();
        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .size([width, height]);
        var svg = d3.select(document.getElementById("openHealthD3")).append("svg")
            .attr("width", width)
            .attr("height", height)
        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();
    
    
    var link = svg.selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });
      
      var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);  


  node.append("title")
      .text(function(d) { return d.name; });

  node.append("text")
    .attr("x", 5)
    .attr("dy", ".35em")
    .text(function( d ) { return d.name })
    .style("font-size","8px");

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
  
  
  
  jQuery('.node').css('stroke','#fff')
  jQuery('.node').css('stroke-width','1.5px')
  jQuery('.link').css('stroke','#999')
  jQuery('.link').css('stroke','.6')
  
        4
    }
    4
    
    return y
})();

});