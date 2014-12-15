$(document).ready(function(){
	//init controller
	var controller = new ScrollController({
		shift: {
			right: '-20%',
			left: '-20%',
			top: '-10%',
			bottom: '-10%',
		},
		defaults: {
			'direction' : 'left',
			'duration' : 1000,
		},
		opacity: 0,
		
	});
	controller.print();
});


function ScrollController(settings){

	this.addListener = function(){
		var t = this;
		$(window).scroll(function(event){
			t.checkTrigger(event);
		});
		
		this.checkTrigger();
	}
	
	this.checkTrigger = function(event){	
		var wBottom = $(window).scrollTop() + $(window).height();	//bottom of the viewing window
		var t = wBottom + 100; 
		if(this.nextTrigger >= 0 && ( t >= this.nextTrigger)){
			this.trigger();
		}
		
	}
	
	this.trigger = function(){
		console.log('trigger');
		var ele = this.spliceTable(this.next);
		this.animate(ele[0]);
	}
	
	this.animate = function(element){
		var css = {};
		css['opacity'] = element.origOpacity;
		css[element.direction] = element.origDirection;

		$(element.element).animate(css, element.duration);
	}
	
	this.spliceTable = function(ele){
		var index = this.targetTable.indexOf(ele);
		var removed = this.targetTable.splice(index, 1);
		
		this.setTrigger();
		this.setNext();
		this.checkTrigger();
		
		return removed;
	}
	
	this.setTrigger = function(){
		if(this.targetTable.length > 0){
			this.nextTrigger = (this.targetTable[0].offset.top);
			return this.targetTable[0].offset.top;
		}
		else{
			this.nextTrigger = -1;
			return -1;
		}
	}
	
	this.setNext = function(){
		if(this.targetTable.length > 0){
			this.next = this.targetTable[0];
			return this.targetTable[0];
		}
		else{
			this.next = -1;
			return -1;
		}
	}
	this.setTargetTable = function(){
		var table = [];

		for(var i=0; i<this.targets.length; i++){
			table[i] = new Target(this.targets[i], settings);
		}
		
		return table;
	}
	
	
	this.targets = document.getElementsByClassName('scrollTarget');
	this.targetTable = this.setTargetTable();
	
	this.nextTrigger = this.setTrigger();
	this.next = this.setNext();
	
	this.addListener();

	this.print = function(){
		console.log('--------------------------- print -------------------------------');
		console.log("targets:\t",this.targets);
		console.log("table:\t",this.targetTable);
		console.log("nextTrigger:\t", this.nextTrigger);
		console.log("next:\t", this.next);
		console.log('------------------------- end print ------------------------------');
	}
}

function Target(element, settings){

	this.setDirection = function(dir){
		dir = direction2Style(dir);
		
		this.direction = dir;
		this.amount = settings.shift[dir];
		this.origDirection = ($(element).css(dir) != 'auto') ? $(element).css(dir) : '0%';
		this.origOpacity = $(element).css('opacity');
		
		var css = {};
		css['opacity'] = settings.opacity;
		css[dir] = settings.shift[style2Direction(dir)];
		$(element).css(css);
	}

	this.element = element;
	this.offset = $(element).offset();
	this.offset.top = (this.offset.top < 120) ? 0 : this.offset.top;
	
	var dir = $(element).attr('data-direction');
	if(typeof dir !== typeof undefined && dir !== false){
		this.setDirection(dir);
	}
	else{
		if(typeof settings.defaults.direction !== typeof undefined && settings.defaults.direction !== false){
			this.setDirection(settings.defaults.direction);
		}
		else{
			//use left
			this.setDirection('left');
		}
	}
	
	var dur = $(element).attr('data-duration');
	if(typeof dur !== typeof undefined && dur !== false){
		this.duration = parseInt(dur);
	}
	else{
		if(typeof settings.defaults.duration !== typeof undefined && settings.defaults.duration !== false){
			this.duration = parseInt(settings.defaults.duration);
		}
		else{
			//use 1000
			this.duration = 1000;
		}
	}
}

function style2Direction(style){
	switch(style){
		case 'margin-left':
			return 'right';
		case 'margin-right':
			return 'left';
		case 'margin-top':
			return 'bottom';
		case 'margin-bottom':
			return 'top';
		default:
			return style;
	}
}
function direction2Style(dir){
	switch(dir){
		case 'right':
			return 'margin-left';
		case 'left':
			return 'margin-right';
		case 'up':
		case 'top':
			return 'margin-bottom';
		case 'bottom':
		case 'down':
			return 'margin-top';
		default:
			return dir;
	}
}