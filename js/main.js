requirejs.config({
	paths: {
		jquery: 'jquery-2.1.4',
		alpha: 'carousel'
	},
});

require(['alpha', 'jquery'], function(c, $){
	var a = document.getElementsByTagName('a');
	var b = document.getElementById('carousel');

	var carousel = new c.carousel(a);

	//$('#carousel a').demo();
	//$('#carousel').css('width');
	//$('#carousel').append('<div>asdasd12312</div><div>12312</div>');
	//carousel.see();
});