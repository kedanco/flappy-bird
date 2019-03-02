var isGameOver = false;

window.onload = function() {
	const c = document.getElementById("canvas");
	c.width = window.innerWidth;
	c.height = 600;

	const pipeGapMin = 200;
	const pipeGapMax = 260;

	const ctx = c.getContext("2d");

	ctx.fillRect(100, 200, 400, 150);

	const environment = new Environment(c, ctx);
	const bird = new Bird(250, 300, ctx);
	const pipes = [];
	setInterval(function() {
		let pipeSet = generateRandomPipes(
			ctx,
			c.width,
			c.height,
			pipeGapMin,
			pipeGapMax
		);
		pipes.push(pipeSet.top, pipeSet.bottom);
	}, 2500);
	gameLoop();

	function gameLoop() {
		ctx.fillRect(0, 0, c.width, c.height);
		environment.update();
		environment.render();
		pipes.forEach(function(pipe) {
			pipe.update();
			pipe.render();
		});
		bird.update();
		bird.render();
		if (detectCollision(bird, pipes)) {
			gameOver();
		}
		if (!isGameOver) {
			window.requestAnimationFrame(gameLoop);
		} else {
			console.log("last req");
		}
	}
};

function generateRandomPipes(ctx, canvasWidth, canvasHeight, gapMin, gapMax) {
	let gap = ((Math.random() * (gapMax - gapMin + 1)) | 0) + gapMin;

	let lengthTop = Math.round(Math.random() * 200 + 100);
	let lengthBottom = canvasHeight - gap - lengthTop;

	let returnVal = {};
	returnVal.top = new Pipe(canvasWidth, -5, lengthTop, 3, ctx);
	returnVal.bottom = new Pipe(
		canvasWidth,
		canvasHeight + 5 - lengthBottom,
		lengthBottom,
		3,
		ctx
	);

	return returnVal;
}

function detectCollision(bird, pipes) {
	if (!isGameOver) {
		for (var i = 0; i < pipes.length; i++) {
			let e = pipes[i];
			let highPipe = e.ypos <= 0;
			let x0 = e.xpos,
				x1 = e.xpos + e.width;
			if (highPipe) {
				let y0 = e.ypos + e.length;
				let alpha = bird.x;
				let beta = bird.y - bird.height / 2;
				if (alpha > x0 && alpha < x1 && beta < y0) {
					return true;
				}
			} else {
				let y2 = e.ypos;
				let a = bird.x;
				let b = bird.y + bird.height / 2;
				if (a > x0 && a < x1 && b > y2) return true;
			}
		}
		return false;
	}
}

function gameOver() {
	alert("Gameover");
	console.log("Game Over");
	isGameOver = true;
}
