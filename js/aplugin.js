//aplugin.js
(function(window,util) {
 
	var a = {};
	console.log('asda');
	a.toString = function(){
		alert("a="+util.add(1,20));
	};
 
	// 全局变量
	window.a = a;
  
})(window,util);