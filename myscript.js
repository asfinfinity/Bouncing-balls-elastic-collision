function start(){

	var canvas = document.getElementById('myCanvas');
	canvas.width = window.innerWidth-118;
	canvas.height = window.innerHeight-200;
	var ctx = canvas.getContext('2d');
	var ctxText = canvas.getContext('2d');

	var centerX;
	var centerY;
	var side = 110;
	var color = get_random_color();

	function rand(min, max) {
    	return parseInt(Math.random() * (max-min+1), 10) + min;
	}

	function get_random_color() {
	    var h = rand(1, 360); 
	    var s = rand(30, 100);
	    var l = rand(30, 70);
	    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var balls = [];
	var ballCount = getRandomInt(3,9);
	
	var startpointX = 100;
	var startpointY = 50;

	for(var i=0; i<ballCount; i++){

		var randValue = getRandomInt(20,30);
		balls.push({
			x: startpointX,
			y: startpointY,
			vx: getRandomInt(5,6) * direction(),
	  		vy: getRandomInt(5,6) * direction(),
			radius: randValue,
			mass : randValue,
			color: get_random_color(),

			draw: function() {
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fillStyle = this.color;
				ctx.fill();
			}
		});

		startpointX = startpointX + 50;
		startpointY = startpointY + 40;
	}


	function direction(){
		var chosenValue = Math.random() < 0.5 ? 1 : -1;
		return chosenValue;
	}
	
	function draw() {
		side = 110;
		ctx.clearRect(0,0, canvas.width, canvas.height);
		centerX = canvas.width / 2;
    	centerY = canvas.height / 2;

    	ctx.strokeStyle = color;
    	ctx.fillStyle = color;
    	roundRect(ctx, centerX - side / 2, centerY - side / 2, side, side, 5, true);

    	if(ballCount == 0){
	    	ctx.fillStyle = 'white';
	    	ctx.font = '30px arial';
	    	ctx.textAlign="center";
	    	ctx.fillText('Over', centerX, centerY+10);
    	} 
    	else {
			ctx.fillStyle = 'white';
    		ctx.font = '48px arial';
    		ctx.fillText(ballCount, centerX-12, centerY+16);
    	}
    	
    	var left_X = centerX - side / 2;
    	var right_X = centerX + side / 2;

    	var upper_Y = centerY - side / 2;
    	var bottom_Y = centerY + side / 2;

		for(var i=0; i<ballCount; i++){
			
			balls[i].draw();
			balls[i].x += balls[i].vx;
			balls[i].y += balls[i].vy;
			
			if ( (balls[i].y + balls[i].vy + balls[i].radius) > canvas.height || (balls[i].y + balls[i].vy - balls[i].radius) < 0) {
				balls[i].vy = -balls[i].vy;
			}
			if ( (balls[i].x + balls[i].vx + balls[i].radius) > canvas.width || (balls[i].x + balls[i].vx - balls[i].radius) < 0) {
				balls[i].vx = -balls[i].vx;
			}
		}

		onBoxTouched(left_X, right_X, upper_Y, bottom_Y);

		//collision check among balls
		for(var i=0; i<ballCount; i++){
			for(var j=i+1; j<ballCount; j++){

				var distance = Math.sqrt(
											(balls[i].x - balls[j].x) * (balls[i].x - balls[j].x) +
											(balls[i].y - balls[j].y) * (balls[i].y - balls[j].y)
										);

				if(distance < (balls[i].radius + balls[j].radius) ){

					var ax = (balls[i].vx * (balls[i].mass - balls[j].mass) + (2 * balls[j].mass * balls[j].vx)) / (balls[i].mass + balls[j].mass);
                    var ay = (balls[i].vy * (balls[i].mass - balls[j].mass) + (2 * balls[j].mass * balls[j].vy)) / (balls[i].mass + balls[j].mass);
                    balls[j].vx = (balls[j].vx * (balls[j].mass - balls[i].mass) + (2 * balls[i].mass * balls[i].vx)) / (balls[i].mass + balls[j].mass);
                    balls[j].vy = (balls[j].vy * (balls[j].mass - balls[i].mass) + (2 * balls[i].mass * balls[i].vy)) / (balls[i].mass + balls[j].mass);
                    balls[i].vx = ax;
                    balls[i].vy = ay;
				}
			}
		}

		raf = window.requestAnimationFrame(draw);
	}

	function roundRect(ctx, x, y, width, height, radius, fill, stroke) {

		if (typeof stroke == 'undefined') {
			stroke = true;
		}
		if (typeof radius === 'undefined') {
			radius = 5;
		}
		if (typeof radius === 'number') {
			radius = {tl: radius, tr: radius, br: radius, bl: radius};
		} else {
			var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
			for (var side in defaultRadius) {
				radius[side] = radius[side] || defaultRadius[side];
			}
		}

		ctx.beginPath();
		ctx.moveTo(x + radius.tl, y);
		ctx.lineTo(x + width - radius.tr, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		ctx.lineTo(x + width, y + height - radius.br);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		ctx.lineTo(x + radius.bl, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		ctx.lineTo(x, y + radius.tl);
		ctx.quadraticCurveTo(x, y, x + radius.tl, y);
		ctx.closePath();
		if (fill) {
			ctx.fill();
		}
		if (stroke) {
			ctx.stroke();
		}
	}

	function colorSquare(newColor){
		side = 125;
		color = newColor;
		centerX = canvas.width / 2;
    	centerY = canvas.height / 2;

    	ctx.strokeStyle = color;
    	ctx.fillStyle = color;
    	roundRect(ctx, centerX - side / 2, centerY - side / 2, side, side, 5, true);
    	
    	ctx.fillStyle = 'white';
    	ctx.font = 'bold 48px sans-serif';
    	ctx.fillText(ballCount, centerX-12, centerY+12);
	}

	function onBoxTouched(left_X, right_X, upper_Y, bottom_Y){

		for(var i=0; i<ballCount; i++){

			if ( balls[i].x + balls[i].radius >= left_X && balls[i].x - balls[i].radius <= right_X &&
				 balls[i].y + balls[i].radius >= upper_Y && balls[i].y - balls[i].radius <= bottom_Y) {

				colorSquare(balls[i].color);				
				balls.splice(i,1);
				ballCount = ballCount - 1;
			}
		}
	}

	window.requestAnimationFrame(draw);		

}

