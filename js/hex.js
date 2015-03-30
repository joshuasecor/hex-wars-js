
// Reference Firebase //
// var rootRef = new Firebase('https://zeu80fakn4c.firebaseio-demo.com/');
// rootRef.child('gameTitle');


(function() {
  $( "#draggable" ).draggable();
});


// This is chosen by user as "game board size" //
var size = 2;


// Find number of tiles based on Centered Hexagonal Number sequence //
var tiles = 3 * (Math.pow(size, 2) - size) + 1;


// Create all hex objects //
var hexes = [];
for (var i = 0; i < tiles; ++i) {
	hexes[i] = {
		values: [0, 0, 0, 0, 0, 0],
		owner: 0,
		position: []
	};
};


// This will be position of top-left hex //
var row = 0;
var col = size - (size * 2 - 1);


// Dynamically sets position of all hexes //
for (var i = 0; i < tiles; ++i) {
	if (col < 1) {
		hexes[i].position = [col, row];
		++row;
		if (row == size) {
			row = (row + col) * (-1);
			++col;
		}
	} else {
		++row;
		hexes[i].position = [col, row];
		if (row + col + 1 == size) {
			row = (row + col + 1) * (-1);
			++col;
		};
	}
};


// Set card values //
var cards = [
	[5, 2, 5, 2, 5, 2],
	[3, 4, 3, 4, 3, 4],
	[1, 5, 3, 1, 5, 3]
];


// Set turn counter (undefined until first player arrives) and player id's //
var turn;

function setPlayer() {
	if (turn === undefined) {
		playerId = 1;
		turn = -1;
	} else {
		playerId = 2;
		turn++;
	}
};


// Increment turn counter //
function nextTurn() {
	turn++;
	if (turn == 7) {
		winLogic();
	}
};


// Set values of board hex to values of card that was played //
function playCard(cardName, hexNum) {
	if (cardName == "hexagon zero") {
		hexes[hexNum].values = cards[0]
	} else if (cardName == "hexagon one") {
		hexes[hexNum].values = cards[1]
	} else if (cardName == "hexagon two") {
		hexes[hexNum].values = cards[2]
	}
	compareCard(hexNum);
};


// Compare played card to adjacent cards //
function compareCard(hexNum) {
	rowX = hexes[hexNum].position[0];
	colY = hexes[hexNum].position[1];

	for (var i = 0; i < tiles; ++i) {
		if (hexes[i].position = [rowX-1, colY]) {
			var dif = hexes[i].values[2] - hexes[hexNum].values[5];
			if (dif < 0) {
				steal(i);
			} else if (dif = 0) {
				neutralize(i);
			}
		}
	}
};


// When a hex is claimed by a player //
function steal(i) {
	if (turn %2 == 0) {
		hexes[i].owner = 1;
	} else {
		hexes[i].owner = -1;
	}
};


// When a hex is made neutral //
function neutralize(i) {
	hexes[i].owner = 0;
};


// Totals hex owners to determine winner //

var score = 0;

function hexSum() {
	for (var i = 0; i < tiles; ++i) {
		score = score + hexes[i].owner;
	}
};


// Run win logic after all hexes have been filled - negative vs. positive //
function winLogic() {
	if (score > 0) {
		oneWins();
	} else if (score < 0) {
		twoWins();
	} else {
		tieGame();
	}
};


// Define logic for various game outcomes //
function oneWins() {

}

function twoWins() {

}

function tieGame() {

}



