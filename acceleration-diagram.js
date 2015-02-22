(function() {
	window.AccelerationDiagram = function($element) {
		this.$element = $element;
	};
	AccelerationDiagram.prototype.renderValues = function(values) {
		var $element = this.$element;
		var value;
		var maxHeight = $element.height() / 2;
		var $xAxis = $element.find('.x-axis');
		var $xSegments = $xAxis.children();
		var $bar;
		var css = {height: 0, bottom: 0};
		for(var i = 0; i < values.length; i++) {
			value = values[i];
			if(i > $xSegments.length - 1) {
				var $xSegment = $('<span class="x-segment"></span>');
				$xAxis.append($xSegment);
				$bar = $('<span class="diagram-bar"></span>');
				$xSegment.append($bar);
			} else {
				$bar = $($xSegments[i]).children();
			}
			css.height = Math.abs(value * maxHeight) + 'px';
			if(value >= 0) {
				css.bottom = 0;
			} else {
				css.bottom = '-' + css.height;
			}
			$bar.css(css);
		}
		$xSegments = $xAxis.children();
		$xSegments.css('width', Math.floor(100 / values.length) + '%');
	}
})();
