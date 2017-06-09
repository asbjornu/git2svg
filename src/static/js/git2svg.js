document.addEventListener('DOMContentLoaded', function(event) {
	var socket = io();
	var graph = d3.select('#graph')
		.append('svg')
		.attr('width', window.innerWidth - 20)
		.attr('height', window.innerHeight);

	var count = 0;

	socket.on('commit', function(commit) {
		var cy = ++count * 100;
		graph.append('svg:circle')
			.datum(commit)
			.attr('class', 'commit')
			.attr('id', commit.sha)
			.attr('cx', function(d) { return window.innerWidth / 2; })
			.attr('cy', function(d) { return cy; });

		if (cy > window.innerHeight) {
			graph.attr('height', cy + 100);
		}
	});
});
