//Manager of the chart related to this id
function init(id){
  document.getElementById('toggled').style = 'display: none;';
  document.getElementById('toggled2').style = 'display: none;';
  d3.selectAll("svg").remove();
  bMonthlyChart = false;
  selectedYr = -1
  curId = id;
}
function renderChart(id){
  //refresh all related charts

  //FIXME: It takes so long to use consumptionOnIntervalById on yearly level

  init(id);

  $.getJSON("/consumptionOnIntervalById/"+curId+"/2012-01-01/2018-01-01/month").then(function(result){

    var element = document.getElementById('toggled');
    if(Object.keys(result).length != 0){
      element.style.display = '';
      drawYearlyChart(parseYearlyData(result));
    }
    else{
      console.log(curId + "doesn't have data");
    }
  });
}

function drawYearlyChart(chData){

  //Line Chart 
  let chartSVG = d3.select('#lineChartWrapper')
    .append("svg")
    .attr("width",canvasLineW)
    .attr("height", canvasLineH)

  chartSVG.append('g')
          .classed('lineChart',true)
          .attr('transform',"translate(" + margin.left + "," + margin.top + ")");


	// set range
	let x = d3.scaleLinear().range([0, wLine]),
	    y = d3.scaleLinear().range([hLine, 0]);
      color = d3.scaleOrdinal(d3.schemeCategory10);

  // set domain
  x.domain([1,12]);
  y.domain([0,d3.max(chData,function(c){return d3.max(c.vals,function(d){return d.val})})]);
  color.domain(chData.map(function(d){return d.yr;}));

  // Yr indicator
  d3.select('svg g.lineChart')
    .append('text')
    .attrs({'id': 'yrLabel', 'x': 70, 'y': 250})
    .styles({'font-size': '100px', 'font-weight': 'bold', 'fill': '#ddd'});

  //Render Axis
  d3.select('svg g.lineChart')
    .append("g")
    .attr("class", "axis xAxis")
    .attr("transform", "translate(10," + hLine+ ")")
    .call(d3.axisBottom(x));

  d3.select('svg g.lineChart')
    .append("g")
    .attr("class", "axis yAxis")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "translate(" + 100 +",0)")
    .text("Energy, kWh");

  let line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.val); });


  let lines= d3.select('svg g.lineChart').selectAll(".yr-line")
    .data(chData)
    .enter().append("g")
    .attr("class", "yr-line")
    .attr("id",function(d){
      return "yr-line" + d.yr;
    })
    .on('click',function(d){
      selectedYr = d.yr;
      updateYearlyChart();
    })
    .on('mouseover', function(d) {
      d3.select('#yrLabel')
        .text(d.yr)
        .transition()
        .style('opacity', 1);
    })
    .on('mouseout', function(d) {
      d3.select('#yrLabel')
        .transition()
        .duration(1500)
        .style('opacity', 0);
    });

  lines.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.vals); })
        .style("stroke", function(d) { return color(d.yr); })
    

  let barSVG = d3.select('#barChartWrapper')
      .append("svg")
      .attr("width",canvasBarW)
      .attr("height",canvasBarH)

  let barY = d3.scaleBand().range([hBar,0]).padding(0.3);
  //FIXME: Can use other scale method
  let barX = d3.scaleLinear().range([0,wBar]);

  barSVG.append('g')
        .classed('barChart',true)
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  barY.domain(chData.map(function(d){return d.yr;}))
  barX.domain([0,d3.max(chData,function(d){return d.sum;})])

  let bars = d3.select('svg g.barChart').selectAll(".yr-bar")
  .data(chData)
  .enter()
  .append("g")
  .attr("class","yr-bar")

  bars.append("rect")
  .attr("y", function(d) { return barY(d.yr); })
  .attr("width", function(d) {return barX(d.sum); } )
  .attr("height", barY.bandwidth())
  .attr("fill", function(d) {return color(d.yr);})
  .on('click',function(d){
    selectedYr = d.yr;
    updateYearlyChart();
  })
  .on('mouseover', function(d) {
    d3.select('#yrLabel')
      .text(d.yr)
      .transition()
      .style('opacity', 1);
  })
  .on('mouseout', function(d) {
    d3.select('#yrLabel')
      .transition()
      .duration(1500)
      .style('opacity', 0);
  })
  
  bars.append('text')
   .text(function(d){
    return d.yr + ": " + d.sum;
   })
  .style('font-size','20px')
  .attr('x',10)
  .attr('y',function(d){
    return (barY(d.yr) + barY.bandwidth()/2);
  });


  function makeBarYAxis(g){
    g.call(d3.axisLeft(barY));
    g.select(".domain").remove();
  }
   barSVG.append("g").call(makeBarYAxis);
   //barSVG.append("g").call(d3.axisLeft(barY));
}

function updateYearlyChart(){
  //means some year been selected
  d3.selectAll('.yr-line')
  .classed('active',function(d){
    return selectedYr === d.yr;
  })

  if(!bMonthlyChart){
    initMonthlyChart();
  }
  else{
    d3.select("#MonthlylineChartWrapper").select("svg").remove();
  }

  updateMonthlyChart();

}
function initMonthlyChart(){
  var element = document.getElementById('toggled2');
  element.style = '';
  bMonthlyChart = true; 
}
function updateMonthlyChart(){
  d3.select('#selectedYr').text(selectedYr);

  function yrRange(yr){
    return "/"+yr+"-01-01/"+(yr+1)+"-01-01/day";
  }

  $.getJSON("consumptionOnIntervalById/"+curId+yrRange(parseInt(selectedYr))).then(function(result){
    let chData = parseMonthlyData(result[selectedYr]);
    console.log(chData);

    let chartSVG = d3.select('#MonthlylineChartWrapper')
      .append("svg")
      .attr("width",canvasLineW)
      .attr("height",canvasLineH)

  chartSVG.append('g')
          .classed('lineChart2',true)
          .attr('transform',"translate(" + margin.left + "," + margin.top + ")");

	let x = d3.scaleLinear().range([0, wLine]),
	    y = d3.scaleLinear().range([hLine, 0]);
      color = d3.scaleOrdinal(d3.schemeCategory10);

  // set domain
  x.domain([1,31]);
  y.domain([50,d3.max(chData,function(c){return d3.max(c.vals,function(d){return d.val})})]);
  color.domain(chData.map(function(d){return d.month;}));

  // month indicator
  d3.select('svg g.lineChart2')
    .append('text')
    .attrs({'id': 'mLabel', 'x': 70, 'y': 400})
    .styles({'font-size': '80px', 'font-weight': 'bold', 'fill': '#ddd'});

  //Render Axis
  d3.select('svg g.lineChart2')
    .append("g")
    .attr("class", "axis xAxis")
    .attr("transform", "translate(10," + hLine+ ")")
    .call(d3.axisBottom(x));

  d3.select('svg g.lineChart2')
    .append("g")
    .attr("class", "axis yAxis")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "translate(" + 100 +",0)")

  let line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.val); });


  let lines= d3.select('svg g.lineChart2').selectAll(".m-line")
    .data(chData)
    .enter().append("g")
    .attr("class", "m-line")
    .attr("id",function(d){
      return "m-line" + d.month;
    })
    .on('mouseover', function(d) {
      d3.select('#mLabel')
        .text(months[d.month])
        .transition()
        .style('opacity', 1);
    })
    .on('mouseout', function(d) {
      d3.select('#mLabel')
        .transition()
        .duration(1500)
        .style('opacity', 0);
    });

  lines.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.vals); })
        .style("stroke", function(d) { return color(d.month); })

  let barSVG = d3.select('#MonthlybarChartWrapper')
      .append("svg")
      .attr("width",canvasBarW)
      .attr("height",canvasBarH)

  let barY = d3.scaleBand().range([hBar,0]).padding(0.1);
  //FIXME: Can use other scale method
  let barX = d3.scaleLinear().range([0,wBar]);

  barSVG.append('g')
        .classed('barChart2',true)
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  barY.domain(chData.map(function(d){return d.month;}))
  barX.domain([0,d3.max(chData,function(d){return d.sum;})])

  let bars = d3.select('svg g.barChart2').selectAll(".yr-bar2")
  .data(chData)
  .enter()
  .append("g")
  .attr("class","yr-bar2")

  bars.append("rect")
  .attr("y", function(d) { return barY(d.month); })
  .attr("width", function(d) {return barX(d.sum); } )
  .attr("height", barY.bandwidth())
  .attr("fill", function(d) {return color(d.month);})
  .on('mouseover', function(d) {
    d3.select('#mLabel')
      .text(months[d.month])
      .transition()
      .style('opacity', 1);
  })
  .on('mouseout', function(d) {
    d3.select('#mLabel')
      .transition()
      .duration(1500)
      .style('opacity', 0);
  })
  
  bars.append('text')
   .text(function(d){
    return months[d.month] + ": " + d.sum;
   })
  .style('font-size','15px')
  .attr('x',10)
  .attr('y',function(d){
    return (barY(d.month)+10 + barY.bandwidth()/2);
  });


  function makeBarYAxis(g){
    g.call(d3.axisLeft(barY));
    g.select(".domain").remove();
  }
   barSVG.append("g").call(makeBarYAxis);
  })

   //barSVG.append("g").call(d3.axisLeft(barY));
}
