var players = [];
var colors = ['b', 'w'];
var pieces = []; 
var tiles = [];
var currTurnColor = "w";
var history = [];
var historyOffset = 0; // Should never be less than 0. 0 means latest play, positive value for previous plays
var activeTiles;
var showHints = false;

// Set to true for debugging
var test_mode = false;

/**
* drawBoard(DOMObject div)
*
* Turns a <div> element into a chess board
**/
function drawBoard(div){
	var output = "";
	var row = 0;
	output += "<table id='chess_board'>";
	for(var y = 0; y < 8; y++){
		output += "\t<tr>";
		for(var x = 0; x < 8; x++){
			var color = "";
			var tile = getTileId(x, y);
			if((tile + (row % 2)) % 2 === 1){ color = " class='black'"; }
			output += "\t\t<td id=" + tile + color + "></td>";
		}
		output += "\t</tr>";
		row++;
	}
	output += "</table>";
	
	$(div).html(output);
	
	// Keep a list of all tiles on the board
	tiles = $('table#chess_board').find('td');
	
	// Give all tiles their droppable functionality
	$('#chess_board td').droppable({
		disabled: true,
		greedy: true,
		accept: ".piece",
		hoverClass: "active",
		drop: function(event, ui){
			movePiece(ui.draggable, this);
		},
	});
	
	// Add the pieces to the board
	initPieces();
}

/**
* initPieces()
*
* Adds chess pieces in their proper places to the board
**/
function initPieces(){
	var id;
	var doDraw = false;
	for(var c = 0; c < colors.length; c++){ // Go through colors
		for(var i = 0; i < 8; i++){  // Go through row (y)
			for(var j = 0; j < 8; j++){ // Go through col (x)
				
				// Add the piece if it's not a pawn
				var pieceName, imgName;
				var newPiece = $('<img class="piece" />');
				if( (c == 0 && i == 0) || (c == 1 && i == 7) ){
					switch(j){
						case 0: case 7: 	//Rook
							pieceName = 'rook';
							imgName = 'images/' + colors[c] + 'r.png';
							break;
						case 1: case 6: 	//Knight
							pieceName = 'knight';
							imgName = 'images/' + colors[c] + 'n.png';
							break;
						case 2: case 5: 	//Bishop
							pieceName = 'bishop';
							imgName = 'images/' + colors[c] + 'b.png';
							break;
						case 3: 			//King
							pieceName = 'king';
							imgName = 'images/' + colors[c] + 'k.png';
							break;
						case 4: 			//Queen
							pieceName = 'queen';
							imgName = 'images/' + colors[c] + 'q.png';
							break;
					}
					doDraw = true;
					
					// Add the piece if it's a pawn
				} else if( (c == 0 && i == 1) || (c == 1 && i == 6) ){
					pieceName = 'pawn';
					imgName = 'images/' + colors[c] + 'p.png';
					newPiece.addClass('first');
					doDraw = true;
				}
				
				// Draw piece on the board
				if(doDraw === true){ 
					pieces.push(newPiece);
					newPiece.attr('src', imgName).attr('name', pieceName).attr('color', colors[c]).addClass(colors[c]);
					if(pieceName == 'king'){ newPiece.attr('id', colors[c] + '_king'); } // Add ID handle for kings
					$(tiles[getTileId(j, i)]).html(newPiece);
					doDraw = false;
				}
			}
			
		}
	}
}

/**
* void startGame()
*
* Initializes piece draggable behavior and starts first turn
**/
function startGame(){
	$("img.piece").draggable({
		containment: $("#chess_board"),
		revert: "invalid",
		disabled: true,
		start: function(event, ui){
			activateValidMoves(this);
		},
		stop: function(event, ui){
			deactivateTiles();
		}
	});
	
	startTurn();
}

/**
* void resetGame()
*
* Starts the game over
**/
function resetGame(){
	$("img.piece").remove();
	initPieces();
	startGame();
}

/**
* int getTileId(int x, int y)
*
* return the id of a tile from its x,y coordinates
**/
function getTileId(x, y){
	return y * 8 + x;
}

/**
* int getX(int tileId)
*
* return the x coordinate of a tile from its id
**/
function getX(tileId){
	return tileId % 8;
}

/**
* int getY(int tileId)
*
* return the y coordinate of a tile from its id
**/
function getY(tileId){
	return (tileId - (tileId % 8)) / 8;
}	


function getPiecePosition(piece){
	return $(piece).parent().attr('id');
}

/**
* void activateValidMoves(Piece piece)
*
* Convert tiles for valid moves of given piece into droppable elements
**/
function activateValidMoves(piece){
	activeTiles = getValidMoves(piece);

	// Enable tiles for valid moves
	for(tile in activeTiles){
		$('td#'+activeTiles[tile]).droppable("enable");

		// Highlight valid moves if 'Show Hints' is enabled
		if(showHints){
			$('td#'+activeTiles[tile]).addClass("enabled");
		}
	}
}

/**
* int[] getValidMoves(Piece piece)
* 
* return int Array validMoves[];
**/
function getValidMoves(piece, test){
	test = typeof test !== 'undefined' ? test : true;
	var moves = Pieces[$(piece).attr('name')].getMoves(piece);
	//var tile = getPiecePosition(piece);
	var tile = ($(piece).attr("rel") !== false && typeof $(piece).attr("rel") !== "undefined") ? $(piece).attr("rel") : getPiecePosition(piece);
	
	var validMoves = [];
	
	for(i in moves[0]){
		var slider = Pieces[$(piece).attr('name')].slide; // Test if piece is a slider
		var x = getX(tile);
		var y = getY(tile);
		
		do{
			// Reverse lookahead direction for white pieces
			var direction = ($(piece).attr('color') == 'w') ? -1 : 1;
			x += moves[0][i];
			y += moves[1][i] * direction;
			
			// Record if move is valid
			var valid = validateMove(x, y, piece);
			if(valid > 0){
				validMoves.push(getTileId(x, y));
			} 

			// If move is invalid or an attack, end loop
			if(valid == 0 || valid == 2){ slider = false; }
		} while(slider);
	}
	
	/*
	validMoves = testForCheck(validMoves, piece); 
	if(!test){ 
		console.log($(piece).class());
		validMoves = testForCheck(validMoves, piece); 
	}*/

	return validMoves;
}

/**
* validateMove(int x, int y, Piece piece)
*
* Determine whether the given tile is a valid move for the given piece
*
* return 0 for invalid
* return 1 for valid empty
* return 2 for valid take piece
*/
function validateMove(x, y, piece){
	ret_code = 0; // Default: return invalid move; change if valid
	if(x < 8 && x >= 0 && y < 8 && y >= 0){ // Ensure it's on the board
		var color = $(piece).attr('color'); // Store piece color
		var tile = $('td#'+getTileId(x, y)); // Store tile ID of square being checked
		
		// Check if it's an empty tile
		if($(tile).children().size() == 0){
			ret_code = 1
		// If not empty, is it occupied by an opponent
		} else if($(tile).children('img').attr('color') != color){ 
			ret_code = 2;
		}
		
		/*
		if(ret_code !== 0 && testForCheck(x, y, piece)){
			ret_code = 0;
		}
		*/
	}
	return ret_code;
}

//function testForCheck(x, y, piece, ret_code){
function testForCheck(validMoves, piece){
	var newMoves = [];
	var kingID = $("#"+currTurnColor+"_king").parent().attr('id');
	var kingX = getX(kingID);
	var kingY = getY(kingID);
	debug(kingX + " " + kingY);
	
	// Set temp tile location to simulate move
	for(move in validMoves){
		$(piece).attr("rel", validMoves[move]);
		// Iterate over all opponent's pieces
		for(opponent in pieces){
			if($(pieces[opponent]).attr("color") != currTurnColor){
				// Get their valid moves
				var testMoves = getValidMoves(pieces[opponent], true);
				for(testMove in testMoves){
					if(testMoves[testMove] != kingID){
						newMoves.push(move);
					}
				}
			}
		}	
	}
	$(piece).removeAttr("rel");

	return newMoves;

/*
	var newMoves = [];
	var kingID = $("#"+currTurnColor+"_king").parent().attr('id');
	var kingX = getX(kingID);
	var kingY = getY(kingID);
	debug(kingX + " " + kingY);
	for(move in moves){
		$(piece).attr("test", move);
		for(opponents in pieces){
			if($(pieces[opponents]).attr("color") != currTurnColor){
				var testMoves = getValidMoves(pieces[opponents], true);
				for(testMove in testMoves){
					if(testMoves[testMove] != kingID){
						newMoves.push(move);
					}
				}
			}
		}
	}
	$(piece).removeAttr("test");
	return moves;
	*/
	
	return false;
}

/**
* movePiece(Piece piece, DOMObject tile)
*
* Moves given piece to given tile
**/
function movePiece(piece, tile){
	if($(tile).children().size() > 0){
		logMove(piece, tile, $(tile).children('img'));
		takePiece($(tile).children('img'));
	} else {
		logMove(piece, tile);
	}
	$(piece).removeAttr('style').css("position", "relative").removeClass('first');
	$(piece).appendTo($(tile));

	endTurn();
}

/**
*  
**/
function takePiece(piece){
	if($(piece).attr('color') == 'b'){
		$('#black_taken').append(piece);
	} else {
		$('#white_taken').append(piece);
	}
	$(piece).draggable('disable');
	
	if($(piece).attr("name") == "king"){
		winTheGame();
	}
}

function logMove(piece, tile, pieceTaken){
	var move = [];
	move[0] = piece;
	move[1] = getPiecePosition(piece);	// From tile
	move[2] = tile;						// To tile
	move[3] = piece.hasClass('first');
	if(typeof pieceTaken !== 'undefined'){
		move[4] = pieceTaken;
	} else {
		move[4] = typeof undefined;
	}
	history.push(move);
	//console.log(history);
	historyOffset = 0;
}

function undo(){
	if(historyOffset < (history.length)){
		var i = history.length-1 - historyOffset;
		var piece = history[i][0];
		$(piece).appendTo($("td#"+history[i][1]));
		if(history[i][3]){
			piece.addClass('first');
		}
		if(history[i][4] !== 'undefined'){
			$(history[i][4]).appendTo(history[i][2]).draggable('enable');
		}
		historyOffset++;
		endTurn();
	}
}

function redo(){
	if(historyOffset < (history.length)){
		var i = history.length-1 - historyOffset;
		var piece = history[i][0];
		$(piece).appendTo($("td#"+history[i][1]));
		if(history[i][3]){
			piece.addClass('first');
		}
		if(history[i][4] !== 'undefined'){
			$(piece).appendTo($("td#"+history[i][2]));
		}
		historyOffset--;
		endTurn();
	}
}

function deactivateTiles(){
	for(tile in activeTiles){
		$('td#'+activeTiles[tile]).droppable("disable").removeClass("enabled");
	}
	activeTiles = [];
}

function winTheGame(){
	alert('You Won!');
	$("img.piece").draggable('disable');
}

function startTurn(){
	$("img.piece." + currTurnColor).draggable('enable');
}

function checkCheck(){
	var kingID = $("#"+currTurnColor+"_king").parent().attr('id');
	var kingX = getX(kingID);
	var kingY = getY(kingID);
	debug(kingX + " " + kingY);
	for(piece in pieces){
		if($(pieces[piece]).attr("color") != currTurnColor){
			var moves = getValidMoves(pieces[piece]);
			for(move in moves){
				if(moves[move] == kingID){
					return true;
				}
			}
			
		}
	}
	return false;
}

function endTurn(){
	$("img.piece").draggable('disable');
	
	if(currTurnColor == "b"){ currTurnColor = "w"; }
	else if(currTurnColor == "w"){ currTurnColor = "b"; }
	
	startTurn();
}

/**
* Pieces Object
*/
var Pieces = {
	pawn: {
		moves: {
			0: [0],
			1: [1],
		},
		getMoves: function(piece){
			var retMoves = [];						// Copy moves array
			retMoves[0] = this.moves[0].slice();
			retMoves[1] = this.moves[1].slice();
			
			if($(piece).hasClass('first') > 0){		// Add extra moves if first move
				retMoves[0].push(0);
				retMoves[1].push(2);
			}
			
			var x = getX(getPiecePosition(piece));
			var y = getY(getPiecePosition(piece));
			
			// Remove false take piece on straight move
			for(i in retMoves){
				var tile = getTileId(x+retMoves[0][i], y+retMoves[1][i]);
				if($('td#'+tile).children().size() > 0){
					
				}
			}
			
			// Add moves to take diagonally
			var direction = ($(piece).attr('color') == 'w') ? -1 : 1;
			var check1 = getTileId(x-1, y+1*direction);
			var check2 = getTileId(x+1, y+1*direction);
			
			if($('td#'+check1).children().size() > 0 && $('td#'+check1).children('img').attr('color') != $(piece).attr('color')){
				retMoves[0].push(-1);
				retMoves[1].push(1);
				debug('check1 ' + check1);
			}
			
			if($('td#'+check2).children().size() > 0 && $('td#'+check2).children('img').attr('color') != $(piece).attr('color')){
				retMoves[0].push(1);
				retMoves[1].push(1);
				debug('check2 ' + check2);
			}
			
			return retMoves;
		},
		slide: false,
	},
	
	rook: {
		getMoves: function(piece){
			return this.moves;
		},
		moves: {
			0: [-1, 0, 0, 1],
			1: [0, -1, 1, 0],
		},
		slide: true,
	},
	
	knight: {
		getMoves: function(piece){
			return this.moves;
		},
		moves: {
			0: [-1, -1, -2, -2, 1, 1, 2, 2],
			1: [-2, 2, -1, 1, 2, -2, -1, 1],
		},
		slide: false,
	},
	
	bishop: {
		getMoves: function(piece){
			return this.moves;
		},
		moves: {
			0: [-1, -1, 1, 1],
			1: [-1, 1, -1, 1],
		},
		slide: true,
	},
	
	queen: {
		getMoves: function(piece){
			return this.moves;
		},
		moves: {
			0: [-1, -1, -1, 0, 0, 0, 1, 1, 1],
			1: [-1, 0, 1, -1, 0, 1, -1, 0, 1],
		},
		slide: true,
	},
	
	king: {
		getMoves: function(piece){
			return this.moves;
		},
		moves: {
			0: [-1, -1, -1, 0, 0, 0, 1, 1, 1],
			1: [-1, 0, 1, -1, 0, 1, -1, 0, 1],
		},
		slide: false,
	},
};

var Player1 = {
	name: "",
	color: "",
}

var Player2 = {
	name: "",
	color: "",
}











function debug(msg){
	if(test_mode === true){
		alert(msg);	
	}
}