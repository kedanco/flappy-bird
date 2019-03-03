window.onload = function() {
	const c = document.getElementById("canvas");
	c.width = window.innerWidth;
	c.height = 600;

	const pipeGapMin = 200;
	const pipeGapMax = 260;
	var overOnce = false;

	const ctx = c.getContext("2d");

	ctx.fillRect(100, 200, 400, 150);

	const environment = new Environment(c, ctx);
	const bird = new Bird(250, 300, ctx);
	const pipes = [];
	let pipeSet = generateRandomPipes(
		ctx,
		c.width,
		c.height,
		pipeGapMin,
		pipeGapMax
	);
	pipes.push(pipeSet.top, pipeSet.bottom);
	setInterval(function() {
		if (bird.firstMove) {
			let pipeSet = generateRandomPipes(
				ctx,
				c.width,
				c.height,
				pipeGapMin,
				pipeGapMax
			);
			pipes.push(pipeSet.top, pipeSet.bottom);
		}
	}, 2500);
	gameLoop();

	function gameLoop() {
		bird.update(pipes);
		if (!bird.dead && bird.firstMove) {
			environment.update();
			pipes.forEach(function(pipe) {
				pipe.update();
			});
		}
		environment.render();
		pipes.forEach(function(pipe) {
			pipe.render();
		});
		bird.render();
		if (bird.dead && !overOnce) {
			overOnce = gameOver(ctx, c);
		}
		window.requestAnimationFrame(gameLoop);
	}
};

function generateRandomPipes(ctx, canvasWidth, canvasHeight, gapMin, gapMax) {
	let gap = ((Math.random() * (gapMax - gapMin + 1)) | 0) + gapMin;

	let lengthTop = Math.round(Math.random() * 260 + 40);
	let lengthBottom = canvasHeight - gap - lengthTop;

	let returnVal = {};
	returnVal.top = new Pipe(canvasWidth, -5, lengthTop, 4, ctx);
	returnVal.bottom = new Pipe(
		canvasWidth,
		canvasHeight + 5 - lengthBottom,
		lengthBottom,
		4,
		ctx
	);

	return returnVal;
}

function gameOver(ctx, c) {
	// console.log("Game Over");
	ctx.fillStyle = "maroon";
	ctx.font = "48px Verdana";
	ctx.textAlign = "center";
	ctx.fillText("Game Over!", c.width / 2, c.height / 2);

	return false;
}
