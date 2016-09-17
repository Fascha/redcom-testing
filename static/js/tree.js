function drawTree(data_for_tree){
	"use strict"

	console.log(data_for_tree)

	var diameter = 960;

	var tree = d3.layout.tree()
		.size([360, diameter / 2 - 120])
		.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

	var diagonal = d3.svg.diagonal.radial()
		.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });


	d3.select("#tree").selectAll("svg").remove();

	var svg = d3.select("#tree").append("svg")
		.attr("width", diameter)
		.attr("height", diameter - 150)
		.append("g")
		.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

	d3.json(data_for_tree, function(error, root) {
		if (error) throw error;

		var nodes = tree.nodes(root),
			links = tree.links(nodes);

		var link = svg.selectAll(".link")
			.data(links)
			.enter().append("path")
			.attr("class", "link")
			.attr("d", diagonal);

		var node = svg.selectAll(".node")
			.data(nodes)
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

		node.append("circle")
			.attr("r", 4.5);


	});

	d3.select(self.frameElement).style("height", diameter - 150 + "px");
	
	console.log("tree.js finished")
	
};