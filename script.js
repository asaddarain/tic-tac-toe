// ----------------------------------------------------//
// VARIALBLES //

// Buttons //
const editPlayer1BtnElement = document.getElementById("edit-player-1-btn");
const editPlayer2BtnElement = document.getElementById("edit-player-2-btn");

const cancelConfigBtnElement = document.getElementById("cancel-config-button");
const startGameBtnElement = document.getElementById("start-game-btn");

// Others //
const formElement = document.querySelector("form");
const usernameElement = document.querySelector("#username");
const errorsOutputElement = document.getElementById("config-error");
const gameAreaElement = document.getElementById("active-game");
// const gameBoardElements = document.querySelectorAll(".game-board li");
const gameBoardElement = document.getElementById("game-board");
const configOverlayElement = document.getElementById("config-overlay");
const backdropElement = document.getElementById("back-drop");
const activePlayerNameElement = document.getElementById("active-player-name");
const gameOverElement = document.getElementById("game-over");
let editedPlayer = 0;
let activePlayer = 0;
let currentRound = 1;
let gameIsOver = false;
const players = [
  { name: "", symbol: "X" },
  { name: "", symbol: "O" },
];

const gameData = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
// ----------------------------------------------------//
// FUNCTIONS //

// function 1
function openPlayerConfig(event) {
  configOverlayElement.style.display = "block";
  backdropElement.style.display = "block";
  editedPlayer = +event.target.dataset.playerid;
}

// function 2
function closePlayerConfig() {
  configOverlayElement.style.display = "none";
  backdropElement.style.display = "none";
  formElement.firstElementChild.classList.remove("error");
  errorsOutputElement.textContent = "";
  formElement.firstElementChild.lastElementChild.value = "";
  formElement.firstElementChild.lastElementChild.value = "";
  usernameElement.value = "";
}

// function 3
function savePlayerConfig(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const enteredPlayerName = formData.get("username").trim();

  if (!enteredPlayerName) {
    event.target.firstElementChild.classList.add("error");
    errorsOutputElement.textContent = "Please enter a valid name!";
    return;
  }
  const updatePlayerDataElement = document.getElementById(
    "player-" + editedPlayer + "-data"
  );
  updatePlayerDataElement.children[1].textContent = enteredPlayerName;

  players[editedPlayer - 1].name = enteredPlayerName;

  closePlayerConfig();
}

// function
function resetGame() {
  activePlayer = 0;
  currentRound = 1;
  gameIsOver = false;
  // gameOverElement.firstElementChild.innerHTML =
  // 'You won <b class="winner-name">PLAYER NAME !</b>';
  gameOverElement.style.display = "none";

  let gameBoardIndex = 0;
  for (let i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      gameData[i][j] = 0;
      const gameBoardItemElement = gameBoardElement.children[gameBoardIndex];
      gameBoardItemElement.textContent = "";
      gameBoardItemElement.classList.remove("disabled");
      gameBoardIndex++;
    }
  }
}

// function 4
function startNewGame() {
  if (players[0].name === "" || players[1].name === "") {
    alert("Please enter the valid custom names for both players!");
    return;
  }

  resetGame();

  activePlayerNameElement.textContent = players[activePlayer].name;
  gameAreaElement.style.display = "block";
}

// function 5
function switchPlayer() {
  if (activePlayer === 0) {
    activePlayer = 1;
  } else {
    activePlayer = 0;
  }
  activePlayerNameElement.textContent = players[activePlayer].name;
}

// function 6
function selectGameBoardArea(event) {
  if (event.target.tagName !== "LI" || gameIsOver) {
    return;
  }
  const selectedField = event.target;
  selectedRow = selectedField.dataset.row - 1;
  selectedColumn = selectedField.dataset.col - 1;

  if (gameData[selectedRow][selectedColumn] > 0) {
    alert("Please select an empty field!");
    return;
  }

  selectedField.innerText = players[activePlayer].symbol;
  selectedField.classList.add("disabled");

  gameData[selectedRow][selectedColumn] = activePlayer + 1;

  const winnerId = checkForGameOver();
  console.log(winnerId);
  if (winnerId !== 0) {
    gameOver(winnerId);
  }

  currentRound++;
  switchPlayer();
}

// function 7
// check for game over function----------------------//
function checkForGameOver() {
  // Checking for Rows equality //
  for (let i = 0; i < 3; i++) {
    if (
      gameData[i][0] > 0 &&
      gameData[i][0] === gameData[i][1] &&
      gameData[i][1] === gameData[i][2]
    ) {
      return gameData[i][0];
    }
  }

  // Checking for Columns equality //
  for (let i = 0; i < 3; i++) {
    if (
      gameData[0][i] > 0 &&
      gameData[0][i] === gameData[1][i] &&
      gameData[1][i] === gameData[2][i]
    ) {
      return gameData[0][i];
    }
  }

  // Checking for (Diagonal:Top left to bottom right) equality //
  if (
    gameData[0][0] > 0 &&
    gameData[0][0] === gameData[1][1] &&
    gameData[1][1] === gameData[2][2]
  ) {
    return gameData[0][0];
  }

  // Checking for (Diagonal:Bottom left to top right) equality //
  if (
    gameData[2][0] > 0 &&
    gameData[2][0] === gameData[1][1] &&
    gameData[1][1] === gameData[0][2]
  ) {
    return gameData[2][0];
  }

  if (currentRound === 9) {
    return -1;
  }
  return 0;
}

// function 8
// gameover function //
function gameOver(winnerId) {
  gameIsOver = true;
  gameOverElement.style.display = "block";

  if (winnerId > 0) {
    const winnerName = players[winnerId - 1].name;
    gameOverElement.firstElementChild.firstElementChild.textContent =
      winnerName;
  } else {
    gameOverElement.firstElementChild.textContent = "It's a Draw!";
  }
}

// ----------------------------------------------------//
// Event Listeners
editPlayer1BtnElement.addEventListener("click", openPlayerConfig);
editPlayer2BtnElement.addEventListener("click", openPlayerConfig);

cancelConfigBtnElement.addEventListener("click", closePlayerConfig);
backdropElement.addEventListener("click", closePlayerConfig);

formElement.addEventListener("submit", savePlayerConfig);

startGameBtnElement.addEventListener("click", startNewGame);

// for (const gameBoardElement of gameBoardElements) {
//   gameBoardElement.addEventListener("click", selectGameBoardArea);
// }
gameBoardElement.addEventListener("click", selectGameBoardArea);
