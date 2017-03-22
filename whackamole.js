// Whac-A-Mole

// global components
var canvas;
var gl;
var time = 0.0;
var timer = new Timer();
var timeSec = -1;
var rotationA = 0;
var rotationB = 0;
var paused = false;
var game_over = true;
var smash = 0;
var smashtime = 0;

// navigation system variables
var x = 0; // x-axis displacement from origin
var y = -10; // y-axis displacement from origin 
var z = -16; // z-axis displacemeant from origin 

// score variables
var score = 0;
var hScore = 0;

// mouse position variables
var mouse_x = 0;
var mouse_y = 0;

// determines how long each game lasts (in seconds)
var game_duration = 45;

// create a variable that keeps track of elapsed time, but only runs when not paused
var elapsedTime = 0;

// light position and attribute data
var uniform_sampler;

var pointsArrayA = [];
var normalsArrayA = [];
var uvArrayA = [];

var textureA, textureB, textureC, textureB;

// look at data
var eye = vec3(0, 1, 1.5);
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

var positions = [
	vec3(-8, 0, -8),
	vec3( 0, 0, -8),
	vec3( 8, 0, -8),
	vec3(-8, 0,  0),
	vec3( 0, 0,  0),
	vec3( 8, 0,  0),
	vec3(-8, 0,  8),
	vec3( 0, 0,  8),
	vec3( 8, 0,  8)
];

var molePositions = [
	vec3(-8, -2.5, -8),
	vec3( 0, -2.5, -8),
	vec3( 8, -2.5, -8),
	vec3(-8, -2.5,  0),
	vec3( 0, -2.5,  0),
	vec3( 8, -2.5,  0),
	vec3(-8, -2.5,  8),
	vec3( 0, -2.5,  8),
	vec3( 8, -2.5,  8)
]

var grassPos = [
	vec3(-8, 0,  4),
	vec3(-8, 0, -4),
	vec3(-4, 0,  8),
	vec3(-4, 0,  4),
	vec3(-4, 0,  0),
	vec3(-4, 0, -4),
	vec3(-4, 0, -8),
	vec3( 0, 0,  4),
	vec3( 0, 0, -4),
	vec3( 4, 0,  8),
	vec3( 4, 0,  4),
	vec3( 4, 0,  0),
	vec3( 4, 0, -4),
	vec3( 4, 0, -8),
	vec3( 8, 0,  4),
	vec3( 8, 0, -4),
    
];

var frontPos = [
	//vec3(-8, 0, 8),
	//vec3(-4, 0, 8),
	vec3( 0, 10, -20),
	vec3( 0, 0, 8),
	vec3( 8, 0, 8),
    vec3( 12, 0, 8),
    vec3( -12, 0, 8),
];

// random cube to pop up
var randCube = -1; 

// 0 = mole
// 1 = bomb
// 2 = green
// 3 = explosion
var type = [0, 0, 0, 0, 0, 0, 0, 0, 0];

window.onload = function init() {

	// set up a WebGL capable HTML canvas able to display without error
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if ( !gl ) alert("WebGL isn't available");

	// initialize the timer to represent the game duration
	$("#timer").text(game_duration.toString().toMMSS());

	// keyboard listener
	// key codes from https://css-tricks.com/snippets/javascript/javascript-keycodes/
	document.onkeydown = function(key) {
		key = key || window.event;
		var scream = new Audio("sounds/scream.mp3");
		var whack = new Audio("sounds/whack.mp3");
		var boom = new Audio("sounds/grenade.mp3");

		switch (key.keyCode) {
			case 81: // 'q' for far left
				if (randCube == 0 && type[0] == 0) { // mole
					type[0] = 2;
					whack.play();
					score++;
				}
				if (randCube == 0 && type[0] == 1) { // bomb
					type[0] = 3;
					boom.play();
					game_over = true;
				}
				break;

			case 87: // 'w' for far middle
				if (randCube == 1 && type[1] == 0) { // mole
					type[1] = 2;
					whack.play();
					score++;
				}
				if (randCube == 1 && type[1] == 1) { // bomb
					type[1] = 3;
					boom.play();
					game_over = true;
				}
				break;

			case 69: // 'e' for far right
				if (randCube == 2 && type[2] == 0) { // mole
					type[2] = 2;
					whack.play();
					score++;
				}
				if (randCube == 2 && type[2] == 1) { // bomb
					type[2] = 3;
					boom.play();
					game_over = true;
				}
				break;

			case 65: // 'a' for middle left
				if (randCube == 3 && type[3] == 0) { // mole
					type[3] = 2;
					whack.play();
					score++;
				}
				if (randCube == 3 && type[3] == 1) { // bomb
					type[3] = 3;
					boom.play();
					game_over = true;
				}
				break;

			case 83: // 's' for middle middle
				if (randCube == 4 && type[4] == 0) { // mole
					type[4] = 2;
					whack.play();
					score++;
				}
				if (randCube == 4 && type[4] == 1) { // bomb
					type[4] = 3;
					boom.play();
					game_over = true;
				}
				break;

			case 68: // 'd' for middle right
				if (randCube == 5 && type[5] == 0) { // mole
					type[5] = 2;
					whack.play();
					score++;
				}
				if (randCube == 5 && type[5] == 1) { // bomb
					type[5] = 3;
					boom.play();
					game_over = true;
				}
				break;

			case 90: // 'z' for near left
				if (randCube == 6 && type[6] == 0) { // mole
					type[6] = 2;
					whack.play();
					score++;
				}
				if (randCube == 6 && type[6] == 1) { // bomb
					type[6] = 3;
					boom.play();
					game_over = true;
				}
				break;

			case 88: // 'x' for near middle
				if (randCube == 7 && type[7] == 0) { // mole
					type[7] = 2;
					whack.play();
					score++;
				}
				if (randCube == 7 && type[7] == 1) { // bomb
					type[7] = 3;
					boom.play();
					game_over = true;
				}
				break;

			case 67: // 'c' for near right
				if (randCube == 8 && type[8] == 0) { // mole
					type[8] = 2;
					whack.play();
					score++;
				}
				if (randCube == 8 && type[8] == 1) { // bomb
					type[8] = 3;
					boom.play();
					game_over = true;
				}
				break;

			case 82: // 'r' for reset
				score = 0;
				elapsedTime = 0;
				game_over = false;
				$("#timer").css({ 'color': 'white'});
				$("#timer").text(game_duration.toString().toMMSS());
				break;

			case 80: // 'p' for toggling pause / play, but only toggle when the game isn't over yet
				if (!game_over) {
					paused = !paused;
					if (paused) randCube = -1;
					type = [0, 0, 0, 0, 0, 0, 0, 0, 0];
				}
				break;				
		}

		// Update the score of the game
		$("#score").text("Score: " + score);
	};

	// set the viewport and enable depth
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.enable(gl.DEPTH_TEST);
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

	// load the shaders
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
    
    // load image for mole
    var imageE = new Image();
    imageE.src = "images/brown.png";

    // load image for mole eye
    var imageF = new Image();
    imageF.src = "images/white.png";
    
    var imageG = new Image();
    imageG.src = "images/black.png";
    
    var imageH = new Image();
    imageH.src = "images/nose.png";
    
    var imageI = new Image();
    imageI.src = "images/grey.png";
    
    var imageJ = new Image();
    imageJ.src = "images/red.png";
    
    var imageZ = new Image();
    imageZ.src = "images/wackamole.png";
    
    var imageK = new Image();
    imageK.src = "images/grass.png";
    
    var imageL = new Image();
    imageL.src = "images/dirt.jpg";
    
    // set up brown texture
    textureE = gl.createTexture();
    textureE.image = imageE; 
    textureE.image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, textureE); // bind texture as current texture to use
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureE.image); // upload texture image to GPU
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // parameters for scaling up (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // parameters for scaling down (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // prevent wrapped s coordinates (repeating)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // prevent wrapped t coordinates
		gl.bindTexture(gl.TEXTURE_2D, null);
    }
  
    // set up white texture
    textureF = gl.createTexture();
    textureF.image = imageF; 
    textureF.image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, textureF); // bind texture as current texture to use
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureF.image); // upload texture image to GPU
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // parameters for scaling up (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // parameters for scaling down (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // prevent wrapped s coordinates (repeating)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // prevent wrapped t coordinates
		gl.bindTexture(gl.TEXTURE_2D, null);
    }
  
    // set up black texture
    textureG = gl.createTexture();
    textureG.image = imageG; 
    textureG.image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, textureG); // bind texture as current texture to use
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureG.image); // upload texture image to GPU
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // parameters for scaling up (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // parameters for scaling down (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // prevent wrapped s coordinates (repeating)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // prevent wrapped t coordinates
		gl.bindTexture(gl.TEXTURE_2D, null);
    }
  
    // set up nose texture
    textureH = gl.createTexture();
    textureH.image = imageH; 
    textureH.image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, textureH); // bind texture as current texture to use
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureH.image); // upload texture image to GPU
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // parameters for scaling up (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // parameters for scaling down (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // prevent wrapped s coordinates (repeating)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // prevent wrapped t coordinates
		gl.bindTexture(gl.TEXTURE_2D, null);
    }
  
    // set up nose texture
    textureI = gl.createTexture();
    textureI.image = imageI; 
    textureI.image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, textureI); // bind texture as current texture to use
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureI.image); // upload texture image to GPU
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // parameters for scaling up (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // parameters for scaling down (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // prevent wrapped s coordinates (repeating)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // prevent wrapped t coordinates
		gl.bindTexture(gl.TEXTURE_2D, null);
    }
  
    // set up fire texture
    textureJ = gl.createTexture();
    textureJ.image = imageJ; 
    textureJ.image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, textureJ); // bind texture as current texture to use
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureJ.image); // upload texture image to GPU
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // parameters for scaling up (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // parameters for scaling down (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // prevent wrapped s coordinates (repeating)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // prevent wrapped t coordinates
		gl.bindTexture(gl.TEXTURE_2D, null);
    }
    
    // set up wackamole texture
    textureZ = gl.createTexture();
    textureZ.image = imageZ; 
    textureZ.image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, textureZ); // bind texture as current texture to use
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureZ.image); // upload texture image to GPU
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // parameters for scaling up (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // parameters for scaling down (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // prevent wrapped s coordinates (repeating)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // prevent wrapped t coordinates
		gl.bindTexture(gl.TEXTURE_2D, null);
    }

    // set up wackamole texture
    textureK = gl.createTexture();
    textureK.image = imageK; 
    textureK.image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, textureK); // bind texture as current texture to use
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureK.image); // upload texture image to GPU
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // parameters for scaling up (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // parameters for scaling down (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // prevent wrapped s coordinates (repeating)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // prevent wrapped t coordinates
		gl.bindTexture(gl.TEXTURE_2D, null);
    }
    
    // set up wackamole texture
    textureL = gl.createTexture();
    textureL.image = imageL; 
    textureL.image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, textureL); // bind texture as current texture to use
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureL.image); // upload texture image to GPU
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // parameters for scaling up (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // parameters for scaling down (REQUIREMENT 5)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // prevent wrapped s coordinates (repeating)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // prevent wrapped t coordinates
		gl.bindTexture(gl.TEXTURE_2D, null);
    }
    
	// verticies for cube
	cubeVertices = [
		vec3( 1,   1, 	1),
		vec3( 1,  -1, 	1),
		vec3(-1,   1, 	1),
		vec3(-1,  -1, 	1),
		vec3( 1,   1,  -1),
		vec3( 1,  -1,  -1),
		vec3(-1,   1,  -1),
		vec3(-1,  -1,  -1)
	];

    //load up all the geometries
    
    //CUBES ARE NOT USED< THIS WAS FOR TESTING
	cube(cubeVertices, pointsArrayA, normalsArrayA, uvArrayA, 0);

	hole(pointsArrayA, uvArrayA);

	noHole(pointsArrayA, uvArrayA);

	front(pointsArrayA, uvArrayA);
    
	mole(pointsArrayA, normalsArrayA, uvArrayA);

	bomb(pointsArrayA, normalsArrayA, uvArrayA);
    
    hammer(pointsArrayA, normalsArrayA, uvArrayA);
    
    deadmole(pointsArrayA, normalsArrayA, uvArrayA);

	// create all buffers
	positionBuffer = gl.createBuffer();
	normalBuffer = gl.createBuffer();
	uvBuffer = gl.createBuffer();
	uvBuffer2 = gl.createBuffer();

	// bind position buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArrayA), gl.STATIC_DRAW);

	// bind normal buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArrayA), gl.STATIC_DRAW);

	// bind texture coordinate buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(uvArrayA), gl.STATIC_DRAW);

	// bind texture coordinate buffer for cube #2
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer2);

	// enable bound shader position/normal attributes
	attribute_position = gl.getAttribLocation(program, "vPosition");
	gl.enableVertexAttribArray(attribute_position);

	attribute_UV = gl.getAttribLocation(program, "vTextureCoordinates");
	gl.enableVertexAttribArray(attribute_UV);

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(attribute_position, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	gl.vertexAttribPointer(attribute_UV, 2, gl.FLOAT, false, 0, 0);

	// set variables for all the other uniform variables in shader
	uniform_mvMatrix = gl.getUniformLocation(program, "mvMatrix");
	uniform_pMatrix = gl.getUniformLocation(program, "pMatrix");

    // set up the view matrix
	viewMatrix = lookAt(eye, at, up);
	projectionMatrix = perspective(90, 1, 0.01, 100);

	// reset the timer and render
	timer.reset();
	render();
}

// function to generate a random number
function randNum(prev) {
	do temp =  Math.floor(Math.random() * (positions.length));
	while (temp == randCube)
	return temp;
}

// add mouse event listener (Don't need to use keyboard anymore, but keyboard code is still there for reference)
document.addEventListener("click", checkIfClickedOnMole);

// function that listens for mouse presses
function checkIfClickedOnMole(event) {
    
    //set the hammer animation
    if(smash == 0){
        smash = 1;
        smashtime = 0;
    }
	
	// audio files
	var scream = new Audio("sounds/scream.mp3");
	var whack = new Audio("sounds/whack.mp3");
	var boom = new Audio("sounds/grenade.mp3");

	// general y bounds for moles
	var UPPER_FAR_Y = 285;
	var LOWER_FAR_Y = 359;
	var UPPER_MIDDLE_Y = 333;
	var LOWER_MIDDLE_Y = 431;
	var UPPER_NEAR_Y = 438;
	var LOWER_NEAR_Y = 585;

	// general y bounds for bombs
	var UPPER_FAR_BOMB_Y = 337;
	var UPPER_MIDDLE_BOMB_Y = 378;
	var UPPER_NEAR_BOMB_Y = 492;

	// if the mouse clicked on the NEAR LEFT and it hit a MOLE
	if (event.clientX >= 93 && event.clientX <= 226 && event.clientY >= UPPER_NEAR_Y && event.clientY <= LOWER_NEAR_Y) {
		if (randCube == 6 && type[6] == 0) { 
			type[6] = 2;
			whack.play();
			score++;
		}
	}

	// if the mouse clicked on the NEAR LEFT and it hit a BOMB
	if (event.clientX >= 93 && event.clientX <= 226 && event.clientY >= UPPER_FAR_BOMB_Y && event.clientY <= LOWER_NEAR_Y) { 
		if (randCube == 6 && type[6] == 1) { 
			type[6] = 3;
			boom.play();
			game_over = true;
		}
	}

	// if the mouse clicked on the NEAR MIDDLE and it hit a MOLE
	if (event.clientX >= 427 && event.clientX <= 534 && event.clientY >= UPPER_NEAR_Y && event.clientY <= LOWER_NEAR_Y) {
		if (randCube == 7 && type[7] == 0) { 
			type[7] = 2;
			whack.play();
			score++;
		}
	}

	// if the mouse clicked on the NEAR MIDDLE and it hit a BOMB
	if (event.clientX >= 427 && event.clientX <= 534 && event.clientY >= UPPER_FAR_BOMB_Y && event.clientY <= LOWER_NEAR_Y) {
		if (randCube == 7 && type[7] == 1) { 
			type[7] = 3;
			boom.play();
			game_over = true;
		}
	}

	// if the mouse clicked on the NEAR RIGHT and it hit a MOLE
	if (event.clientX >= 752 && event.clientX <= 872 && event.clientY >= UPPER_NEAR_Y && event.clientY <= LOWER_NEAR_Y) {
		if (randCube == 8 && type[8] == 0) { 
			type[8] = 2;
			whack.play();
			score++;
		}
	}

	// if the mouse clicked on the NEAR RIGHT and it hit a BOMB
	if (event.clientX >= 752 && event.clientX <= 872 && event.clientY >= UPPER_FAR_BOMB_Y && event.clientY <= LOWER_NEAR_Y) {
		if (randCube == 8 && type[8] == 1) { 
			type[8] = 3;
			boom.play();
			game_over = true;
		}
	}

	// if the mouse clicked on the MIDDLE LEFT and it hit a MOLE
	if (event.clientX >= 245 && event.clientX <= 316 && event.clientY >= UPPER_MIDDLE_Y && event.clientY <= LOWER_MIDDLE_Y) {
		if (randCube == 3 && type[3] == 0) { 
			type[3] = 2;
			whack.play();
			score++;
		}
	}

	// if the mouse clicked on the MIDDLE LEFT and it hit a BOMB
	if (event.clientX >= 245 && event.clientX <= 316 && event.clientY >= UPPER_MIDDLE_BOMB_Y && event.clientY <= LOWER_MIDDLE_Y) {
		if (randCube == 3 && type[3] == 1) { 
			type[3] = 3;
			boom.play();
			game_over = true;
		}
	}

	// if the mouse clicked on the MIDDLE MIDDLE and it hit a MOLE
	if (event.clientX >= 449 && event.clientX <= 527 && event.clientY >= UPPER_MIDDLE_Y && event.clientY <= LOWER_MIDDLE_Y) {
		if (randCube == 4 && type[4] == 0) { 
			type[4] = 2;
			whack.play();
			score++;
		}
	}

	// if the mouse clicked on the MIDDLE MIDDLE and it hit a BOMB
	if (event.clientX >= 449 && event.clientX <= 527 && event.clientY >= UPPER_MIDDLE_BOMB_Y && event.clientY <= LOWER_MIDDLE_Y) {
		if (randCube == 4 && type[4] == 1) { 
			type[4] = 3;
			boom.play();
			game_over = true;
		}
	}

	// if the mouse clicked on the MIDDLE RIGHT and it hit a MOLE
	if (event.clientX >= 653 && event.clientX <= 729 && event.clientY >= UPPER_MIDDLE_Y && event.clientY <= LOWER_MIDDLE_Y) {
		if (randCube == 5 && type[5] == 0) { 
			type[5] = 2;
			whack.play();
			score++;
		}
	}

	// if the mouse clicked on the MIDDLE RIGHT and it hit a BOMB
	if (event.clientX >= 653 && event.clientX <= 729 && event.clientY >= UPPER_MIDDLE_BOMB_Y && event.clientY <= LOWER_MIDDLE_Y) {
		if (randCube == 5 && type[5] == 1) { 
			type[5] = 3;
			boom.play();
			game_over = true;
		}
	}

	// if the mouse clicked on the FAR LEFT and it hit a MOLE
	if (event.clientX >= 309 && event.clientX <= 366 && event.clientY >= UPPER_FAR_Y && event.clientY <= LOWER_FAR_Y) {
		if (randCube == 0 && type[0] == 0) { 
			type[0] = 2;
			whack.play();
			score++;
		}
	}

	// if the mouse clicked on the FAR LEFT and it hit a BOMB
	if (event.clientX >= 309 && event.clientX <= 366 && event.clientY >= UPPER_FAR_BOMB_Y && event.clientY <= LOWER_FAR_Y) {
		if (randCube == 0 && type[0] == 1) { 
			type[0] = 3;
			boom.play();
			game_over = true;
		}
	}

	// if the mouse clicked on the FAR MIDDLE and it hit a MOLE
	if (event.clientX >= 459 && event.clientX <= 516 && event.clientY >= UPPER_FAR_Y && event.clientY <= LOWER_FAR_Y) {
		if (randCube == 1 && type[1] == 0) { 
			type[1] = 2;
			whack.play();
			score++;
		}
	}

	// if the mouse clicked on the FAR MIDDLE and it hit a BOMB
	if (event.clientX >= 459 && event.clientX <= 516 && event.clientY >= UPPER_FAR_BOMB_Y && event.clientY <= LOWER_FAR_Y) {
		if (randCube == 1 && type[1] == 1) { 
			type[1] = 3;
			boom.play();
			game_over = true;
		}
	}

	// if the mouse clicked on the FAR RIGHT and it hit a MOLE
	if (event.clientX >= 609 && event.clientX <= 667 && event.clientY >= UPPER_FAR_Y && event.clientY <= LOWER_FAR_Y) {
		if (randCube == 2 && type[2] == 0) { 
			type[2] = 2;
			whack.play();
			score++;
		}
	}

	// if the mouse clicked on the FAR RIGHT and it hit a BOMB
	if (event.clientX >= 609 && event.clientX <= 667 && event.clientY >= UPPER_FAR_BOMB_Y && event.clientY <= LOWER_FAR_Y) {
		if (randCube == 2 && type[2] == 1) { 
			type[2] = 3;
			boom.play();
			game_over = true;
		}
	}

	// update the score of the game
	$("#score").text("Score: " + score);
}

// string function that converts any seconds value to the correct string format of the time MM:SS
String.prototype.toMMSS = function () {
    var sec_num = parseInt(this, 10); 
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (minutes < 10) {minutes = "0" + minutes;}
    if (seconds < 10) {seconds = "0" + seconds;}
    return minutes + ':' + seconds;
}

// function that keeps track of the mouse position anytime the mouse moves
document.onmousemove = function(e) {
    mouse_x = e.clientX;
    mouse_y = e.clientY;
}

// render
function render() {
    
    //update animation variables
    if(smash == 1){
        if(smashtime > 7){
            smash = 0;
            smashtime = 0;
        }
        else {
            smashtime++;
        }
    }
    
	navigationPos = vec3(x, y, z); // keep track of navigation position in easy to read vector
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clears buffer every render call
	var deltaTime = timer.getElapsedTime() / 1000;
	time += deltaTime; // gets time in seconds

	// timeSec will have seconds value and code within this block will only run every second
	if (Math.floor(time) != timeSec && !paused && !game_over) {
		type = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // reset all cubes to moles
		timeSec = Math.floor(time);
		randCube = randNum(randCube);
		if (Math.random() < 0.5 && !paused && !game_over) type[randCube] = 1; // half the objects will appear as bombs

		// only increase the elapsed game time when the game isn't paused and the time left is valid
		if (!paused && !game_over && game_duration - elapsedTime >= 0) elapsedTime++;
	}

	// count down with the timer when not in pause mode
	if (!paused && !game_over) {

		// find the remaining time in seconds, and use jQuery to display the time remaining
		var timeRemaining = Math.round(game_duration - elapsedTime);
		var timeRemainingWithFormatMMSS = (timeRemaining).toString().toMMSS();

		// if the elapsed time goes beyond the duration, set the game_over flag to true
		if (game_duration < elapsedTime) game_over = true;
		else $("#timer").text(timeRemainingWithFormatMMSS);
	}

	// if the game is over, replace the timer with text, and reset the playing field
	else if (game_over)
	{
		// Elapsed time is only 0 when the page is first loaded
		if (elapsedTime != 0) {
			$("#timer").text("Game Over");
			$("#timer").css({ 'color': 'red'});
			type = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			randCube = -1;
		}
	}

	var deltaPos = 0; // keep track of position to translate in y-axis
	if (timeSec < time && time < timeSec + 1) { // only change for 1 second increments
		if (time < timeSec + 0.5) deltaPos = 10 * (time - timeSec); // on the mole moving up
		else deltaPos = 5 - 10 * (time - 0.5 - timeSec); // on the mole moving down
	}

	// set projection matrix
	gl.uniformMatrix4fv(uniform_pMatrix, false, flatten(projectionMatrix));

    //make the panel blocking the center back mole
    mvMatrix = viewMatrix;
    mvMatrix = mult(mvMatrix, translate(navigationPos));
    mvMatrix = mult(mvMatrix, translate(vec3(0,3,0)));
    mvMatrix = mult(mvMatrix, translate(vec3(0,0,-4)));
    gl.bindTexture(gl.TEXTURE_2D, textureG);
    gl.uniformMatrix4fv(uniform_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays(gl.TRIANGLES, 2202, 6);

    //make the panel blocking the center center mole
    mvMatrix = viewMatrix;
    mvMatrix = mult(mvMatrix, translate(navigationPos));
    mvMatrix = mult(mvMatrix, translate(vec3(0,3,0)));
    mvMatrix = mult(mvMatrix, translate(vec3(0,0,0)));
    gl.bindTexture(gl.TEXTURE_2D, textureG);
    gl.uniformMatrix4fv(uniform_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays(gl.TRIANGLES, 2202, 6);
    
    //make the hammer
    ////////////////////////////////////////////////////////
    mvMatrix = viewMatrix;
    mvMatrix = mult(mvMatrix, translate(navigationPos));
    mvMatrix = mult(mvMatrix, translate(vec3(0,0,0)));
    
    //set the x value of hammer
    var x_pos;
    if(mouse_y < (-1.52*mouse_x)+816) x_pos = -8;
    else if (mouse_y < (1.52*mouse_x)-673) x_pos = 8;
    else {
        var range = ((mouse_y+673)/1.52)-((mouse_y-816)/-1.52);
        x_pos = -8 + (16/range)*(mouse_x-((mouse_y-816)/-1.52));
    }
    
    //set the z value of hammer
    var z_pos = ((mouse_y-300)*(16/210)) - 8;
    if (mouse_y < 300) z_pos = -8;
    else if (mouse_y > 510) z_pos = 8;
    mvMatrix = mult(mvMatrix, translate(vec3(x_pos,0,z_pos)));
    
    //update position of hammer during its animation
    switch(smashtime){
        case 0:
            break;
        case 1:
            mvMatrix = mult(mvMatrix, rotate(-6, vec3(1,0,-1)));
            mvMatrix = mult(mvMatrix, translate(vec3(0,-1,0)));
            break;
        case 2:
            mvMatrix = mult(mvMatrix, rotate(-12, vec3(1,0,-1)));
            mvMatrix = mult(mvMatrix, translate(vec3(0,-2,0)));
            break;
        case 3:
            mvMatrix = mult(mvMatrix, rotate(-18, vec3(1,0,-1)));
            mvMatrix = mult(mvMatrix, translate(vec3(0,-3,0)));
            break;
        case 4:
            mvMatrix = mult(mvMatrix, rotate(-18, vec3(1,0,-1)));
            mvMatrix = mult(mvMatrix, translate(vec3(0,-3,0)));
            break;
        case 5:
            mvMatrix = mult(mvMatrix, rotate(-12, vec3(1,0,-1)));
            mvMatrix = mult(mvMatrix, translate(vec3(0,-2,0)));
            break;
        case 6:
            mvMatrix = mult(mvMatrix, rotate(-6, vec3(1,0,-1)));
            mvMatrix = mult(mvMatrix, translate(vec3(0,-1,0)));
            break;
        case 7:
            break;
        default:
            break;
    }
    
    
    //draw the hammer
    gl.uniformMatrix4fv(uniform_mvMatrix, false, flatten(mvMatrix));
    gl.bindTexture(gl.TEXTURE_2D, textureI);
    gl.drawArrays(gl.TRIANGLES, 36072, 2160);
    
    gl.bindTexture(gl.TEXTURE_2D, textureE);
    gl.drawArrays(gl.TRIANGLES, 36072+2160, 2160);
    ////////////////////////////////////////////////////////
    
	//make the front panel
	for (var i = 0; i < 2; i++){
		mvMatrix = viewMatrix;
		mvMatrix = mult(mvMatrix, translate(navigationPos));
		mvMatrix = mult(mvMatrix, translate(vec3(0,3,0)));

		mvMatrix = mult(mvMatrix, translate(frontPos[i]));

		gl.bindTexture(gl.TEXTURE_2D, textureZ);
        
        if( i == 1) gl.bindTexture(gl.TEXTURE_2D, textureL);

		gl.uniformMatrix4fv(uniform_mvMatrix, false, flatten(mvMatrix));
		gl.drawArrays(gl.TRIANGLES, 2202, 6);
	}

	//make the 16 nonholes on the board
	for (var i = 0; i < 16; i++) {
		mvMatrix = viewMatrix;
		mvMatrix = mult(mvMatrix, translate(navigationPos));
		mvMatrix = mult(mvMatrix, translate(vec3(0,3,0)));

		mvMatrix = mult(mvMatrix, translate(grassPos[i]));

		gl.bindTexture(gl.TEXTURE_2D, textureK);

		gl.uniformMatrix4fv(uniform_mvMatrix, false, flatten(mvMatrix));
		gl.drawArrays(gl.TRIANGLES, 2196, 6);
	}

	//make the 9 moles and holes
	for (var i = 0; i < 9; i++) {

		mvMatrix = viewMatrix;
		mvMatrix = mult(mvMatrix, translate(navigationPos));

		//first make the 9 holes, they will be always on top
		var hMatrix = mult(mvMatrix, translate(positions[i]));
		hMatrix = mult(hMatrix, translate(vec3(0,3,0)));
		gl.uniformMatrix4fv(uniform_mvMatrix, false, flatten(hMatrix));
		gl.bindTexture(gl.TEXTURE_2D, textureK); // change texture to green
		gl.drawArrays(gl.TRIANGLES, 36, 360*6);

		mvMatrix = viewMatrix;
		mvMatrix = mult(mvMatrix, translate(navigationPos));
		if (randCube == i && !paused) mvMatrix = mult(mvMatrix, translate(vec3(molePositions[i][0], molePositions[i][1] + deltaPos, molePositions[i][2]))); // centered at (-4, 0, 0)
		else mvMatrix = mult(mvMatrix, translate(molePositions[i]));

    	gl.uniformMatrix4fv(uniform_mvMatrix, false, flatten(mvMatrix));
        
	    switch (type[i]) {
	    	// draw a mole
			case 0:                                             
				gl.bindTexture(gl.TEXTURE_2D, textureE); // draw the shaft and head
		        gl.drawArrays(gl.TRIANGLES, 2208, 6000);
		        gl.bindTexture(gl.TEXTURE_2D, textureF); // draw the two eyes
		        gl.drawArrays(gl.TRIANGLES, 8208, 3840*2);
		        gl.bindTexture(gl.TEXTURE_2D, textureG); // draw the two eye shadows
		        gl.drawArrays(gl.TRIANGLES, 15888, 2160*2);
                gl.bindTexture(gl.TEXTURE_2D, textureH); // draw the two sidelips
		        gl.drawArrays(gl.TRIANGLES, 20208, 3840*2);
		        gl.bindTexture(gl.TEXTURE_2D, textureH); // draw a middle shaft for lip
		        gl.drawArrays(gl.TRIANGLES, 27888, 2160);
				break;
			// draw a bomb
			case 1:                                             
		        gl.bindTexture(gl.TEXTURE_2D, textureI); //change to grey
				gl.drawArrays(gl.TRIANGLES, 30048, 6000); //draw sphere and cyliner
		        gl.bindTexture(gl.TEXTURE_2D, textureJ); //change to red
		        gl.drawArrays(gl.TRIANGLES, 36048, 12);
		        gl.bindTexture(gl.TEXTURE_2D, textureF); //change to white
		        gl.drawArrays(gl.TRIANGLES, 36048+12, 12);
				break;
			// draw a dead mole
			case 2:
				gl.bindTexture(gl.TEXTURE_2D, textureE); // draw the shaft and head
		        gl.drawArrays(gl.TRIANGLES, 2208, 6000); 
                gl.bindTexture(gl.TEXTURE_2D, textureG); //color to black
                gl.drawArrays(gl.TRIANGLES, 40392, 2160*4); //draw cross eye
		        gl.bindTexture(gl.TEXTURE_2D, textureH); //color to pink
		        gl.drawArrays(gl.TRIANGLES, 20208, 3840*2); //draw the two sidelips
		        gl.bindTexture(gl.TEXTURE_2D, textureH); //draw a middle shaft for lip
		        gl.drawArrays(gl.TRIANGLES, 27888, 2160);
				break;
			// draw explosion
			case 3:
				break;
		}
	}

	// save the new high score if the current score beats the high score
	if (hScore < score) hScore = score;
	$("#hScore").text("High Score: " + hScore);
	window.requestAnimFrame(render);
}

//geometry functions are below

function hammer(points, normals, uv){
    var temp_points = [];
    
    cylinder(temp_points, normals, uv, 1, 2);
    
    for (var i = 0; i < temp_points.length; i++)
        points.push( add(applyMat(temp_points[i], rotate(18, vec3(1,0,-1))), vec3(0,6,0)) );
    
    temp_points = [];
    
    cylinder(temp_points, normals, uv, 0.1, 3);
    
    for (var i = 0; i < temp_points.length; i++)
        points.push( add(applyMat(temp_points[i], rotate(18+90, vec3(1,0,-1))), vec3(0,7,0)) );
    
}

function bomb(points, normals, uv){
    var temp_points = [];
    
    //main bomb is sphere and cylinder
    sphere(points, normals, uv, 1.1);
    cylinder(temp_points,normals, uv, 0.4, 0.3);
    
    for (var i = 0; i < temp_points.length; i++)
        points.push( add(applyMat(temp_points[i], rotate(-20, vec3(0,0,1))), vec3(0.3,1,0)) );
    
    //add flames to the top
    temp_points = [];
    flames(temp_points, normals, uv);
    for(var i = 0; i < temp_points.length; i++)
        points.push( add(applyMat(temp_points[i], rotate(-20, vec3(0,0,1))), vec3(0.4,1.2,0)) );
}

function deadmole(points, normals, uv){
    
    var temp_points = [];
    
    //left eye shadow
    temp_points = [];
    cylinder(temp_points, normals, uv, 0.07, 0.5);
    for(var i = 0; i < temp_points.length; i++){
        points.push( add(applyMat(temp_points[i], rotate(45, vec3(0,0,1))), vec3(-0.3,2.6,1.11)));
    }
    
    temp_points = [];
    cylinder(temp_points, normals, uv, 0.07, 0.5);
    for(var i = 0; i < temp_points.length; i++){
        points.push( add(applyMat(temp_points[i], rotate(-45, vec3(0,0,1))), vec3(-0.7,2.6,1.1)));
    }
    
    temp_points = [];
    cylinder(temp_points, normals, uv, 0.07, 0.5);
    //right eye shadow
    for(var i = 0; i < temp_points.length; i++){
        points.push( add(applyMat(temp_points[i], rotate(-45, vec3(0,0,1))), vec3(0.3,2.6,1.11)));
    }
    
    temp_points = [];
    cylinder(temp_points, normals, uv, 0.07, 0.5);
    for(var i = 0; i < temp_points.length; i++){
        points.push( add(applyMat(temp_points[i], rotate(45, vec3(0,0,1))), vec3(0.7,2.6,1.1)));
    }
}

function mole(points, normals, uv){
    var temp_points = [];
    
    //head
    sphere(temp_points, normals, uv, Math.sqrt(2));
    for(var i = 0; i < temp_points.length; i++){
        points.push( add(temp_points[i], vec3(0,2,0)));
    }
    
    //body
    cylinder(points, normals, uv, Math.sqrt(2), 2);
    
    //left eye
    temp_points = [];
    sphere(temp_points, normals, uv, 0.07);
    for(var i = 0; i < temp_points.length; i++){
        points.push( add(temp_points[i], vec3(-0.5,2.9,1.1)));
    }
    
    //right eye
    temp_points = [];
    sphere(temp_points, normals, uv, 0.07);
    for(var i = 0; i < temp_points.length; i++){
        points.push( add(temp_points[i], vec3(0.5,2.9,1.1)));
    }
    
    //left eye shadow
    temp_points = [];
    cylinder(temp_points, normals, uv, 0.1, 0.3);
    for(var i = 0; i < temp_points.length; i++){
        points.push( add(temp_points[i], vec3(-0.5,2.6,1.1)));
    }
    
    //right eye shadow
    temp_points = [];
    cylinder(temp_points, normals, uv, 0.1, 0.3);
    for(var i = 0; i < temp_points.length; i++){
        points.push( add(temp_points[i], vec3(0.5,2.6,1.1)));
    }
    
    //left mouth
    temp_points = [];
    sphere(temp_points, normals, uv, 0.3);
    for(var i = 0; i < temp_points.length; i++){
        points.push( add(temp_points[i], vec3(-0.3,2.1,1.4)));
    }
    
    //right mouth
    temp_points = [];
    sphere(temp_points, normals, uv, 0.3);
    for(var i = 0; i < temp_points.length; i++){
        points.push( add(temp_points[i], vec3(0.3,2.1,1.4)));
    }
    
    //middle mouth
    temp_points = [];
    cylinder(temp_points, normals, uv,0.3,0.6);     
    for(var i = 0; i < temp_points.length; i++){
        points.push( add(applyMat(temp_points[i], rotate(90, vec3(0,0,1))), vec3(0.3,2.1,1.4)  ));
    }
}

function cylinder(positions, normals, uv, radius, height){

    //create a cylinder by making a bunch of rectangles in a circle, 
    for(var i = 0; i < 360; i++){
        var rad = radians(i);
        var rad1 = radians(i+1);
        
        var topl = vec3(  radius * Math.cos(rad), height, radius* Math.sin(rad)   );
        var topr = vec3( radius * Math.cos(rad1), height, radius* Math.sin(rad1)  );
        var botl = vec3(  radius * Math.cos(rad),      0, radius* Math.sin(rad)   );
        var botr = vec3( radius * Math.cos(rad1),      0, radius* Math.sin(rad1)  );
        positions.push(topl);
        positions.push(botl);
        positions.push(botr);
        positions.push(topl);
        positions.push(topr);
        positions.push(botr);
        
        var right = subtract(botr, botl); 
        var left = subtract(topl, botl);
        normals.push(normalize( cross(right, left) ,false));
        normals.push(normalize( cross(right, left) ,false));
        normals.push(normalize( cross(right, left) ,false));
        normals.push(normalize( cross(right, left) ,false));
        normals.push(normalize( cross(right, left) ,false));
        normals.push(normalize( cross(right, left) ,false));
        
        pushTextureCoords(uv);
    }
}

function flames(points, normals, uv){
    //inner flame
    points.push(vec3(  -0.3,  0.15,  0));
    points.push(vec3(  -0.2,    0,  0));
    points.push(vec3(     0,    0,  0));
    points.push(vec3(     0,  0.2,  0));
    points.push(vec3( -0.15,  0.05,  0));
    points.push(vec3(     0,    0,  0));
    points.push(vec3(     0,  0.2,  0));
    points.push(vec3(  0.15, 0.05,  0));
    points.push(vec3(     0,    0,  0));
    points.push(vec3(   0.3,  0.15,  0));
    points.push(vec3(   0.2,    0,  0));
    points.push(vec3(     0,    0,  0));
    
    //outer flame
    points.push(vec3(  -0.6,  0.3,  -0.01));
    points.push(vec3(  -0.4,    0,  -0.01));
    points.push(vec3(     0,    0,  -0.01));
    points.push(vec3(     0,  0.4,  -0.01));
    points.push(vec3( -0.3,  0.1,  -0.01));
    points.push(vec3(     0,    0,  -0.01));
    points.push(vec3(     0,  0.4,  -0.01));
    points.push(vec3(  0.3, 0.1,  -0.01));
    points.push(vec3(     0,    0,  -0.01));
    points.push(vec3(   0.6,  0.3,  -0.01));
    points.push(vec3(   0.4,    0,  -0.01));
    points.push(vec3(     0,    0,  -0.01));
    
    for(var i = 0; i < 8; i++ ){
        uv.push(vec2(0 , 1 ));
        uv.push(vec2(0 , 0 ));
        uv.push(vec2(1 , 0 ));
    }
    
    for(var j = 0; j < 24; j++){
        normals.push(vec3(0,0,1));            
    }
}

//global variable used to keep track of current indice
var MAXIN = 0; 

function middle(u, v, radius){  //takes in two vectors and the radius and computes the midpoint expanded to the edge of circle
    var x, y, z;    
    
    //compute mid way points for each axis
    x = (u[0]+v[0])/2;
    y = (u[1]+v[1])/2;
    z = (u[2]+v[2])/2;
    
    //normalize middle vector and then multiply by radius to get the correct middle vector
    return scale_vec(radius,normalize(vec3( x, y, z) , false));
}

//this is the recursive function that splits each face of the sphere into 4 if we still need to split
//Once we get to the bottom layer of the function, we output the individual triangle into position, normal, texture_coords, and indices
function recursive_split(positions, temp_positions = [], normals, texture_coords, indices, vecn1, vecn2, vecn3, num_split, radius, max){
    
    if(num_split == 0){ //if base case, record the triangle
        
        
        //push three vectors for triangle
        positions.push(temp_positions[vecn1], temp_positions[vecn2], temp_positions[vecn3]);
                
        //calculate and push three normals for each triangle
        var right = subtract(temp_positions[vecn3], temp_positions[vecn2]); 
        var left = subtract(temp_positions[vecn1], temp_positions[vecn2]);
        normals.push(normalize( cross(right, left) ,false));
        normals.push(normalize( cross(right, left) ,false));
        normals.push(normalize( cross(right, left) ,false));
                
        //push texture coords
        texture_coords.push(vec2( 0, 1));
        texture_coords.push(vec2( 0, 0));
        texture_coords.push(vec2( 1, 0));
            
        //add indices
        indices.push(MAXIN, MAXIN+1, MAXIN+2);
        MAXIN = MAXIN+3;
            
        return max;
        
    } 
    else { //else recursively call each sub-triangle
        
        var mid1, mid2, mid3;
        
        //compute middle points
        mid1 = middle(temp_positions[vecn1], temp_positions[vecn2], radius); 
        mid2 = middle(temp_positions[vecn1], temp_positions[vecn3], radius);
        mid3 = middle(temp_positions[vecn2], temp_positions[vecn3], radius);
                
        //add middle points to temperary array
        temp_positions.push(mid1, mid2, mid3);
                
        //update max value
        var newMax = max+3;
            
        //recursively call each triangle
        newMax = recursive_split(positions, temp_positions, normals, texture_coords, indices, vecn1, max+1, max+2, num_split-1, radius, newMax);
        newMax = recursive_split(positions, temp_positions, normals, texture_coords, indices, max+1, vecn2, max+3, num_split-1, radius, newMax);
        newMax = recursive_split(positions, temp_positions, normals, texture_coords, indices, max+2, max+3, vecn3, num_split-1, radius, newMax);
        newMax = recursive_split(positions, temp_positions, normals, texture_coords, indices, max+1, max+2, max+3, num_split-1, radius, newMax);
        return newMax;      
    }
}

//geometry for the sphere
function sphere(points, normals, uv, radius) {
    // compute the length and width of the three rectangles that creates the icosphere
    var l = radius * (Math.sqrt(0.5+(1/(2*Math.sqrt(5)))));
    var w = radius * (Math.sqrt(0.5-(1/(2*Math.sqrt(5)))));
    
    MAXIN = 0;
    var temp_positions = [];
              
    //store 12 initial positions
    temp_positions.push( vec3( w,  l,  0) );
    temp_positions.push( vec3(-w,  l,  0) );
    temp_positions.push( vec3( w, -l,  0) );
    temp_positions.push( vec3(-w, -l,  0) );
              
    temp_positions.push( vec3( 0,  w,  l) );
    temp_positions.push( vec3( 0, -w,  l) );
    temp_positions.push( vec3( 0,  w, -l) );
    temp_positions.push( vec3( 0, -w, -l) );
              
    temp_positions.push( vec3( l,  0,  w) );
    temp_positions.push( vec3( l,  0, -w) );
    temp_positions.push( vec3(-l,  0,  w) );
    temp_positions.push( vec3(-l,  0, -w) );
                  
    //indices for the 20 triangles in the icosphere
    var mainIndices = [  1, 10,  4,
                       1,  4,  0,
                       1,  0,  6,  
                       1,  6, 11,
                       1, 11, 10,
                       10,  5,  4,
                       4,  8,  0,
                       0,  9,  6,
                       6,  7, 11,
                       11,  3, 10,
                       2,  8,  5, 
                       2,  5,  3,
                       2,  3,  7,
                       2,  7,  9,
                       2,  9,  8,
                       8,  4,  5,
                       5, 10,  3,
                       3, 11,  7,
                       7,  6,  9,
                       9,  0,  8  ];
              
    //current number of points in temp array
    var currentmax = 11;
    
    var indices = [];
              
    //recursively call each of the 20 faces in the icosphere
    for (var i = 0; i < mainIndices.length; i += 3) {
        currentmax = recursive_split(points, 
                                     temp_positions,
                                     normals, 
                                     uv, 
                                     indices, 
                                     mainIndices[i], 
                                     mainIndices[i+1], 
                                     mainIndices[i+2],
                                     3,
                                     radius,
                                     currentmax
                                    );
    }
}

//geometry for the fron squares
function front(points, uv) {
	points.push(vec3(-10, 0, 2));
	points.push(vec3(-10, -5, 2));
	points.push(vec3(10, -5, 2));
	points.push(vec3(-10, 0, 2));
	points.push(vec3(10, 0, 2));
	points.push(vec3(10, -5, 2));

	pushTextureCoords(uv);
}

//geomtry for nonhole squares
function noHole(points, uv){
	points.push(vec3(-2, 0, 2));
	points.push(vec3(-2, 0, -2));
	points.push(vec3( 2, 0, -2));
	points.push(vec3( -2, 0,  2));
	points.push(vec3(  2, 0, 2));
	points.push(vec3( 2, 0, -2));

	pushTextureCoords(uv);
}

//geometry for hole squares
function hole(points, uv) {
	var i;
	var top = vec3(0, 0, 2);
	var holeRad = Math.sqrt(2);

	//make the top right quarter of a square with circle hole
	for(i = 0; i < 45; i++) {
		var rad = radians(i);
		var rad1 = radians(i+1);

		points.push(add(top, vec3(i*(2.0/45.0), 0, 0)));
		points.push(vec3(holeRad * Math.sin(rad), 0, holeRad * Math.cos(rad)));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));
		points.push(add(top, vec3(i*(2.0/45.0), 0, 0)));
		points.push(add(top, vec3((i+1)*(2.0/45.0), 0, 0)));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));

		pushTextureCoords(uv);

	}

	top = vec3(2, 0, 2);

	//make the top right quarter of a square with circle hole
	for(i = 0; i < 45; i++) {
		var rad = radians(i+45);
		var rad1 = radians(i+45+1);

		points.push(add(top, vec3(0, 0,  -1 * (i*(2.0/45.0)))));
		points.push(vec3(holeRad * Math.sin(rad), 0, holeRad * Math.cos(rad)));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));
		points.push(add(top, vec3(0, 0,  -1 * (i*(2.0/45.0)))));
		points.push(add(top, vec3(0, 0,  -1 * ((i+1)*(2.0/45.0)))));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));

		pushTextureCoords(uv);
	}

	top = vec3(2, 0, 0);
	//make the bottom right quarter
	for(i = 0; i < 45; i++) {
		var rad = radians(i+90);
		var rad1 = radians(i+90+1);

		points.push(add(top, vec3(0, 0,  -1 * (i*(2.0/45.0)))));
		points.push(vec3(holeRad * Math.sin(rad), 0, holeRad * Math.cos(rad)));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));
		points.push(add(top, vec3(0, 0,  -1 * (i*(2.0/45.0)))));
		points.push(add(top, vec3(0, 0,  -1 * ((i+1)*(2.0/45.0)))));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));

		pushTextureCoords(uv);
	}

	top = vec3(2,0,-2);
	//make the bottom right quarter
	for(i = 0; i < 45; i++) {
		var rad = radians(i+90+45);
		var rad1 = radians(i+90+45+1);

		points.push(add(top, vec3(-1 * (i*(2.0/45.0)), 0,  0)));
		points.push(vec3(holeRad * Math.sin(rad), 0, holeRad * Math.cos(rad)));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));
		points.push(add(top, vec3(-1 * (i*(2.0/45.0)), 0,  0)));
		points.push(add(top, vec3(-1 * ((i+1)*(2.0/45.0)), 0,  0)));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));

		pushTextureCoords(uv);
	}

	top = vec3(0,0,-2);
	//make the bottom left quarter
	for(i = 0; i < 45; i++) {
		var rad = radians(i+180);
		var rad1 = radians(i+180+1);

		points.push(add(top, vec3(-1 * (i*(2.0/45.0)), 0,  0)));
		points.push(vec3(holeRad * Math.sin(rad), 0, holeRad * Math.cos(rad)));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));
		points.push(add(top, vec3(-1 * (i*(2.0/45.0)), 0,  0)));
		points.push(add(top, vec3(-1 * ((i+1)*(2.0/45.0)), 0,  0)));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));

		pushTextureCoords(uv);
	}

	top = vec3(-2,0,-2);
	//make the bottom left quarter
	for(i = 0; i < 45; i++) {
		var rad = radians(i+180+45);
		var rad1 = radians(i+180+45+1);

		points.push(add(top, vec3(0, 0,  (i*(2.0/45.0)))));
		points.push(vec3(holeRad * Math.sin(rad), 0, holeRad * Math.cos(rad)));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));
		points.push(add(top, vec3(0, 0,  (i*(2.0/45.0)))));
		points.push(add(top, vec3(0, 0,  ((i+1)*(2.0/45.0)))));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));

		pushTextureCoords(uv);
	}

	top = vec3(-2,0,0);
	//make the top left quarter
	for(i = 0; i < 45; i++) {
		var rad = radians(i+270);
		var rad1 = radians(i+270+1);

		points.push(add(top, vec3(0, 0,  (i*(2.0/45.0)))));
		points.push(vec3(holeRad * Math.sin(rad), 0, holeRad * Math.cos(rad)));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));
		points.push(add(top, vec3(0, 0,  (i*(2.0/45.0)))));
		points.push(add(top, vec3(0, 0,  ((i+1)*(2.0/45.0)))));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));

		pushTextureCoords(uv);
	}

	top = vec3(-2,0,2);
	//make the top left quarter
	for(i = 0; i < 45; i++) {
		var rad = radians(i+270+45);
		var rad1 = radians(i+270+45+1);

		points.push(add(top, vec3(i*(2.0/45.0), 0, 0)));
		points.push(vec3(holeRad * Math.sin(rad), 0, holeRad * Math.cos(rad)));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));
		points.push(add(top, vec3(i*(2.0/45.0), 0, 0)));
		points.push(add(top, vec3((i+1)*(2.0/45.0), 0, 0)));
		points.push(vec3(holeRad * Math.sin(rad1), 0, holeRad * Math.cos(rad1)));

		pushTextureCoords(uv);
	}
}

// calls quad function to push texture and cube verticies
function cube(vertices, points, normals, uv, scale) {
	quad(vertices, points, uv, 0, 1, 2, 3, scale);
	quad(vertices, points, uv, 4, 0, 6, 2, scale);
	quad(vertices, points, uv, 4, 5, 0, 1, scale);
	quad(vertices, points, uv, 2, 3, 6, 7, scale);
	quad(vertices, points, uv, 6, 7, 4, 5, scale);
	quad(vertices, points, uv, 1, 5, 3, 7, scale);
}

// pushes vertices for texture
// pushes points for cube
function quad(vertices, points, uv, v1, v2, v3, v4, scale) {
	pushScaledCoords(uv, scale); // handles scaling of texture map

	// push points
	points.push(vertices[v1]);
	points.push(vertices[v3]);
	points.push(vertices[v4]);
	points.push(vertices[v1]);
	points.push(vertices[v4]);
	points.push(vertices[v2]);
}

// texture 1 should take up the entire cube face, texture 2 should be scaled 50%
function pushScaledCoords(uv, scale) {
	uv.push(vec2(0 - scale, 0 - scale));
	uv.push(vec2(1 + scale, 0 - scale));
	uv.push(vec2(1 + scale, 1 + scale));
	uv.push(vec2(0 - scale, 0 - scale));
	uv.push(vec2(1 + scale, 1 + scale));
	uv.push(vec2(0 - scale, 1 + scale));
}

//texture coords for one square
function pushTextureCoords(uv) {
	uv.push(vec2(0 , 0 ));
	uv.push(vec2(0 , 1 ));
	uv.push(vec2(1 , 1 ));
	uv.push(vec2(0 , 0 ));
	uv.push(vec2(1, 0 ));
	uv.push(vec2(1 , 1 ));
}
