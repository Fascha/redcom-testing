/**
 * Created by Fascha on 23.09.2016.
 */
function drawTimeSeries(data_for_timeseries){

    d3.select("#timeseries").select("svg").remove();

    // var width = 1200,
    //     height = 360;

    var margin = {top: 20, right: 40, bottom: 50, left: 40},
        width = 960 - margin.left - margin.right,
        height = 360 - margin.top - margin.bottom;

    var startTime;

    d3.json(data_for_timeseries, function(error, data) {

        data.sort(function(a,b) {return a.created_utc - b.created_utc});

        var startDate,
            endDate,
            minScore,
            maxScore;


        startTime = d3.min(data, function(d) { return d.created_utc; });


        startDate = new Date(d3.min(data, function(d) { return d.created_utc - 600; })*1000);
        endDate = new Date(d3.max(data, function(d) { return d.created_utc + 6000; }) * 1000);

        minScore = d3.min(data, function (d) { return d.score; });
        maxScore = d3.max(data, function (d) { return d.score; });

        // setup score-axes
        var yValue = function(d) { return d.score; }, // data -> value
            yScale = d3.scale.linear().domain([minScore, maxScore]).range([height, 0])
            yMap = function(d) { return yScale(yValue(d)); }, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left");


        var xValue = function(d) { return new Date(d.created_utc * 1000); },
            xScale = d3.time.scale().domain([startDate, endDate]).range([0, width]),
            xMap = function(d) { return xScale(xValue(d))},
            xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        // setup avg-score-axes
        var y2Value = function(d) { return d.score; }, // data -> value
            // y2Scale = d3.scale.linear().domain([-(maxScore - minScore)/2, (maxScore - minScore)/2]).range([height, 0])
            y2Scale = d3.scale.linear().domain([minScore, maxScore]).range([height, 0])
            y2Map = function(d) { return y2Scale(d); }, // data -> display
            y2Axis = d3.svg.axis().scale(y2Scale).orient("right");

        var x2Value = function(d) { return new Date(d.created_utc * 1000); },
            x2Scale = d3.time.scale().domain([startDate, endDate]).range([0, width]),
            x2Map = function(d) { return x2Scale(xValue(d))},
            x2Axis = d3.svg.axis().scale(x2Scale).orient("bottom");


        var bintest = {};
        var comcount = {};

        data.forEach(function(d) {
            var ti = d3.time.hour(new Date(d.created_utc * 1000));
            // console.log(ti);
            if (bintest[ti] === undefined) {
                bintest[ti] = d.score;
                comcount[ti] = 1;
            } else {
                bintest[ti] += d.score;
                comcount[ti] += 1;
            }
        });

        var valueLine = d3.svg.line()
            .x(function(d) {
                return xMap(d);
            })
            .y(function(d) {
                var ts = d3.time.hour(new Date(d.created_utc * 1000));
                var res = bintest[ts] / comcount[ts];
                // console.log(res);
                // console.log(y2Map(res))
                return y2Map(res);
            });

        var authorValue = function(d) { return d.author; };
        var permaLinkValue = function(d) { return d.permalink; };

        var svg = d3.select("#timeseries").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var tooltip = d3.select("#timeseries").append("div")
            .attr("class", "ttooltip")
            .style("opacity", 0);


        // var color = d3.scale.category10();

        // x-axis
        svg.append("g")
            .attr("class", "x axis")
            // .attr("transform", "translate(0," + yScale(0) + ")")
            .attr("transform", "translate(0," + height + ")")
            .attr("id", "x-axis")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width/2)
            .attr("y", 40)
            .style("text-anchor", "middle")
            .text("Timestamp");


        svg.append("line")
            .attr("x1", xScale(startDate))
            .attr("y1", yScale(0))
            .attr("x2", xScale(endDate))
            .attr("y2", yScale(0))
            .style("stroke-width", 1)
            .style("stroke", "grey")
            .style("fill", "none");

        // y-axis-score
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Score");

        // // y-axis-avg-score
        // svg.append("g")
        //     .attr("class", "y axis")
        //     .attr("transform", "translate(" + (width-6) + ",0)")
        //     .call(y2Axis)
        //     .append("text")
        //     .attr("class", "label")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", -20)
        //     .attr("dy", ".71em")
        //     .style("text-anchor", "end")
        //     .text("AVG-Score");


        // draw dots
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 4)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", "navy")
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(25)
                    .style("opacity", .9);
                tooltip.html("Score: " + yValue(d)
                    + "<br/>Author: " + authorValue(d))
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function (d) {
                window.open(permaLinkValue(d))
            });

        // draw legend
        // var legend = svg.selectAll(".legend")
        //     .data(color.domain())
        //     .enter().append("g")
        //     .attr("class", "legend")
        //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


        //
        // // draw legend colored rectangles
        // legend.append("rect")
        //     .attr("x", width - 18)
        //     .attr("width", 18)
        //     .attr("height", 18)
        //     .style("fill", color);
        //
        // // draw legend text
        // legend.append("text")
        //     .attr("x", width - 24)
        //     .attr("y", 9)
        //     .attr("dy", ".35em")
        //     .style("text-anchor", "end")
        //     .text(function(d) { return d;})



        svg.append("path")
            .attr("class", "line")
            // .attr("transform", "translate(0," + yScale(0) + ")")
            .attr("d", valueLine(data))
            .attr('stroke', 'green')
            .attr('stroke-width', 2)
            .attr("fill", "none");

        // console.log(bintest);
        // console.log(comcount);


        var legend = svg.append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", width - 240)
            .attr("width", 36)
            .attr("height", 2)
            .style("fill", "green");

        legend.append("text")
            .attr("x", width - 200)
            // .attr("y", 9)
            .attr("dy", ".5em")

            .text("AVG Score per Hour")
    });

}