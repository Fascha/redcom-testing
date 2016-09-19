// var width = 960,
//     height = 500,
//     radius = Math.min(width, height) / 2;

svg.selectAll("dot")
    .data(data)
    .enter().append("circle")
    .attr("r", 5)
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return y(d.close); })
    .on("mouseover", function(d) {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div	.html(formatTime(d.date) + "<br/>"  + d.close)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    });
