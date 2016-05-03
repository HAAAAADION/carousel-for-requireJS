;(function($, window, document, undefined){
	$.fn.banner = function(_aoConfig){
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
			length: $(this).length,
			size: $(this).parent().width(),
			Cubic: function(t, b, c, d){
				 return c*((t=t/d-1)*t*t + 1) + b;
			},

			//鼠标移动方向
			direction: {x1: 0, x2: 0},
		}

		global.totalSize = global.size * global.length;

		var option = $.extend({}, defaults, _aoConfig, global);

		return new $.fn.banner.prototype.init(this, option);
	}

	$.fn.banner.prototype = {
		init: function(element, option){
			console.log(element);
			this.$this = element;
			this.option = option;
			this.curPos = this.curDis = 0;
			this.par = element.parent();
			this.pars = this.par.parent();

			this.sizeReset();

			if (this.option.mask) this.mask();
			this.timeout();
			this.drag();
		},

		sizeReset: function(){
			var $this = this;
			window.onresize = function(){
				$this.option.size = $this.par.width();
				$this.option.totalSize = $this.option.size * $this.option.length;

				$this.timoutGO(true);
			}
		},

		mask: function(){
			var content = '';
			this.$this.each(function(k, v){
				content += k == 0 ? '<span class="on"></span>' : '<span></span>';
			});
			this.pars.append('<div class="mask">'+content+'</div>');
		},

		maskChange: function(){
			var mask = this.pars.find('.mask span');
			mask.removeClass('on');
			mask.eq(this.curPos).addClass('on');
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
			this.t = setTimeout(function(){$this.timoutGO()}, 5000);
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
			if (!this.option.drag) return false;

			var $this = this,
				option = this.option,
				lastPos = option.lastPos;
			
			//$this.par.bind('touchstart', function(e){
			$this.$this.bind('touchstart', function(e){
				e.preventDefault();

				$this.clearTime();
				
				$this.dragReset();

				$this.fastDrag();

				var event = e.originalEvent.changedTouches[0];
				var range = {x: event.pageX};
				$this.option.direction.x1 = event.pageX;

				var movePos = $this.par.css('transform').slice(7).split(', ');

				lastPos.x = event.pageX - range.x + $this.curDis + (movePos[4] - $this.curDis);

				$this.par.css('transform', 'translate3d('+lastPos.x+'px, 0, 0)');

				$(document).bind('touchmove', function(e){
					e.preventDefault();
					$this.jump = false;

					var event = e.originalEvent.changedTouches[0];
					lastPos.x = event.pageX - range.x + $this.curDis + (movePos[4] - $this.curDis);

					$this.par.css('transform', 'translate3d('+lastPos.x+'px, 0, 0)');
				}).bind('touchend', function(e){
					$this.clearTime();

					var event = e.originalEvent.changedTouches[0],
						direction = $this.option.direction,
						fx = direction.x1 < event.pageX ? 0 : 1,
						lPos = $this.curPos;

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
			});
		},

		dragReset: function(){
			this.jump = true;
			this.dragnum = 0;
		},

		

		anima: function(position){
			var movePos = parseFloat(this.par.css('transform').slice(7).split(', ')[4]);

			var b = movePos, c = position - movePos, d = this.option.speed, t = 0;
			this.a2(b,c,d,t);
		},

		a2: function(b,c,d,t){
			var $this = this;

			var result = Math.ceil(this.option.Cubic(t,b,c,d));
			this.par.css('transform', 'translate3d('+result+'px, 0, 0)');
			if(t<d){ t++; this.tt = setTimeout(function(){ $this.a2(b,c,d,t) }, 10); }
		}
	};

	$.fn.banner.prototype.init.prototype = $.fn.banner.prototype;
})(jQuery, window, document);