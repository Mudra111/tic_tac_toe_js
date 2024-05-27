const statusDisplay = document.querySelector(".game--status");

//Initial game state
let gameActive = true; // whenever this contains true, player can play game
let playerIcon = "X"; // current player icon
let compIcon = "O"; // computer icon by default
let callComp = false; // if this contains true , computer can play the game
let lastStep = 0; // used for undo operation

let playerOnline = false;

var symbol;

let isEventRemove = "";

let avlblDiv = document.querySelector(".avlblGameD");

let onlinePlayer = false;

avlblDiv.classList.add("hide");

const cell3 = document.querySelectorAll(".cell3");
const cell4 = document.querySelectorAll(".cell4");

const gameSt = document.querySelector(".game--restart");
const mainbrd = document.querySelector(".GameStatusChangebtn");

var list = document.querySelector(".list");

let winningConditions = [
	["0", "1", "2", "3"],
	["4", "5", "6", "7"],
	["8", "9", "10", "11"],
	["12", "13", "14", "15"],
	["0", "5", "10", "15"],
	["3", "6", "9", "12"],
	["0", "4", "8", "12"],
	["1", "5", "9", "13"],
	["2", "6", "10", "14"],
	["3", "7", "11", "15"],
]; // winning condition for 4-4 play board

let clientId;
let gameId;

let lastMove = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // updates according to the last move of player

let gameState = [
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
]; // initial state for all cells

let watchedObject = {
	//update objects or call function on change in below specified variable variable
	playboard: " ",
};

// Following 3 lines allows us hide main game while user selecting options
document.querySelector(".select-icon").classList.add("hide");
// document.querySelector(".main-board").classList.add("hide");
document.querySelector(".select-grid").classList.add("hide");
document.querySelector(".game--container_4").classList.add("hide");
document.querySelector(".game--container_3").classList.add("hide");
document.querySelector(".GameStatusChangebtn").classList.add("hide");

document
	.querySelector(".comp-player")
	.addEventListener("click", handlePlayMode);

document
	.querySelector(".online-player")
	.addEventListener("click", handlePlayMode);

document
	.querySelector(".friend-player")
	.addEventListener("click", handlePlayMode);

// following two lines are for handle user input for playboard grid (3-3 or 4-4)
document.querySelector(".Mode3-3").addEventListener("click", handlePlayBoard);
document.querySelector(".Mode4-4").addEventListener("click", handlePlayBoard);

//acording to above two lines following function decide which grid has to be display
function handlePlayBoard(playBrd) {
	if (onlinePlayer) {
		document.querySelector(".select-mode").classList.add("hide");
		document.querySelector(".select-grid").classList.add("hide");
		document.querySelector(".main-board").classList.remove("hide");
		document.querySelector(".GameStatusChangebtn").classList.remove("hide");
		let pyBrd = playBrd.target;

		if (pyBrd.getAttribute("class") == "Mode3-3") {
			watchedProxy.playboard = "3-3";
		} else {
			watchedProxy.playboard = "4-4";
		}
	} else {
		document.querySelector(".select-icon").classList.remove("hide");
		document.querySelector(".select-mode").classList.add("hide");
		document.querySelector(".select-grid").classList.add("hide");
		let pyBrd = playBrd.target;

		if (pyBrd.getAttribute("class") == "Mode3-3") {
			watchedProxy.playboard = "3-3";
		} else {
			watchedProxy.playboard = "4-4";
		}
	}
}

//whenever watchedObject means playboard variable's value will change , following function will execute
let watchedProxy = new Proxy(watchedObject, {
	set: function (target, key, value) {
		target[key] = value;
		if (key === "playboard") {
			onplaybordChange(value); // Call the function when the variable changes
		}
		return true;
	},
});

//following changes made according to playboard grid selected by user or whenever playboard variable will changed
function onplaybordChange() {
	winningConditions =
		watchedProxy.playboard == "4-4"
			? [
					["0", "1", "2", "3"],
					["4", "5", "6", "7"],
					["8", "9", "10", "11"],
					["12", "13", "14", "15"],
					["0", "5", "10", "15"],
					["3", "6", "9", "12"],
					["0", "4", "8", "12"],
					["1", "5", "9", "13"],
					["2", "6", "10", "14"],
					["3", "7", "11", "15"],
			  ]
			: [
					["0", "1", "2"],
					["3", "4", "5"],
					["6", "7", "8"],
					["0", "4", "8"],
					["2", "4", "6"],
					["0", "3", "6"],
					["1", "4", "7"],
					["2", "5", "8"],
			  ];

	gameState =
		watchedProxy.playboard == "4-4"
			? ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
			: ["", "", "", "", "", "", "", "", ""]; // initial state for all cells

	lastMove =
		watchedProxy.playboard == "4-4"
			? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			: [0, 0, 0, 0, 0, 0, 0, 0, 0];

	console.log(gameState);
	console.log(winningConditions);
}

//following two lines are for handle icon selection done by user
document.querySelector(".iconX").addEventListener("click", handlePlayerIcon);
document.querySelector(".iconO").addEventListener("click", handlePlayerIcon);

//function called for handle icon selection by above two lines
function handlePlayerIcon(event) {
	document.querySelector(".select-icon").classList.add("hide");
	document.querySelector(".main-board").classList.remove("hide");
	document.querySelector(".GameStatusChangebtn").classList.remove("hide");

	if (watchedProxy.playboard == "3-3" && playerOnline == false) {
		document.querySelector(".game--container_4").classList.add("hide");
		document.querySelector(".game--container_3").classList.remove("hide");
	} else {
		if (playerOnline == false) {
			document.querySelector(".game--container_3").classList.add("hide");
			document.querySelector(".game--container_4").classList.remove("hide");
		}
	}

	let elem = event.target; // access clicked/targeted element
	let class1 = elem.getAttribute("class");

	if (class1 == "iconX") {
		// set player icon according to user input
		playerIcon = "X";
		console.log(playerIcon);
	} else {
		playerIcon = "O";
		console.log(playerIcon);
	}

	statusDisplay.innerHTML = `It's ${playerIcon}'s turn`;
}

//Handle selected play mode by the user
function handlePlayMode(clickedbtn) {
	document.querySelector(".select-icon").classList.add("hide");
	document.querySelector(".select-mode").classList.add("hide");
	document.querySelector(".select-grid").classList.remove("hide");

	let mode = clickedbtn.target; // access clicked/targeted element

	if (mode.innerHTML == "Play with friend(Online)") {
		console.log("its working");
		playerOnline = true;
		avlblDiv.classList.remove("hide");
		statusDisplay.innerHTML = "";
		onlinePlayer = true;
		onlineMultiplayer();
	} else if (mode.innerHTML == "Play with computer") {
		console.log("hello i am here");
		compPlayer();
		avlblDiv.classList.add("hide");
	} else {
		playerFrnd();
		avlblDiv.classList.add("hide");
	}
}

const createbtn = document.querySelector(".create");
const joinbtn = document.querySelector(".join");
const goHomeBtn = document.querySelector(".go-home");
const restartBtn = document.querySelector(".game--restart");
const List = document.getElementsByTagName("li");
createbtn.disabled = true;
joinbtn.disabled = true;

//Above function will handover to any function from below defined 3 according to user input.

function onlineMultiplayer() {
	var socket = new WebSocket("ws://localhost:8080");

	restartBtn.disabled = true;

	let gameState = true;

	document.querySelector(".undo").classList.add("hide");

	let board;
	if (watchedProxy.playboard == "4-4") {
		board = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
	} else {
		board = ["", "", "", "", "", "", "", "", ""];
	}

	//API Method(defualt)
	socket.onmessage;
	console.log("connected with server");
	socket.onmessage = onMessage;

	function onMessage(msg) {
		const data = JSON.parse(msg.data);

		//Distinguishes between types of responses from the server and react according to it
		switch (data.tag) {
			case "connected":
				console.log(data.clientId);
				const lbl = document.createElement("h1");
				lbl.style.textAlign = "center";
				lbl.classList.add("PlayerId");
				lbl.innerText = `Player Id :${data.clientId}`;
				clientId = data.clientId;
				mainbrd.insertBefore(lbl, gameSt);
				createbtn.disabled = false;
				joinbtn.disabled = false;
				break;

			case "gamesList":
				const games = data.list;
				while (list.firstChild) {
					list.removeChild(list.lastChild);
				}
				games.forEach((game) => {
					const li = document.createElement("li");
					li.innerText = game;
					li.style.textAlign = "center";
					list.appendChild(li);
					li.addEventListener("click", () => {
						gameId = game;
						statusDisplay.innerHTML = `You selected room no. ${game} <br\> "Click on Join Button to Start The Game in room no. ${game}"`;
						setTimeout(() => {
							statusDisplay.innerHTML = "";
						}, 7000);
					});
				});
				break;

			case "created":
				gameId = data.gameId;
				createbtn.disabled = true;
				joinbtn.disabled = true;
				console.log(gameId);
				break;

			case "joined":
				statusDisplay.innerHTML = ``; // display status line

				restartBtn.disabled = false;

				if (watchedProxy.playboard == "4-4") {
					document.querySelector(".game--container_4").classList.remove("hide");
				} else {
					document.querySelector(".game--container_3").classList.remove("hide");
				}
				symbol = data.symbol;

				if (symbol == "X") {
					if (watchedProxy.playboard == "4-4") {
						document
							.querySelectorAll(".cell4")
							.forEach((cell) => cell.classList.add("cross"));
					} else {
						document
							.querySelectorAll(".cell3")
							.forEach((cell) => cell.classList.add("cross"));
					}
				} else {
					if (watchedProxy.playboard == "4-4") {
						document
							.querySelectorAll(".cell4")
							.forEach((cell) => cell.classList.add("circle"));
					} else {
						document
							.querySelectorAll(".cell3")
							.forEach((cell) => cell.classList.add("circle"));
					}
				}
				break;

			case "updateBoard":
				if (watchedProxy.playboard == "4-4") {
					document.querySelectorAll(".cell4").forEach((cell) => {
						cell.innerHTML = "";
					});
				} else {
					document.querySelectorAll(".cell3").forEach((cell) => {
						cell.innerHTML = "";
					});
				}
				if (watchedProxy.playboard == "4-4") {
					for (let i = 0; i < 16; i++) {
						console.log(data.board[i]);
						if (data.board[i] == "X") {
							document.querySelectorAll(".cell4").forEach((cell) => {
								if (parseInt(cell.getAttribute("data-cell-index4")) == i) {
									cell.innerHTML = "X";
									// statusDisplay.innerHTML = ` It's O's turn`; // display status line
									console.log("X placed");
								}
							});
						} else {
							if (data.board[i] == "O") {
								document.querySelectorAll(".cell4").forEach((cell) => {
									if (parseInt(cell.getAttribute("data-cell-index4")) == i) {
										cell.innerHTML = "O";
										// statusDisplay.innerHTML = ` It's X's turn`; // display status line
										console.log("O placed");
									}
								});
							}
						}
					}
				} else {
					for (let i = 0; i < 9; i++) {
						console.log(data.board[i]);
						if (data.board[i] == "X") {
							document.querySelectorAll(".cell3").forEach((cell) => {
								if (parseInt(cell.getAttribute("data-cell-index")) == i) {
									cell.innerHTML = "X";
									// statusDisplay.innerHTML = ` It's O's turn`; // display status line
									console.log("X placed");
								}
							});
						} else {
							if (data.board[i] == "O") {
								document.querySelectorAll(".cell3").forEach((cell) => {
									if (parseInt(cell.getAttribute("data-cell-index")) == i) {
										cell.innerHTML = "O";
										// statusDisplay.innerHTML = ` It's X's turn`; // display status line
										console.log("O placed");
									}
								});
							}
						}
					}
				}
				console.log(data.isTurn);
				if (data.isTurn) {
					makeMove();
					console.log("call make move");
				}
				break;

			case "winner":
				statusDisplay.innerHTML = `Player ${data.winner} has won!`;
				document.querySelector(".body").classList.add("background");
				setTimeout(() => {
					document.querySelector(".body").classList.remove("background");
				}, 8000); //set time to display winning condition animation
				// alert(`The Winner is ${data.winner}`);
				gameState = data.gameState;
				break;
			case "gameDraw":
				statusDisplay.innerHTML = "The Game is a Draw!";
				break;
			case "gameTerminated":
				window.location.reload();
				break;
			case "gamerestarted":
				gameState = true;
				if (watchedProxy.playboard == "4-4") {
					document.querySelectorAll(".cell4").forEach((cell) => {
						cell.innerHTML = "";
					});
				} else {
					document.querySelectorAll(".cell3").forEach((cell) => {
						cell.innerHTML = "";
					});
				}
				statusDisplay.innerHTML = "The Game was Restarted!!";
				setTimeout(() => {
					statusDisplay.innerHTML = "";
				}, 7000);
		}
	}

	function makeMove() {
		// statusDisplay.innerHTML = ` It's ${symbol}'s turn`; // display status line
		if (watchedProxy.playboard == "4-4") {
			console.log(cell4);
			cell4.forEach((cell) => {
				if (cell.innerHTML != "X" && cell.innerHTML != "O" && gameState) {
					cell.addEventListener("click", cellClickedEvent);
					console.log(cell.innerHTML);
				}
			});
		} else {
			console.log(cell3);
			cell3.forEach((cell) => {
				if (cell.innerHTML != "X" && cell.innerHTML != "O" && gameState) {
					cell.addEventListener("click", cellClickedEvent);
					console.log(cell.innerHTML);
				}
			});
		}
	}

	function cellClickedEvent(ev) {
		let icon, nextIcon;
		let elem = ev.target;
		if (symbol == "X") {
			icon = "X";
			nextIcon = "O";
		} else {
			icon = "O";
			nextIcon = "X";
		}
		elem.innerHTML = `${icon}`;
		// statusDisplay.innerHTML = ` It's ${nextIcon}'s turn`; // display status line

		if (watchedProxy.playboard == "4-4") {
			for (let i = 0; i < 16; i++) {
				cell4.forEach((cell) => {
					if (parseInt(cell.getAttribute("data-cell-index4")) == i) {
						if (cell.innerHTML == "O") {
							board[i] = "O";
						} else {
							if (cell.innerHTML == "X") {
								board[i] = "X";
							} else {
								board[i] = "";
							}
						}
					}
				});
			}
		} else {
			for (let i = 0; i < 9; i++) {
				cell3.forEach((cell) => {
					if (parseInt(cell.getAttribute("data-cell-index")) == i) {
						if (cell.innerHTML == "O") {
							board[i] = "O";
						} else {
							if (cell.innerHTML == "X") {
								board[i] = "X";
							} else {
								board[i] = "";
							}
						}
					}
				});
			}
		}

		isEventRemove = "true";

		cell3.forEach((cell) => {
			cell.removeEventListener("click", cellClickedEvent);
		});
		cell4.forEach((cell) => {
			cell.removeEventListener("click", cellClickedEvent);
		});
		console.log("event removed");

		socket.send(
			JSON.stringify({
				tag: "moveMade",
				board: board,
				clientId: clientId,
				gameId: gameId,
			})
		);
	}

	createbtn.addEventListener("click", () => {
		socket.send(
			JSON.stringify({
				tag: "create",
				clientId: clientId,
				playBoard: watchedProxy.playboard,
			})
		);
	});

	goHomeBtn.addEventListener("click", () => {
		socket.send(
			JSON.stringify({
				tag: "goHome",
				gameId: gameId,
			})
		);
	});

	joinbtn.addEventListener("click", () => {
		socket.send(
			JSON.stringify({
				tag: "join",
				clientId: clientId,
				gameId: gameId,
			})
		);
	});

	restartBtn.addEventListener("click", () => {
		socket.send(
			JSON.stringify({
				tag: "restart",
				gameId: gameId,
			})
		);
	});
}

//following function was called to handle computer-player mode
function compPlayer() {
	//following function is for handle clicked cell whenever player click any cell
	function handleCellClickcomp(clickCellEvent) {
		const clickedCell = clickCellEvent.target; //access targeted element

		const clickedCellIndex =
			watchedProxy.playboard == "4-4"
				? parseInt(clickedCell.getAttribute("data-cell-index4"))
				: parseInt(clickedCell.getAttribute("data-cell-index")); // access index of clicked cell

		if (gameState[clickedCellIndex] !== "" || !gameActive) {
			return;
		}

		handleCellPlayed(clickedCell, clickedCellIndex); // function for handle clicked cell
		handleResultVal(playerIcon); // function to check winning condition

		let randomTimeDelay = (Math.random() * 1000 + 200).toFixed();

		// call comp() function for computer's turn
		if (callComp == true) {
			setTimeout(() => {
				comp();
			}, randomTimeDelay);
		}

		// set time for display winning condition background/animation
		setTimeout(() => {
			document.querySelector(".body").classList.remove("background");
		}, 8000);
	}

	// function to handle computer's turn
	function comp() {
		if (playerIcon == "X") {
			compIcon = "O";
		} else {
			compIcon = "X";
		} // set computer's icon

		statusDisplay.innerHTML = ` It's ${compIcon}'s turn`; // display status line

		let array = [];

		if (watchedProxy.playboard == "3-3") {
			document.querySelectorAll(".cell3").forEach((cell) => {
				if (cell.innerHTML == "") {
					array.push(parseInt(cell.getAttribute("data-cell-index")));
				}
			});
		} else {
			document.querySelectorAll(".cell4").forEach((cell) => {
				if (cell.innerHTML == "") {
					array.push(parseInt(cell.getAttribute("data-cell-index4")));
				}
			});
		} // make array of empty cells

		let randomBox = array[Math.floor(Math.random() * array.length)]; // choose random number from the empty cells

		//following lines are for put computer's icon in selected random empty cell
		array[randomBox] = compIcon;
		gameState[randomBox] = compIcon;
		lastStep = lastStep + 1;
		lastMove[lastStep] = randomBox;

		if (watchedProxy.playboard == "4-4") {
			document.querySelectorAll(".cell4").forEach((cell) => {
				if (parseInt(cell.getAttribute("data-cell-index4")) == `${randomBox}`) {
					cell.innerHTML = `${compIcon}`;
				} // put computer's icon in selected cell
				handleResultVal(compIcon);
			});
		} else {
			document.querySelectorAll(".cell3").forEach((cell) => {
				if (parseInt(cell.getAttribute("data-cell-index")) == `${randomBox}`) {
					cell.innerHTML = `${compIcon}`;
				} // put computer's icon in selected cell
				handleResultVal(compIcon);
			});
		} // call function handleResultVal() to check winning condition

		if (gameActive == true) {
			setTimeout(() => {
				statusDisplay.innerHTML = ` It's ${playerIcon}'s turn`;
			}, 600);
		} //display status line that now player's turn after some time delay
	}

	//function to check winning condition
	function handleResultVal(playrIcn) {
		let roundWon = false;
		let winner = "";

		//check winning condition for 4-4 playboard
		if (watchedProxy.playboard == "4-4") {
			for (let i = 0; i <= 9; i++) {
				const winCondition = winningConditions[i];
				let a = gameState[winCondition[0]];
				let b = gameState[winCondition[1]];
				let c = gameState[winCondition[2]];
				let d = gameState[winCondition[3]];

				if (a === "" || b === "" || c === "" || d === "") {
					continue;
				}

				if (a === b && b === c && c === d) {
					roundWon = true;
					winner = a;
					console.log(winner);
					break;
				}
			}
		} else {
			//check winning condition for 3-3 playboard
			for (let i = 0; i <= 7; i++) {
				const winCondition = winningConditions[i];
				let a = gameState[winCondition[0]];
				let b = gameState[winCondition[1]];
				let c = gameState[winCondition[2]];

				if (a === "" || b === "" || c === "") {
					continue;
				}

				if (a == b && b == c) {
					roundWon = true;
					winner = a;
					break;
				}
			}
		}

		if (roundWon) {
			//following lines are for display winner & terminate the game
			statusDisplay.innerHTML = `Player ${playrIcn} has won!`;
			gameActive = false;
			callComp = false;
			document.querySelector(".body").classList.add("background");
			return;
		} else {
			let roundDraw = !gameState.includes("");

			//following lines are for display game end in a draw
			if (roundDraw) {
				statusDisplay.innerHTML = `Game ended in a draw!`;
				gameActive = false;
				callComp = false;
				return;
			} else {
				callComp = true;
			}
		}
	}

	//function to handle clicked cell
	function handleCellPlayed(clickedCell, clickedCellIndex) {
		gameState[clickedCellIndex] = playerIcon;
		lastStep = lastStep + 1;
		lastMove[lastStep] = clickedCellIndex;

		//put player's icon
		if (playerIcon == "X") {
			clickedCell.innerHTML = "X";
		} else {
			clickedCell.innerHTML = "O";
		}
	}

	//following lines are for call function to handle clicked cell whenever player click any cell
	document
		.querySelectorAll(".cell3")
		.forEach((cell) => cell.addEventListener("click", handleCellClickcomp));

	document
		.querySelectorAll(".cell4")
		.forEach((cell) => cell.addEventListener("click", handleCellClickcomp));

	//following three queries are for handle or call appropriate function on click event on buttons (restart, go back to home, undo)
	document
		.querySelector(".game--restart")
		.addEventListener("click", handleRestartGame);

	document.querySelector(".go-home").addEventListener("click", handleGoHome);

	document.querySelector(".undo").addEventListener("click", handleUnDo);
}

//function for player-friend mode offline
function playerFrnd() {
	//following function is for handle clicked cell whenever player click any cell
	function handleCellClick(clickedCellEvent) {
		const clickedCell = clickedCellEvent.target;

		const clickedCellIndex =
			watchedProxy.playboard == "4-4"
				? parseInt(clickedCell.getAttribute("data-cell-index4"))
				: parseInt(clickedCell.getAttribute("data-cell-index")); // access index of clicked cell

		if (gameState[clickedCellIndex] !== "" || !gameActive) {
			return;
		}

		handleCellPlayed(clickedCell, clickedCellIndex); //function to handle clicked cell or put player icon in clicked cell
		handleResultValidation(); // function to check winning condition

		setTimeout(() => {
			document.querySelector(".body").classList.remove("background");
		}, 8000); //set time to display winning condition animation
	}

	//function to put icon in clicked cell
	function handleCellPlayed(clickedCell, clickedCellIndex) {
		gameState[clickedCellIndex] = playerIcon;
		lastStep = lastStep + 1;
		lastMove[lastStep] = clickedCellIndex;

		if (playerIcon == "X") {
			clickedCell.innerHTML = "X";
		} else {
			clickedCell.innerHTML = "O";
		}
	}

	//function to check winning condition
	function handleResultValidation() {
		let roundWon = false;

		//winning condition for 4-4 playboard
		if (watchedProxy.playboard == "4-4") {
			for (let i = 0; i <= 9; i++) {
				const winCondition = winningConditions[i];
				let a = gameState[winCondition[0]];
				let b = gameState[winCondition[1]];
				let c = gameState[winCondition[2]];
				let d = gameState[winCondition[3]];

				if (a === "" || b === "" || c === "" || d === "") {
					continue;
				}

				if (a === b && b === c && c === d) {
					roundWon = true;
					break;
				}
			}
		} else {
			//winning condition for 3-3 playboard
			if (watchedProxy.playboard == "3-3") {
				for (let i = 0; i <= 7; i++) {
					const winCondition = winningConditions[i];
					let a = gameState[winCondition[0]];
					let b = gameState[winCondition[1]];
					let c = gameState[winCondition[2]];

					if (a === "" || b === "" || c === "") {
						continue;
					}

					if (a === b && b === c) {
						roundWon = true;
						break;
					}
				}
			}
		}

		//following lines displays winning player and animation
		if (roundWon) {
			statusDisplay.innerHTML = `Player ${playerIcon} has won!`;
			document.querySelector(".body").classList.add("background");
			gameActive = false;
			return;
		}

		let roundDraw = !gameState.includes("");
		if (roundDraw) {
			statusDisplay.innerHTML = `Game ended in a draw!`;
			gameActive = false;
			return;
		}
		handlePlayerChange(); //function for change icon of player
	}

	function handlePlayerChange() {
		playerIcon = `${playerIcon == "X" ? "O" : "X"}`;
		statusDisplay.innerHTML = ` It's ${playerIcon}'s turn`;
	}

	//following two queries are for handle clicked cell and call function whenever any cell clicked
	document
		.querySelectorAll(".cell3")
		.forEach((cell) => cell.addEventListener("click", handleCellClick));
	document
		.querySelectorAll(".cell4")
		.forEach((cell) => cell.addEventListener("click", handleCellClick));

	//following three queries are for handle or call appropriate function on click event on buttons (restart, go back to home, undo)
	document
		.querySelector(".game--restart")
		.addEventListener("click", handleRestartGame);

	document.querySelector(".go-home").addEventListener("click", handleGoHome);

	document.querySelector(".undo").addEventListener("click", handleUnDo);
}

//function to restart game
function handleRestartGame() {
	//set gamestate whole empty
	gameState =
		watchedProxy.playboard == "4-4"
			? ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
			: ["", "", "", "", "", "", "", "", ""];
	gameActive = true;

	statusDisplay.innerHTML = `It's ${playerIcon}'s turn`;
	document.querySelector(".body").classList.remove("background");

	//following lines are for set all cells empty
	if (watchedProxy.playboard == "4-4") {
		document
			.querySelectorAll(".cell4")
			.forEach((cell) => (cell.innerHTML = ""));
	} else {
		document
			.querySelectorAll(".cell3")
			.forEach((cell) => (cell.innerHTML = ""));
	}
}

//function to go back to home
function handleGoHome() {
	window.location.reload();
}

//function to undo last move
function handleUnDo() {
	if (gameState[lastMove[lastStep]] == "X") {
		statusDisplay.innerHTML = "It's X's turn";
	} else {
		statusDisplay.innerHTML = "It's O's turn";
	}

	gameState[lastMove[lastStep]] = "";
	console.log(gameState);

	//following lines are for remove icon placed in cell in last move
	if (watchedProxy.playboard == "4-4") {
		document.querySelectorAll(".cell4").forEach((cell) => {
			if (
				parseInt(cell.getAttribute("data-cell-index4")) ==
				`${lastMove[lastStep]}`
			) {
				cell.innerHTML = "";
			}
		});
		if (gameActive == false) {
			gameActive = true;
			callComp = true;
		}
	} else {
		document.querySelectorAll(".cell3").forEach((cell) => {
			if (
				parseInt(cell.getAttribute("data-cell-index")) ==
				`${lastMove[lastStep]}`
			) {
				cell.innerHTML = "";
			}
		});
		if (gameActive == false) {
			gameActive = true;
			callComp = true;
		}
	}

	lastStep = lastStep - 1;
}
