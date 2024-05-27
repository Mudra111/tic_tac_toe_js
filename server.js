const { request } = require("http");

var clients = {};

var games = {};

let WIN_STATES = [];

let board = [];

let nextIcon = "";

let winnerIcon = "";

let watchedObject = {
	//update objects or call function on change in below specified variable variable
	playboard: " ",
};

let watchedProxy = new Proxy(watchedObject, {
	set: function (target, key, value) {
		target[key] = value;
		if (key === "playboard") {
			onplaybordChange(value); // Call the function when the variable changes
		}
		return true;
	},
});

function onplaybordChange() {
	WIN_STATES =
		watchedProxy.playboard == "4-4"
			? [
					[0, 1, 2, 3],
					[4, 5, 6, 7],
					[8, 9, 10, 11],
					[12, 13, 14, 15],
					[0, 5, 10, 15],
					[3, 6, 9, 12],
					[0, 4, 8, 12],
					[1, 5, 9, 13],
					[2, 6, 10, 14],
					[3, 7, 11, 15],
			  ]
			: [
					[0, 1, 2],
					[3, 4, 5],
					[6, 7, 8],
					[0, 3, 6],
					[1, 4, 7],
					[2, 5, 8],
					[0, 4, 8],
					[2, 4, 6],
			  ];

	board =
		watchedProxy.playboard == "4-4"
			? ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
			: ["", "", "", "", "", "", "", "", ""];
}

const http = require("http")
	.createServer()
	.listen(8080, console.log("Server is started on port 8080"));

//creating websocket object named socket and server
const server = require("websocket").server;
const socket = new server({ httpServer: http });

//event listener for request event
socket.on("request", (req) => {
	const conn = req.accept(null, req.origin);
	const clientId =
		Math.round(Math.random() * 10) +
		Math.round(Math.random() * 10) +
		Math.round(Math.random() * 10);

	clients[clientId] = { conn: conn };
	conn.send(
		JSON.stringify({
			tag: "connected",
			clientId: clientId,
		})
	);

	sendAvailGames();
	conn.on("message", onMessage);
});

function sendAvailGames() {
	const gamesList = [];
	for (const game in games) {
		if (games[game].players.length < 2) {
			gamesList.push(game);
		}
	}
	for (const client in clients) {
		clients[client].conn.send(
			JSON.stringify({
				tag: "gamesList",
				list: gamesList,
			})
		);
	}
}

function onMessage(msg) {
	const data = JSON.parse(msg.utf8Data);
	switch (data.tag) {
		case "create":
			const gameId =
				Math.round(Math.random() * 100) +
				Math.round(Math.random() * 100) +
				Math.round(Math.random() * 100);
			var player = {
				clientId: data.clientId,
				symbol: "X",
				isTurn: true,
			};
			watchedProxy.playboard = data.playBoard;
			const players = Array(player);

			games[gameId] = {
				board: board,
				players: players,
			};
			clients[data.clientId].conn.send(
				JSON.stringify({
					tag: "created",
					gameId: gameId,
				})
			);
			sendAvailGames();
			break;
		case "join":
			var player = {
				clientId: data.clientId,
				symbol: "O",
				isTurn: false,
			};
			games[data.gameId].players.push(player);
			// console.log(games[data.gameId]);
			sendAvailGames();
			games[data.gameId].players.forEach((player) => {
				clients[player.clientId].conn.send(
					JSON.stringify({
						tag: "joined",
						gameId: data.gameId,
						symbol: player.symbol,
					})
				);
			});
			updateBoard(data.gameId);
			break;
		case "moveMade":
			games[data.gameId].board = data.board;
			// console.log(games[data.gameId].board);
			// console.log(data.board);
			const isWinner = winState(data.gameId);
			const isDraw = drawState(data.gameId);

			if (isWinner) {
				games[data.gameId].players.forEach((player) => {
					clients[player.clientId].conn.send(
						JSON.stringify({
							tag: "winner",
							winner: winnerIcon,
							gameState: false,
						})
					);
				});
				updateBoard(data.gameId);
			} else {
				if (isDraw) {
					updateBoard(data.gameId);
					games[data.gameId].players.forEach((player) => {
						clients[player.clientId].conn.send(
							JSON.stringify({
								tag: "gameDraw",
							})
						);
					});
				} else {
					games[data.gameId].players.forEach((player) => {
						player.isTurn = !player.isTurn;
					});
					updateBoard(data.gameId);
				}
			}
			break;
		case "goHome":
			games[data.gameId].players.forEach((player) => {
				clients[player.clientId].conn.send(
					JSON.stringify({
						tag: "gameTerminated",
					})
				);
			});
			break;
		case "restart":
			games[data.gameId].players.forEach((player) => {
				clients[player.clientId].conn.send(
					JSON.stringify({
						tag: "gamerestarted",
					})
				);
			});
			restartGame(data.gameId);
			break;
	}
}

function restartGame(gameId) {
	games[gameId].players.forEach((player) => {
		clients[player.clientId].conn.send(
			JSON.stringify({
				tag: "updateBoard",
				isTurn: true,
				board: board,
			})
		);
	});
}

function updateBoard(gameId) {
	games[gameId].players.forEach((player) => {
		clients[player.clientId].conn.send(
			JSON.stringify({
				tag: "updateBoard",
				isTurn: player.isTurn,
				board: games[gameId].board,
			})
		);
		// console.log(games[gameId].board);
	});
}

function winState(gameId) {
	if (
		WIN_STATES.some((row) => {
			return row.every((cell) => {
				return games[gameId].board[cell] == "X";
			});
		})
	) {
		winnerIcon = "X";
	} else {
		if (
			WIN_STATES.some((row) => {
				return row.every((cell) => {
					return games[gameId].board[cell] == "O";
				});
			})
		) {
			winnerIcon = "O";
		}
	}
	return WIN_STATES.some((row) => {
		return (
			row.every((cell) => {
				return games[gameId].board[cell] == "X";
			}) ||
			row.every((cell) => {
				return games[gameId].board[cell] == "O";
			})
		);
	});
}

function drawState(gameId) {
	return WIN_STATES.every((row) => {
		return (
			row.some((cell) => {
				return games[gameId].board[cell] == "X";
			}) &&
			row.some((cell) => {
				return games[gameId].board[cell] == "O";
			})
		);
	});
}
