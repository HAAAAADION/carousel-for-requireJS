requirejs.config({
	paths: {
		jquery: 'jquery-2.1.4',
		alpha: 'carousel'
	},
});

require(['alpha', 'jquery'], function(c, $){
	var a = document.getElementsByTagName('div123');
	var b = document.getElementById('carousel');

	var carousel = new c.carousel(a);

	//$('#carousel').demo();
	//carousel.see();
});