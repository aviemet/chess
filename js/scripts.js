$(document).ready(function(){
	
	drawBoard('#board');
	
	Player1.name = "Avi";
	Player1.color = "w";
	
	Player2.name = "Computer";
	Player2.color = "b";

	startGame();

	$("#undo").click(function(){
		undo();
	});
	$("#redo").click(function(){
		redo();
	});

	$("#showHints").change(function(){
		if(this.checked){
			showHints = true;
		} else {
			showHints = false;
		}
	});
 
});