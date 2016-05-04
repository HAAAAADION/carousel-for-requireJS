requirejs.config({
	paths: {
		jquery: 'jquery-2.1.4',
		alpha: 'carousel'
	},
});

require(['alpha', 'jquery'], function(c, $){
	var a = document.getElementsByTagName('a');
	var b = document.getElementById('carousel');

	//var carousel = new c.carousel(b);

	//$('#carousel a').demo().append();
	$('#carousel').append('<div>asdasd12312</div>');
	//carousel.see();
});