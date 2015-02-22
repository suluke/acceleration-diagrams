(function() {
	var valuesPerDiagram = 100;
	var averageOver = 3;
	var maxValue = 25;
	var interval = 1000 / 2;

	window.AccelerationDiagrams = function() {
		var self = this;
		this.xDiagram = new AccelerationDiagram($('.diagram-x'));
		this.yDiagram = new AccelerationDiagram($('.diagram-y'));
		this.zDiagram = new AccelerationDiagram($('.diagram-z'));
		window.setInterval(function() {
			// buffer swap
			var queue = self.eventQueue;
			queue.length = 0;
			self.eventQueue = self.eventBuffer;
			self.eventBuffer = queue;
			
			self.updateDiagramValues();
			self.xDiagram.renderValues(self.xValues);
			self.yDiagram.renderValues(self.yValues);
			self.zDiagram.renderValues(self.zValues);
		}, interval);
		window.addEventListener('devicemotion', function(event) {
			self.eventBuffer.push(event.acceleration);
		});
	};
	AccelerationDiagrams.prototype.eventBuffer = [];
	AccelerationDiagrams.prototype.eventQueue = [];
	AccelerationDiagrams.prototype.previouslyIgnored = [];
	AccelerationDiagrams.prototype.xValues = [];
	AccelerationDiagrams.prototype.yValues = [];
	AccelerationDiagrams.prototype.zValues = [];
	AccelerationDiagrams.prototype.updateDiagramValues = function() {
		var xValues = [];
		var yValues = [];
		var zValues = [];
		
		var events = this.eventQueue;
		var ignored = this.previouslyIgnored;
		
		var i = 0;
		var usedEvents = 0;
		// 1. use as many events as possible to create averaged values
		var xSum = 0;
		var ySum = 0;
		var zSum = 0;
		var usedEvent;
		while(i < events.length) {
			if(ignored.length > 0) {
				usedEvent = ignored.shift();
			} else {
				usedEvent = events[i];
				i++;
			}
			xSum += usedEvent.x;
			ySum += usedEvent.y;
			zSum += usedEvent.z;
			usedEvents++;
			if(usedEvents === averageOver) {
				xValues.push(xSum / (averageOver * maxValue));
				yValues.push(ySum / (averageOver * maxValue));
				zValues.push(zSum / (averageOver * maxValue));
				usedEvents = 0;
				xSum = 0;
				ySum = 0;
				zSum = 0;
			}
		}
		
		// 2. write unused events back to ignored array
		for(i = events.length - usedEvents; i < events.length; i++) {
			ignored.push(events[i]);
		}
		
		// 3. use previous values to fill until valuesPerDiagram is reached
		var oldXValues = this.xValues;
		var oldYValues = this.yValues;
		var oldZValues = this.zValues;
		var needed = Math.min(valuesPerDiagram - xValues.length, oldXValues.length);
		for(i = 1; i<= needed; i++) {
			xValues.unshift(oldXValues[oldXValues.length - i]);
			yValues.unshift(oldYValues[oldYValues.length - i]);
			zValues.unshift(oldZValues[oldZValues.length - i]);
		}
		
		// 4. write back
		this.xValues = xValues;
		this.yValues = yValues;
		this.zValues = zValues;
	};
})();
