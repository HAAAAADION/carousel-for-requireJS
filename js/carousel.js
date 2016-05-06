(function($$){
	if (typeof define === 'function' && define.amd){
		define('alpha', ['jquery'], $$);
		//define([], $$);
	}else{
		$$(jQuery);
	}
})(function($){
	var carousel = function(element, _aoConfig){

		this.length = element && typeof element.length === 'undefined' ? 1 : element && element.length ? element.length : 0;
		if (this.length === 0) return 'nothing';

		this.$this = element;

		this.option = this.init(this.$this, _aoConfig);
		this.curPos = this.curDis = 0;
		this.par 	= !element.length ? element.parentNode : element[0].parentNode;
		this.pars 	= this.par.parentNode;

		this.sizeReset();

		if (this.option.mask) this.mask();
		this.timeout();
		this.drag();
	}

	carousel.prototype = {
		length: 0,
		init: function(element, _aoConfig){
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
				length: this.length,
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

		sizeReset: function(){
			var $this = this;
			window.onresize = function(){
				$this.option.size 		= $this.par.width();
				$this.option.totalSize 	= $this.option.size * $this.option.length;

				$this.timoutGO(true);
			}
		},

		mask: function(){
			var content = '';
			/*this.$this.each(function(k, v){
				content += k == 0 ? '<span class="on"></span>' : '<span></span>';
			});*/

			for (var i = 0; i < this.$this.length; i++) if (typeof this.$this[i] === 'object') content += i == 0 ? '<span class="on"></span>' : '<span></span>';

			this.append('<div class="mask">'+content+'</div>');
			//this.pars.append('<div class="mask">'+content+'</div>');
		},

		append: function(content){
			var b = document;
			var k = b.createDocumentFragment();
			var c = b.createElement("div");
			var f = k.appendChild(c);
			f.innerHTML = content;
			var g = f.childNodes;

			var sel = this.pars;

			var m = 0;
			var l = [];

			this.merge(l, g);

			while (e = l[m++]) k.appendChild(e);

			k.removeChild(c);
			sel.appendChild(k);
		},

		merge: function(a, b) {
			var m = 0;
			while(e = b[m]) a[m] = e, m++;

			/*for (var c = +b.length, d = 0, e = a.length; c > d; d++){
				a[e++] = b[d];
			}*/
			return a
		},

		maskChange: function(){
			/*var mask = this.pars.find('.mask span');
			mask.removeClass('on');
			mask.eq(this.curPos).addClass('on');*/
		},

		fastDrag: function(){
			var $this = this;
			this.dragnum += 1;

			this.fdt = setTimeout(function(){ $this.fastDrag() }, 10);
		},

		clearTime: function(){
			clearTimeout(this.t);
			clearTimeout(this.tt);
			clearTimeout(this.fdt);
		},

		timeout: function(){
			if (!this.option.auto) return false;
			var $this = this;
			//this.t = setTimeout(function(){$this.timoutGO()}, 100);
			$this.timoutGO();
		},

		timoutGO: function(reset){
			this.clearTime();
			var size = this.option.size;
			var maxDis = -(this.$this.length - 1) * size;

			this.curPos = this.curPos + 1 > this.$this.length - 1 && !reset ? -1 : this.curPos;

			this.curPos = reset ? this.curPos : ++this.curPos;

			this.curDis = -(this.curPos * size);
			
			this.maskChange();

			this.anima(this.curDis);
			this.timeout();
		},

		drag: function(){
			/*if (!this.option.drag) return false;

			var $this 		= this,
				option 		= this.option,
				lastPos 	= option.lastPos,
				eventAction = option.eventAction;

			$this.$this.bind(eventAction.eventDown, function(e){
				e.preventDefault();
				$this.clearTime();
				$this.dragReset();
				$this.fastDrag();

				var event = option.pause ? e.originalEvent.changedTouches[0] : e;

				var range = {x: event.pageX};
				$this.option.direction.x1 = event.pageX;

				var movePos = $this.par.css('transform').slice(7).split(', ');

				lastPos.x = event.pageX - range.x + $this.curDis + (movePos[4] - $this.curDis);

				$this.par.css('transform', 'translate3d('+lastPos.x+'px, 0, 0)');

				$(document).bind(eventAction.eventMove, function(e){
					e.preventDefault();
					$this.jump = false;

					var event = option.pause ? e.originalEvent.changedTouches[0] : e;
					
					lastPos.x = event.pageX - range.x + $this.curDis + (movePos[4] - $this.curDis);

					$this.par.css('transform', 'translate3d('+lastPos.x+'px, 0, 0)');
				}).bind(eventAction.eventUp, function(e){
					$this.clearTime();

					var event 		= option.pause ? e.originalEvent.changedTouches[0] : e,
						direction 	= $this.option.direction,
						fx 			= direction.x1 < event.pageX ? 0 : 1,
						lPos 		= $this.curPos;

					$this.curPos = Math.round(-lastPos.x / option.totalSize * option.length);

					if (lPos == $this.curPos && $this.dragnum < 15){
						$this.curPos = direction.x1 - event.pageX > 50 && fx == 1 ? ++$this.curPos :  direction.x1 - event.pageX < -50 && fx == 0 ? --$this.curPos : $this.curPos;
					}

					$this.curPos = $this.curPos <= 0 ? 0 : $this.curPos >= option.length - 1 ? option.length - 1 : $this.curPos;

					//跳转key
					if ($this.jump) location.href = $this.$this.eq($this.curPos).attr('href');

					$this.maskChange();

					var davDis = -($this.curPos * option.size);

					$this.anima(davDis);

					$this.curDis = davDis;
					$this.timeout();
					$(document).unbind();
				});
			});*/
		},

		dragReset: function(){
			this.jump 		= true;
			this.dragnum 	= 0;
		},

		css: function(attr, value){
			var asd = this.par.currentStyle.getAttribute('margin-left');
			//var asd = element.currentStyle ? this.par.ownerDocument.defaultView.getComputedStyle(this.par).getPropertyValue('margin-left');
			alert(asd);
		},

		anima: function(position){
			this.css();
			var movePos = parseFloat(this.par.css('transform').slice(7).split(', ')[4]);

			var b = movePos, c = position - movePos, d = this.option.speed, t = 0;
			this.a2(b,c,d,t);
		},

		a2: function(b,c,d,t){
			var $this = this;

			var result = Math.ceil(this.option.Cubic(t,b,c,d));
			this.par.css('transform', 'translate3d('+result+'px, 0, 0)');
			if(t<d){ t++; this.tt = setTimeout(function(){ $this.a2(b,c,d,t) }, 10); }
		},

		extend: function(){
			var a, b, c, d, e, f, g = arguments[0] || {},
			h = 1,
			i = arguments.length,
			j = !1;
		for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || n.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++) if (null != (a = arguments[h])) for (b in a) c = g[b], d = a[b], g !== d && (j && d && (n.isPlainObject(d) || (e = n.isArray(d))) ? (e ? (e = !1, f = c && n.isArray(c) ? c : []) : f = c && n.isPlainObject(c) ? c : {}, g[b] = n.extend(j, f, d)) : void 0 !== d && (g[b] = d));
		return g
		},
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