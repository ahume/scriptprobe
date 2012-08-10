window.onload = function() {
	var img = document.createElement('img');
	img.src = 'http://localhost:8888/nothing.jpg';
	document.getElementsByTagName('body')[0].appendChild(img);
}