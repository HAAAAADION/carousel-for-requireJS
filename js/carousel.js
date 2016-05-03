(function($$){
	if (typeof define === 'function' && define.amd){
		define('alpha', ['jquery'], $$);
		//define([], $$);
	}else{
		$$(jQuery);
	}
})(function($){
	var carousel = function(element, _aoConfig){
		this.$this = element;

		//if (this.length <= 0) return 'notthink';

		this.option = this.init(this.$this, _aoConfig);
		this.curPos = this.curDis = 0;
		this.par 	= element;
		this.pars 	= this.par;

		/*this.sizeReset();

		if (this.option.mask) this.mask();
		this.timeout();
		this.drag();*/
		
		console.log(this.option);
	}

	carousel.prototype = {
		length: 0,
		init: function(element, _aoConfig){
			if (element != [] || element.length > 0) this.length = 1;
console.log(this.length);
console.log(element == 'undefined');
			var defaults = {
				//false则不允许自动切换
				auto: true,
				//false则不允许自动拖拉
				drag: true,
				//false则不允许生成“点”
				mask: true,

				//动画速度
				speed: 50,
			};

			var global = {
				lastPos: {x: 0, y: 0},
				length: element.length || 1,
				size: !element.length ? element.parentNode.offsetWidth : element[0].parentNode.offsetWidth,
				Cubic: function(t, b, c, d){
					 return c*((t=t/d-1)*t*t + 1) + b;
				},

				pause: "ontouchstart" in window,
				touchEvent: {eventDown: 'touchstart', eventMove: 'touchmove', eventUp: 'touchend'},
				mouseEvent: {eventDown: 'mousedown', eventMove: 'mousemove', eventUp: 'mouseup', eventEnter: 'mouseenter', eventLeave: 'mouseleave'},

				//鼠标移动方向
				direction: {x1: 0, x2: 0},
			}

			global.eventAction = global.pause ? global.touchEvent : global.mouseEvent;
			global.totalSize = global.size * global.length;

			var option = this.extend({}, defaults, _aoConfig, global);

			return option;
		},

		extend: function(){
			var a, b, c, d, e, f, g = arguments[0] || {},
			h = 1,
			i = arguments.length,
			j = !1;
		for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || n.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++) if (null != (a = arguments[h])) for (b in a) c = g[b], d = a[b], g !== d && (j && d && (n.isPlainObject(d) || (e = n.isArray(d))) ? (e ? (e = !1, f = c && n.isArray(c) ? c : []) : f = c && n.isPlainObject(c) ? c : {}, g[b] = n.extend(j, f, d)) : void 0 !== d && (g[b] = d));
		return g
		},

		see: function(){
			console.log('1231');
		}
	}


	$.fn.extend({
            demo: function(name) {
                return new carousel(this, name);
            }
        });

	return {carousel: carousel};
});

/*define(['jquery'], function($){
	$('div').css('background', '#f00');
});*/

/*(function($) {
	$('div').css('background', '#f00');
})(jQuery);*/