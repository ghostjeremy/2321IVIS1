
var dataArray = [];


var colorScale = d3.scaleOrdinal()
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22"]); 


d3.csv('2321_data.csv').then(function(data) {

    data.forEach(function(row) {

        var obj = {
            alias: row.alias,
            Visualization: +row.Visualization,
            Statistic: +row.Statistic,
            Mathematics: +row.Mathematics,
            Programming: +row.Programming,
            ComputerGraphic: +row.ComputerGraphic,
            HCI: +row.HCI,
            Evaluation: +row.Evaluation,
            Communication: +row.Communication,
            AverageScore: +row.Average
        };

        dataArray.push(obj);
    });


    console.log(dataArray);


    drawChart("AverageScore");
});




function computeDimensions() {
    var windowWidth = window.innerWidth;
    var svgWidth = windowWidth * 3 / 5; 
    var svgHeight = windowWidth/5; 
    return { svgWidth, svgHeight };
}


var { svgWidth, svgHeight } = computeDimensions();


var margin = {top: 50, right: 50, bottom: 80, left: 50};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svgbar = d3.select("#barChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var g = svgbar.append("g");



var xbar = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    ybar = d3.scaleLinear().range([height, 0]).domain([0, 10]);
    

var yAxis = g.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(ybar));



function make_y_gridlines() {   
        return d3.axisLeft(ybar)
            .ticks(10) 
            .tickSize(-width) 
            .tickFormat("");
    }

g.append("g")         
    .attr("class", "grid")
    .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
    );


g.selectAll(".grid line")
    .attr("stroke", "lightgrey") 
    .attr("stroke-opacity", 0.7) 
    .attr("shape-rendering", "crispEdges") 
    .attr("stroke-dasharray", "2,2"); 





    function drawChart(column) {
        var data = dataArray.slice().sort(function(a, b) {
            return d3.descending(a[column], b[column]); 
        });
    
        xbar.domain(data.map(function(d) { return d.alias; }));
        ybar.domain([0, d3.max(data, function(d) { return Math.max(10, d[column]); })]);
    
        g.selectAll(".x.axis").remove(); 
    
        var xAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xbar));
    

        xAxis.selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "10px")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")
        .attr("opacity", 0) 
        .transition() 
        .duration(500)
        .attr("opacity", 1); 
    
        var bars = g.selectAll(".bar").data(data, function(d) { return d.alias; });
    

        bars.enter().append("rect")
            .attr("class", "bar")
            .merge(bars)
            .transition() 
            .duration(500)
            .attr("x", function(d) { return xbar(d.alias); })
            .attr("width", xbar.bandwidth())
            .attr("y", function(d) { return ybar(Math.min(10, d[column])); })
            .attr("height", function(d) { return height - ybar(Math.min(10, d[column])); })
            .style("fill", function(d) { return colorScale(column); });
    

        bars.exit()
            .transition()
            .duration(500)
            .attr("y", height)
            .attr("height", 0)
            .remove();
    }
    


xbar.padding(0.3); 


drawChart("AverageScore");

var columns = ["AverageScore","Visualization", "Statistic", "Mathematics",  "Programming", "ComputerGraphic", "HCI", "Evaluation", "Communication"];
var select = d3.select("#columnSelect")
    .on("change", function() {
        drawChart(this.value);
    });

select.selectAll("option")
    .data(columns)
    .enter().append("option")
    .attr("value", function(d) { return d; })
    .text(function(d) { return d; });


select.property("value", "AverageScore");
var selectedData;

