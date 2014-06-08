var treeData = {
	name: "/",
	contents: [
		{
			name: "Applications",
			contents: [
				{ name: "Mail.app" },
				{ name: "iPhoto.app" },
				{ name: "Keynote.app" },
				{ name: "iTunes.app" },
				{ name: "XCode.app" },
				{ name: "Numbers.app" },
				{ name: "Pages.app" }
			]
		},
		{
			name: "System",
			contents: []
		},
		{
			name: "Library",
			contents: [
				{
					name: "Application Support",
					contents: [
						{ name: "Adobe" },
						{ name: "Apple" },
						{ name: "Google" },
						{ name: "Microsoft" }
					]
				},
				{
					name: "Languagues",
					contents: [
						{ name: "Ruby" },
						{ name: "Python" },
						{ name: "Javascript" },
						{ name: "C#" }
					]
				},
				{
					name: "Developer",
					contents: [
						{ name: "4.2" },
						{ name: "4.3" },
						{ name: "5.0" },
						{ name: "Documentation" }
					]
				}
			]
		},
		{
			name: "opt",
			contents: []
		},
		{
			name: "Users",
			contents: [
				{ name: "pavanpodila" },
				{ name: "admin" },
				{ name: "test-user" }
			]
		}
	]
};

function visit(parent, visitFn, childrenFn) {
	if (!parent) {
		return;
	}
	
	visitFn(parent);
	
	var children = childrenFn(parent);
	if (children) {
		var count = children.length;
		for (var i = 0; i < count; i++) {
			visit(children[i], visitFn, childrenFn);
		}
	}
}

var ui;

function buildTree(containerName, customOptions) {
	var options = $.extend({
		nodeRadius: 5, fontSize: 12
	}, customOptions);
	
	var totalNodes = 0;
	var maxLabelLength = 0;
	visit(treeData, function (d) {
		totalNodes++;
		maxLabelLength = Math.max(d.name.length, maxLabelLength);
	}, function (d) {
		return d.contents && d.contents.length > 0 ? d.contents : null;
	});
	
	var size = {
		width: $(containerName).outerWidth(), height: totalNodes * 15
	};
	
	var tree = d3.layout.tree()
		.sort(null)
		.size([size.height, size.width - maxLabelLength*options.fontSize])
		.children(function (d) {
			return (!d.contents || d.contents.length === 0) ? null : d.contents;
		});
	
	var nodes = tree.nodes(treeData);
	var links = tree.links(nodes);
	
	var svgRoot = d3.select(containerName)
		.append("svg:svg").attr("width", size.width).attr("height", size.height);
	
	svgRoot.append("svg:clipPath").attr("id", "clipper")
		.append("svg:rect")
		.attr("id", "clip-rect");
	
	var layoutRoot = svgRoot
		.append("svg:g")
		.attr("class", "container")
		.attr("transform", "translate(" + maxLabelLength + ", 0)");
	
	var link = d3.svg.diagonal()
		.projection(function (d) {
			return [d.y, d.x];
		});
	
	var linkGroup = layoutRoot.append("svg:g");
	
	linkGroup.selectAll("path.link")
		.data(links)
		.enter()
		.append("svg:path")
		.attr("class", "link")
		.attr("d", link);
	
	var animGroup = layoutRoot.append("svg:g")
		.attr("clip-path", "url(#clipper)");
	
	var nodeGroup = layoutRoot.selectAll("g.node")
		.data(nodes)
		.enter()
		.append("svg:g")
		.attr("class", "node")
		.attr("transform", function (d) {
			return "translate(" + d.y + ", " + d.x + ")";
		});
	
	ui = {
		svgRoot: svgRoot,
		nodeGroup: nodeGroup,
		linkGroup: linkGroup,
		animGroup: animGroup
	};
	
	setupMouseEvents();
	
	nodeGroup.append("svg:circle")
		.attr("class", "node-dot")
		.attr("r", options.nodeRadius);
	
	nodeGroup.append("svg:text")
		.attr("text-anchor", function (d) {
			return d.children ? "end" : "start"
		}).attr("dx", function (d) {
			var gap = 2 * options.nodeRadius;
			return d.children ? -gap : gap;
		}).attr("dy", 3)
		.text(function (d) {
			return d.name;
		});
}

function setupMouseEvents() {
	ui.nodeGroup.on("mouseover", function (d, i) {
		d3.select(this).select("circle").classed("hover", true);
	}).on("mouseout", function (d, i) {
		d3.select(this).select("circle").classed("hover", false);
	}).on("click", function (nd, i) {
		var ancestors = [];
		var parent = nd;
		while (!_.isUndefined(parent)) {
			ancestors.push(parent);
			parent = parent.parent;
		}
		
		var matchedLinks = [];
		ui.linkGroup.selectAll("path.link")
			.filter(function (d, i) {
				return _.any(ancestors, function (p) {
					return p === d.target;
				});
			}).each(function (d) {
				matchedLinks.push(d);
			});
		
		animateParentChain(matchedLinks);
	});
}

function animateParentChain(links) {
	var linkRenderer = d3.svg.diagonal()
		.projection(function (d) {
			return [d.y, d.x];
		});
	
	ui.animGroup.selectAll("path.selected")
		.data([])
		.exit().remove();
	
	ui.animGroup
		.selectAll("path.selected")
		.data(links)
		.enter().append("svg:path")
		.attr("class", "selected")
		.attr("d", linkRenderer);
	
	var overlayBox = ui.svgRoot.node().getBBox();
	
	ui.svgRoot.select("#clip-rect")
		.attr("x", overlayBox.x + overlayBox.width)
		.attr("y", overlayBox.y)
		.attr("width", 0)
		.attr("height", overlayBox.height)
		.transition().duration(500)
		.attr("x", overlayBox.x)
		.attr("width", overlayBox.width);
}