function drawTree(data_for_tree){

    d3.select("#tree").select("svg").remove();


	var diameter = 360

	var tree = d3.layout.tree()
		.size([360, diameter / 2 - 20])
		.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

	var diagonal = d3.svg.diagonal.radial()
		.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });



	var svg = d3.select("#tree").append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.append("g")
		.attr("id","treesvg")
		.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

	// d3.json(data_for_tree, function(error, root) {
	// 	if (error) throw error;
    //
	// 	var nodes = tree.nodes(root),
	// 		links = tree.links(nodes);
    //
	// 	var link = svg.selectAll(".link")
	// 		.data(links)
	// 		.enter().append("path")
	// 		.attr("class", "link")
	// 		.attr("d", diagonal);
    //
	// 	var node = svg.selectAll(".node")
	// 		.data(nodes)
	// 		.enter().append("g")
	// 		.attr("class", "node")
	// 		.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
    //
	// 	node.append("circle")
	// 		.attr("r", 4.5);
    //
	// 	// node.append("text")
	// 	// 	.attr("dy", ".31em")
	// 	// 	.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
	// 	// 	.attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
	// 	// 	.text(function(d) { return d.name; });
	// });



	var nodes = tree.nodes(data_for_tree),
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




	d3.select(self.frameElement).style("height", diameter - 150 + "px");
	
};