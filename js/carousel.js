(function($$){
	if (typeof define === 'function' && define.amd){
		define('alpha', ['jquery'], $$);
	}else{
		$$(jQuery);
	}
})(function($){
	var carousel = function(element, _aoConfig){

		this.length = element && typeof element.length === 'undefined' ? 1 : element && element.length ? element.length : 0;
		if (this.length === 0) return 'nothing';

		this.option = this.init(element, _aoConfig);

		this.sizeReset();

		if (this.option.mask) this.mask();
		this.timeout();
		this.drag();
	}

	var Cubic = function(t, b, c, d){ return c*((t=t/d-1)*t*t + 1) + b;},
		lastPos = {x: 0, y: 0},
		pause = "ontouchstart" in window,
		touchEvent = {eventDown: 'touchstart', eventMove: 'touchmove', eventUp: 'touchend'},
		mouseEvent = {eventDown: 'mousedown', eventMove: 'mousemove', eventUp: 'mouseup', eventEnter: 'mouseenter', eventLeave: 'mouseleave'},
		direction = {x1: 0, x2: 0},
		eventAction = pause ? touchEvent : mouseEvent,
		E = /\S+/g,
		o = /^\s+|\s+$/g,
		ab = /[\t\r\n\f]/g;

	carousel.prototype = {
		length: 0,		
		init: function(element, _aoConfig){
			var defaults = {auto: true,drag: true,mask: true,speed: 50};

			_aoConfig 				= _aoConfig || [];

			this.$this 				= element;

			this.curPos 			= this.curDis = 0;
			this.par 				= !element.length ? element.parentNode : element[0].parentNode;
			this.pars 				= this.par.parentNode;

			_aoConfig['size'] 		= this.par.offsetWidth;
			_aoConfig['totalSize'] 	= _aoConfig['size'] * this.length;

			var option = this.extend({}, defaults, _aoConfig);

			return option;
		},

		sizeReset: function(){
			var $this = this;

			window.onresize = function(){
				$this.option.size 		= $this.par.offsetWidth;
				$this.option.totalSize 	= $this.option.size * $this.length;

				$this.timoutGO(true);
			}
		},

		mask: function(){
			var content = '';

			for (var i = 0; i < this.length; i++) if (typeof this.$this[i] === 'object') content += i == 0 ? '<span class="on"></span>' : '<span></span>';

			this.append('<div class="mask">'+content+'</div>');
		},

		append: function(content){
			var b = document, k = b.createDocumentFragment(), c = b.createElement("div"), f = k.appendChild(c), m = 0, l = [], sel = this.pars;

			f.innerHTML = content;
			var g = f.childNodes;

			this.merge(l, g);

			while (e = l[m++]) k.appendChild(e);

			k.removeChild(c);
			sel.appendChild(k);
		},

		merge: function(a, b) {
			var m = 0;
			while(e = b[m]) a[m] = e, m++;

			return a
		},

		maskChange: function(){
			var mask = this.pars.querySelectorAll('.mask span');
			this.removeClass.call(mask, 'on asd');
			
			this.addClass.call([mask[this.curPos]], 'on')
		},

		fastDrag: function(){
			var $this = this;
			this.dragnum += 1;

			this.fdt = setTimeout(function(){ $this.fastDrag() }, 10);
		},

		clearTime: function(){
			clearTimeout(this.t), clearTimeout(this.tt), clearTimeout(this.fdt);
		},

		timeout: function(){
			if (!this.option.auto) return false;
			var $this = this;
			this.t = setTimeout(function(){$this.timoutGO()}, 1000);
		},

		timoutGO: function(reset){
			this.clearTime();
			var size = this.option.size;
			var maxDis = -(this.length - 1) * size;

			this.curPos = this.curPos + 1 > this.length - 1 && !reset ? -1 : this.curPos;

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

		anima: function(position){
			var movePos = parseFloat(this.css.call(this.par, 'transform').slice(7).split(', ')[4]);

			var b = movePos, c = position - movePos, d = this.option.speed, t = 0;
			this.a2(b,c,d,t);
		},

		a2: function(b,c,d,t){
			var $this = this;
			var result = Math.ceil(Cubic(t,b,c,d));

			this.css.call(this.par, 'transform', 'translate3d('+result+'px, 0, 0)');
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

		removeClass: function(a){
			var c, d, f, a = "string" == typeof a && a,
				j = this.length;

			for (var i = 0, b = (a || "").match(E) || []; j > i; i++) if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(ab, " ") : " ")){
				f = 0;

				while(e = b[f++]) d.indexOf(' '+e+' ') >= 0 && (d = d.replace(' '+e+' ', ' '));

				c.className = d.replace(o, "");
			}
		},

		addClass: function(a){
			var c, d, f, a = "string" == typeof a && a,
				j = this.length;

			for (var i = 0, b = (a || "").match(E) || []; j > i; i++) if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(ab, " ") : ' ')){
				f = 0;
				while(e = b[f++]) d.indexOf(' '+a+' ') <= 0 && (d += a+' ');

				c.className = d.replace(o, "");
			}				
		},

		css: function(attr, value){
			return !value ? this.currentStyle ? this.currentStyle.getAttribute(attr) : this.ownerDocument.defaultView.getComputedStyle(this).getPropertyValue(attr) : this.style[attr] = value;
		},
	}


	$.fn.extend({
		carousel: function(name) {
			return new carousel(this, name);
		}
	});
	
	return {carousel: carousel};
});