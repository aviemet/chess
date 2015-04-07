
function Piece(id, color){
	this.id = id;
	this.color = color;
	this.image = "images/" + color;
	this.name;

	this.infinite = true;
	this.moves = [];
	this.moves[0] = []; // represents movement on x axis
	this.moves[1] = []; // represents movement on y axis

	this.getValidMoves = function(){
		//alert($(pieces[this.id]).attr('class'));
		var tiles = [];/*
		for(var i = 0; i < this.moves[0].length; i++){
			tiles.push(this.checkDirection(x, y, i));
		}*/
		return tiles;
	}

	this.checkDirection = function(x, y, i){
		var tiles = [];
		var chkX = x+this.moves[0][i];
		var chkY = y+this.moves[0][i];
		while(this.checkTile(chkX, chkY)){
			this.push(this.checkDirection(chkX, chkY, i));
		}
		return tiles;

	}

	this.checkTile = function(x, y){
		
		return false;
	}

	this.testing = function(){
		alert('testing');
	}
}

/**
* Pawn
*/
function Pawn(id, color){
	Piece.call(this, id, color);

	this.name = "Pawn";
	this.image += 'p.png';

	this.infinite = false;
	this.moves[0] = [0];
	this.moves[1] = [1];
}
Pawn.prototype = Piece;
Pawn.prototype.constructor = Pawn;

/**
* Rook
*/
function Rook(id, color){
	Piece.call(this, id, color);

	this.name = "Rook";
	this.image += 'r.png';

	this.moves[0] = [-1, 0, 0, 1];
	this.moves[1] = [0, -1, 1, 0];
}
Rook.prototype = Piece;
Rook.prototype.constructor = Rook;

/**
* Knight
*/
function Knight(id, color){
	Piece.call(this, id, color);

	this.name = "Knight";
	this.image += 'n.png';

	this.infinite = false;
	this.moves[0] = [-1, -1, -2, -2, 1, 1, 2, 2];
	this.moves[1] = [-2, 2, -1, 1, 2, -2, -1, 1];
}
Knight.prototype = Piece;
Knight.prototype.constructor = Knight;

/**
* Bishop
*/
function Bishop(id, color){
	Piece.call(this, id, color);

	this.name = "Bishop";
	this.image += 'b.png';

	this.moves[0] = [-1, -1, 1, 1];
	this.moves[1] = [-1, 1, -1, 1];
}
Bishop.prototype = Piece;
Bishop.prototype.constructor = Bishop;

/**
* Queen
*/
function Queen(id, color){
	Piece.call(this, id, color);

	this.name = "Queen";
	this.image += 'q.png';

	this.moves[0] = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
	this.moves[1] = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
}
Queen.prototype = Piece;
Queen.prototype.constructor = Queen;

/**
* King
*/
function King(id, color){
	Piece.call(this, id, color);

	this.name = "King";
	this.image += 'k.png';

	this.infinite = false;
	this.moves[0] = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
	this.moves[1] = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
}
King.prototype = Piece;
King.prototype.constructor = King;