
// Reference Firebase //
var gameRef = new Firebase("https://hex-wars.firebaseio.com/");


// This is chosen by user as "game board size" //
var size = 2;


// Find number of tiles based on Centered Hexagonal Number sequence //
var tiles = 3 * (Math.pow(size, 2) - size) + 1;


// Create all hex objects //
var hexes = [];

for (var i = 0; i < tiles; ++i) {
	hexes[i] = {
		values: [-1, -1, -1, -1, -1, -1],
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


// Set turn counter //
var turn = 0;


// ref.on("value", function(snapshot) {
// 	if (snapshot.val() === null) {
		// gameRef.set({
		// 	hexes: hexes,
		// 	turn: 1
		// })
// 	} else {
// 		player =
// }); 2;
// 	}



// Increment turn counter //
function nextTurn() {
	turn++;
	if (turn == tiles) {
		winLogic();
	};
  gameRef.child('turn').update({
		turn: turn
	});
};

gameRef.child('turn').on('value', function(snapshot) {
  var change = snapshot.val();
  turn = change.turn;
});


// Set values of board hex to values of card that was played //
function playCard(cardName, hexNum) {
	if (turn %2 == 0) {
		hexes[hexNum].owner = 1;
		colorSwapBlue(hexNum);
	} else if (turn %2 != 0) {
		hexes[hexNum].owner = -1;
		colorSwapRed(hexNum);
	};

	if (cardName == "hexagon zero") {
		hexes[hexNum].values = cards[0]
	} else if (cardName == "hexagon one") {
		hexes[hexNum].values = cards[1]
	} else if (cardName == "hexagon two") {
		hexes[hexNum].values = cards[2]
	};
	gameRef.child('hex_data').update({
		hexes: hexes
	});
};

gameRef.child('hex_data').on('value', function(snapshot) {
  var change = snapshot.val();
  console.log(change.hexes);
  hexes = change.hexes;
  for (var i = 0; i < tiles; ++i) {
  	if (hexes[i].owner == 1) {
			colorSwapBlue(i);
		} else if (hexes[i].owner == -1) {
			colorSwapRed(i);
		} else if (hexes[i].owner == 0) {
			colorSwapWhite(i);
		};
  };
  for (var i = 0; i < tiles; ++i) {
  	if (_.isEqual(hexes[i].values, cards[0])) {
	    $( "#hexy" + i )
	      .removeClass( 'hexagon white' )
	      .addClass( 'hexagon zero' )
	      .droppable( 'disable' )
  	} else if (_.isEqual(hexes[i].values, cards[1])) {
	    $( "#hexy" + i )
	      .removeClass( 'hexagon white' )
	      .addClass( 'hexagon one' )
	      .droppable( 'disable' )
	  } else if (_.isEqual(hexes[i].values, cards[2])) {
	    $( "#hexy" + i )
	      .removeClass( 'hexagon white' )
	      .addClass( 'hexagon one' )
	      .droppable( 'disable' )
	    }
  };
});


// Find cards adjacent to played card //
function findCard(hexNum) {
	var rowX = hexes[hexNum].position[0];
	var colY = hexes[hexNum].position[1];
	for (var i = 0; i < tiles; ++i) {
		if (hexes[i].values[0] > 0){
			if (_.isEqual(hexes[i].position, [(rowX-1), colY])) {
				dif = (hexes[i].values[2] - hexes[hexNum].values[5]);
				compareCard(dif, i);
			} else if (_.isEqual(hexes[i].position, [rowX-1, colY+1])) {
				dif = hexes[i].values[3] - hexes[hexNum].values[0];
				compareCard(dif, i);
			} else if (_.isEqual(hexes[i].position, [rowX, colY-1])) {
				dif = hexes[i].values[1] - hexes[hexNum].values[4];
				compareCard(dif, i);
			} else if (_.isEqual(hexes[i].position, [rowX, colY+1])) {
				dif = hexes[i].values[4] - hexes[hexNum].values[1];
				compareCard(dif, i);
			} else if (_.isEqual(hexes[i].position, [rowX+1, colY-1])) {
				dif = hexes[i].values[0] - hexes[hexNum].values[3];
				compareCard(dif, i);
			} else if (_.isEqual(hexes[i].position, [rowX+1, colY])) {
				dif = hexes[i].values[5] - hexes[hexNum].values[2];
				compareCard(dif, i);
			}
		};
	};
};


// Compare adjacent card to played card //
function compareCard(dif, i) {
	if (dif < 0) {
		steal(i);
	} else if (dif == 0) {
		neutralize(i);
	}
};


// When a hex is claimed by a player //
function steal(i) {
	if (turn %2 == 0) {
		hexes[i].owner = 1;
		colorSwapBlue(i);
	} else if (turn %2 != 0) {
		hexes[i].owner = -1;
		colorSwapRed(i);
	}
};


// When a hex is made neutral //
function neutralize(i) {
	if (turn %2 == 0 && hexes[i].owner == -1) {
		hexes[i].owner = 0;
		colorSwapWhite(i);
	};
	if (turn %2 != 0 && hexes[i].owner == 1) {
		hexes[i].owner = 0;
		colorSwapWhite(i);
	};
};


// Change color based on hex ownership //


function colorSwapBlue(i) {
	document.getElementById("hexy" + i).style.backgroundColor = "#4169E1";
};

function colorSwapRed(i) {
	document.getElementById("hexy" + i).style.backgroundColor = "#DC143C";
};

function colorSwapWhite(i) {
	document.getElementById("hexy" + i).style.backgroundColor = "#FFF8DC";
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

};

function twoWins() {

};

function tieGame() {

};

var playerId;

var username;


// ** Player assignment ** via https://gist.github.com/anantn/4323981 //

function go() {
  var userId = prompt('Username?', 'Guest');
  // Consider adding '/<unique id>' if you have multiple games.
  assignPlayerNumberAndPlayGame(userId, gameRef);
};
 
// The maximum number of players.  If there are already 
// NUM_PLAYERS assigned, users won't be able to join the game.
var NUM_PLAYERS = 2;
 
// The root of your game data.
var GAME_LOCATION = 'https://hex-wars.firebaseio.com/';
 
// A location under GAME_LOCATION that will store the list of 
// players who have joined the game (up to MAX_PLAYERS).
var PLAYERS_LOCATION = 'player_list';
 
// A location under GAME_LOCATION that you will use to store data 
// for each player (their game state, etc.)
var PLAYER_DATA_LOCATION = 'player_data';
 
 
// Called after player assignment completes.
function playGame(myPlayerNumber, userId, justJoinedGame, gameRef) {
  var playerDataRef = gameRef.child(PLAYER_DATA_LOCATION).child(myPlayerNumber);
  alert('You are player number ' + myPlayerNumber + 
      '.  Your data will be located at ' + playerDataRef.toString());
 
  if (justJoinedGame) {
    alert('Doing first-time initialization of data.');
    playerDataRef.push({userId: userId, state: 'game state'});
    gameRef.child('hex_data').update({
			hexes: hexes
		});
		gameRef.child('turn').update({
			turn: 0
		});
  }
};
 
// Use transaction() to assign a player number, then call playGame().
function assignPlayerNumberAndPlayGame(userId, gameRef) {
  var playerListRef = gameRef.child(PLAYERS_LOCATION);
  var myPlayerNumber, alreadyInGame = false;

  playerListRef.transaction(function(playerList) {
    // Attempt to (re)join the given game. Notes:
    //
    // 1. Upon very first call, playerList will likely appear null (even if the
    // list isn't empty), since Firebase runs the update function optimistically
    // before it receives any data.
    // 2. The list is assumed not to have any gaps (once a player joins, they 
    // don't leave).
    // 3. Our update function sets some external variables but doesn't act on
    // them until the completion callback, since the update function may be
    // called multiple times with different data.
    if (playerList === null) {
      playerList = [];
    }
 
    for (var i = 0; i < playerList.length; i++) {
      if (playerList[i] === userId) {
        // Already seated so abort transaction to not unnecessarily update playerList.
        alreadyInGame = true;
        myPlayerNumber = i; // Tell completion callback which seat we have.
        return;
      }
    }
 
    if (i < NUM_PLAYERS) {
      // Empty seat is available so grab it and attempt to commit modified playerList.
      playerList[i] = userId;  // Reserve our seat.
      myPlayerNumber = i; // Tell completion callback which seat we reserved.
      playerId = myPlayerNumber;
      username = userId;
      return playerList;
    }
 
    // Abort transaction and tell completion callback we failed to join.
    myPlayerNumber = null;
  }, function (error, committed) {
    // Transaction has completed.  Check if it succeeded or we were already in
    // the game and so it was aborted.
    if (committed || alreadyInGame) {
      playGame(myPlayerNumber, userId, !alreadyInGame, gameRef);
    } else {
      alert('Game is full.  Can\'t join. :-(');
    }
  });
};



