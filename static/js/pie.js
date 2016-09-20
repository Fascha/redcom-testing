function drawPie(data_for_pie){

	d3.select("#pie").select("svg").remove();

    var width = 480,
        height = 480,
        radius = Math.min(width, height) / 2,
        color = d3.scale.category20c(),
        legendRectSize = 18,
        legendSpacing = 4;

    var numOfCommentsTotal = 0

    d3.json(data_for_pie, function(error, json) {
        if (error) throw error;

        for (i in json){
            numOfCommentsTotal += (json[i].value);
        }

        console.log(numOfCommentsTotal)

        var vis = d3.select("#pie").append("svg").data([json])
            .attr("width", width)
            .attr("height", height)
            .attr("id", "piesvg")
            .append("g")
            .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

        var pie = d3.layout.pie().value(function(d) { return d.value; });

        var arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(radius/2)

        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("svg:g")
            .attr("class", "slice");

        arcs.append("path")
            .attr("fill", function(d, i) { return color(i) })
            .attr("d", function(d) {  return arc(d) });



        // arcs.append("text")
        //     .attr("transform", function(d){
        //         d.innerRadius = 0;
        //         d.outerRadius = radius;
        //         return "translate(" + arc.centroid(d) + ")";})
        //     .attr("text-anchor", "middle")
        //     .text( function(d, i) {
        //         return "Level: " + json[i].level;}
        //     );


        var legend = vis.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset =  height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color);

        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) {
                if (d >= 8) {
                    return "Level >=9"
                } else {
                    return "Level " + (d+1);
                }
            });


        var tooltip = d3.select('#pie')
            .append('div')
            .attr('class', 'tooltip');

        tooltip.append('div')
            .attr('class', 'count');


        arcs.on("mousemove", function(d){
            tooltip.style("left", d3.event.pageX - $("#pie").position().left - $(".tooltip").outerWidth()/2 + "px");
            tooltip.style("top", d3.event.pageY - 75 + "px");
            tooltip.style("display", "inline-block");

            tooltip.html("Num of Comments: " + d.data.value + "<br>" + "Percent: " + (d.data.value/numOfCommentsTotal).toFixed(2))
        });

        arcs.on('mouseout', function(d) {
            tooltip.style('display', 'none');
        });

    });

};