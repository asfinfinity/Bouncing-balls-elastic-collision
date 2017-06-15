function start(){

	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');

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
	var ballCount = getRandomInt(2,10);
	document.getElementById('ballCountInfo').innerHTML = ballCount;
	document.getElementById('box').innerHTML = ballCount;
	var startpointX = 100;
	var startpointY = 50;

	for(var i=0; i<ballCount; i++){

		var randValue = getRandomInt(20,30);
		balls.push({
			x: startpointX,
			y: startpointY,
			vx: getRandomInt(7,8) * direction(),
	  		vy: getRandomInt(7,8) * direction(),
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

		ctx.clearRect(0,0, canvas.width, canvas.height);
		for(var i=0; i<ballCount; i++){
			
			balls[i].draw();
			balls[i].x += balls[i].vx;
			balls[i].y += balls[i].vy;
			
			if (balls[i].y + balls[i].vy > canvas.height || balls[i].y + balls[i].vy < 0) {
				balls[i].vy = -balls[i].vy;
			}
			if (balls[i].x + balls[i].vx > canvas.width || balls[i].x + balls[i].vx < 0) {
				balls[i].vx = -balls[i].vx;
			}
		}

		onBoxTouched();

		//collision check
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


	function onBoxTouched(){

		for(var i=0; i<ballCount; i++){

			if ( balls[i].x + balls[i].radius > 600 && balls[i].x + balls[i].radius < 750 &&
				 balls[i].y + balls[i].radius > 200 && balls[i].y + balls[i].radius < 350) {

				var ele = document.getElementById("box");
				ele.style.backgroundColor = balls[i].color;

				balls.splice(i,1);
				ballCount = ballCount - 1;
				
				if(ballCount == 0){
					ele.style.fontSize = "x-large";
					ele.innerHTML = "Over";
				}
				else{
					ele.innerHTML = ballCount;
				}
				
				document.getElementById('ballCountInfo').innerHTML=" "+ballCount;
			}
		}
	}

	window.requestAnimationFrame(draw);
}
