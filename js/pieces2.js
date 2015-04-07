var Pieces = {
	pawn: {
		moves: {
			0: [0],
			1: [1],
		},
		getMoves: function(piece){
			var retMoves = [];
			retMoves[0] = this.moves[0].slice();
			retMoves[1] = this.moves[1].slice();
			if($(piece).hasClass('first') > 0){
				retMoves[0].push(0);
				retMoves[1].push(2);
			}
			var x = getX($(piece).parent().attr('id'));
			var y = getY($(piece).parent().attr('id'));
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