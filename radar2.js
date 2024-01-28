

function drawRadarChart(data1, data2, data3,data4) {

    function combineDataMax(data1, data2, data3, data4) {
        let combinedData = [];
    
        for (let i = 0; i < data1.length; i++) {
            let maxValue = Math.max(data1[i].value, data2[i].value, data3[i].value, data4[i].value);
            combinedData.push({ axis: data1[i].axis, value: maxValue });
        }
    
        return combinedData;
    }
    

    var data = combineDataMax(data1, data2, data3, data4);

    

    d3.select("#radarChart").select("svg").remove();

    const computeChartDimensions = () => {
        const width = Math.max(window.innerWidth / 5, 300); 
        const height = width; 
        return { width, height };
    };
    
    let { width, height } = computeChartDimensions();
    

    const margin = { top: 50, right: 200, bottom: 50, left: 200 };
    const radius = Math.min(width, height) / 2;
    

    const innerCircle = 2;
    const numLevels = 5; 
    const svg = d3.select("#radarChart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    const angleSlice = Math.PI * 2 / data1.length;


    const levels = 5; 
    const maxRadarValue = 10;
    const levelStep = maxRadarValue / levels;

    const rScale = d3.scaleLinear()
                 .range([0, radius])
                 .domain([0, maxRadarValue]); 
    

    for (let level = 0; level <= levels; level++) {
        let levelValue = levelStep * level;
    

        svg.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", rScale(levelValue))
            .style("fill", "none")
            .style("stroke", "grey")
            .style("stroke-opacity", 0.5)
            .style("stroke-width", "0.5px");
    

        svg.append("text")
            .attr("class", "legend")
            .style("font-size", "10px")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", -rScale(levelValue) - 5)
            .text(levelValue);
    }

    const axis = svg.selectAll('.axis')
                    .data(data1)
                    .enter()
                    .append('g')
                    .attr('class', 'axis');
    

    axis.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', (d, i) => radius * Math.cos(angleSlice * i - Math.PI/2))
        .attr('y2', (d, i) => radius * Math.sin(angleSlice * i - Math.PI/2))
        .attr('class', 'line')
        .style('stroke', 'grey')
        .style('stroke-opacity', '0.75')
        .style('stroke-width', '0.5px');


    


    axis.append('text')
    .attr('class', 'legend')
    .style('font-size', '11px')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('x', (d, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2)) 
    .attr('y', (d, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))
    .text(d => d.skill); 


    const radarLine = d3.lineRadial()
                        .curve(d3.curveLinearClosed)
                        .radius(d => d.value * radius/10)
                        .angle((d,i) => i * angleSlice);
    
    let path = svg.selectAll(".radar-chart-path").data([data1]);
    


    const duration = 1000; 


    const radarLineStart = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(0.1)
        .angle((d, i) => i * angleSlice);
    

    svg.append('path')
       .datum(data1)
       .attr('d', radarLineStart)
       .attr('d', radarLine)
       .style('stroke', 'red')
       .style('fill', 'red')
       .style('fill-opacity', 0.01);
    
    svg.append('path')
       .datum(data2)
       .attr('d', radarLineStart)
       .attr('d', radarLine)
       .style('stroke', 'blue')
       .style('fill', 'blue')
       .style('fill-opacity', 0.01);
    
    svg.append('path')
       .datum(data3)
       .attr('d', radarLineStart)
       .attr('d', radarLine)
       .style('stroke', 'green')
       .style('fill', 'green')
       .style('fill-opacity', 0.01);

    svg.append('path')
       .datum(data4)
       .attr('d', radarLineStart)
       .attr('d', radarLine)
       .style('stroke', 'purple')
       .style('fill', 'purple')
       .style('fill-opacity', 0.01);

    svg.append('path')
       .datum(data)
       .attr('d', radarLineStart)
       .style('stroke', 'orange')
       .style('fill', 'orange')
       .style('fill-opacity', 0.05)
       .transition()
       .duration(duration)
       .attr('d', radarLine)
       .style('stroke', 'pink').
       style('stroke-opacity', 0.1)
       .style('fill', 'pink')
       .style('fill-opacity', 0.5);
    


var colorScale = d3.scaleOrdinal()
.domain(["Member1", "Member2", "Member3", "Member4", "TeamScore"])
.range(["red", "blue", "green", "purple", "pink"]);


var legend = svg.append("g")
.attr("class", "legend")
.attr("transform", "translate(" + (radius + 60) + ", " + (-radius/4) + ")")
.selectAll("g")
.data(colorScale.domain())
.enter().append("g")
.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


legend.append("rect")
.attr("width", 18)
.attr("height", 18)
.style("fill", colorScale);


legend.append("text")
.attr("x", 24)
.attr("y", 9)
.attr("dy", ".35em")
.text(function(d) { return d; });



}




d3.csv("2321_data.csv").then(function(csvData) {

    csvData.sort((a, b) => a.alias.localeCompare(b.alias));

    let selectors = ['#selector1', '#selector2', '#selector3','#selector4'].map(selector => {
        let select = d3.select(selector).append('select').attr('class', 'select');
        select.selectAll('option')
              .data(csvData)
              .enter()
              .append('option')
              .text(d => d.alias)
              .attr("value", d => d.alias);


        let randomIndex = Math.floor(Math.random() * csvData.length);
        select.node().value = csvData[randomIndex].alias;

        return select;
    });

    function updateChart() {
        let dataSets = selectors.map(select => {
            let selected = select.node().value;
            let rowData = csvData.find(row => row.alias === selected);
            return Object.keys(rowData)
                         .filter(key => key !== "alias" && key !== "Average")
                         .map(key => ({ skill: key, value: +rowData[key] }));
        });

        drawRadarChart(...dataSets);
    }


    selectors.forEach(select => select.on('change', updateChart));


    updateChart();
});
