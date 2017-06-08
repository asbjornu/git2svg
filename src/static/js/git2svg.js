document.addEventListener('DOMContentLoaded', function(event) {
	var socket = io();
	var ul = document.getElementById('data');

	socket.on('data', function(data) {
		console.log(data);
		var li = document.createElement('li');
		li.innerText = data;
		ul.appendChild(li);
	});
});
