var data = {
	"name": "My Root",
	"id": "0",
	"children": [
		{
			"name": "first level child 1",
			"id": "1_1",
			"children": [
				{
					"name": "second level child 1",
					"id": "2_1",
					"children": [
						{
							"name": "third level child 1",
							"id": "3_1",
							"children": []
						},
						{
							"name": "third level child 2",
							"id": "3_2",
							"children": []
						}
					]
				}
			]
		}
	]
};

var w = 960,
	h = 800,
	i = 0,
	barHeight = 20,
	barWidth = w * 0.8,
	duration = 400,
	root;

var tree = d3.layout.tree().size([h, 100]);

var diagonal = d3.svg.diagonal().projection(function (d) {
	return [d.y, d.x];
});

var vis = d3.select("#chart")
	.append("svg:svg").attr("width", w).attr("height", h)
	.append("svg:g").attr("transform", "translate(20, 30)");

data.x0 = 0;
data.y0 = 0;

update(root = data);

function update(source) {
	var nodes = tree.nodes(root);
	
	nodes.forEach(function (n, i) {
		n.x = i * barHeight;
	});
	
	var node = vis.selectAll("g.node").data(nodes, function (d) {
		return d.id || (d.id = ++i);
	});
	
	var nodeEnter = node.enter()
		.append("svg:g").attr("class", "node").attr("transform", function (d) {
			return "translate(" + source.y0 + ", " + source.x0 + ")";
		}).style("opacity", 1e-6);
	
	nodeEnter.append("svg:rect")
		.attr("y", -barHeight / 2).attr("height", barHeight).attr("width", barWidth)
		.style("fill", color).on("click", click);
	
	nodeEnter.append("svg:text").attr("dy", 3.5).attr("dx", 5.5).text(function (d) {
		return d.name;
	});
	
	nodeEnter.append("svg:circle")
		.attr("cy", 0).attr("cx", 0).attr("r", 5).attr("fill", "white").on("click", function (d) {
			if (d.selected) {
				d.selected = false;
				d3.select(this).attr("fill", "white");
			} else {
				d.selected = true;
				d3.select(this).attr("fill", "black");
				insert_child(source, d.id, "test");
			}
			
			printSelectedNodes();
			update(source);
		});
	
	nodeEnter.transition().duration(duration).attr("transform", function (d) {
		return "translate(" + d.y + ", " + d.x + ")";
	}).style("opacity", 1);
	
	node.transition().duration(duration).attr("transform", function (d) {
		return "translate(" + d.y + ", " + d.x + ")";
	}).style("opacity", 1).select("rect").style("fill", color);
	
	node.exit().transition().duration(duration).attr("transform", function (d) {
		return "translate(" + source.y + ", " + source.x + ")";
	}).style("opacity", 1e-6).remove();
	
	var link = vis.selectAll("path.link").data(tree.links(nodes), function (d) {
		return d.target.id;
	});
	
	link.enter().insert("svg:path", "g").attr("class", "link").attr("d", function (d) {
		var o = {
			x: source.x0,
			y: source.y0
		};
		return diagonal({
			source: o,
			target: o
		});
	}).transition().duration(duration).attr("d", diagonal);
	
	link.transition().duration(duration).attr("d", diagonal);
	
	link.exit().transition().duration(duration).attr("d", function (d) {
		var o = {
			x: source.x,
			y: source.y
		};
		return diagonal({
			source: o,
			target: o
		});
	}).remove();
	
	nodes.forEach(function (d) {
		d.x0 = d.x;
		d.y0 = d.y;
	});
}

function printSelectedNodes() {
	var nodes = tree.nodes(root);
	var selected = [];
	nodes.forEach(function (n, i) {
		if (n.selected) {
			selected.push(n.name);
		}
	});
	console.log(selected);
}

function insert_child(object, ex_id, new_txt) {
	var o = object;
	for (var a = 0; a < o.children.length; a++) {
		if (o.children[a].id == ex_id) {
			var new_idd = ex_id + "_" + (o.children[a].children.length + 1);
			o.children[a].children.push({
				name: new_idd,
				id: new_idd,
				children: []
			});
		} else {
			insert_child(o.children[a], ex_id, new_txt);
		}
	}
}

function click(d) {
	if (d.children) {
		d._children = d.children;
		d.children = null;
	} else {
		d.children = d._children;
		d._children = null;
	}
	
	update(d);
}

function color(d) {
	return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}
