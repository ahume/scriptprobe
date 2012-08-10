document.write('<script src="http://localhost:8888/nothing.js"></script>');


var s = document.createElement('script');
s.type = 'text/javascript';
s.src = 'http://localhost:8888/nothing.js';
document.getElementsByTagName('head')[0].appendChild(s);