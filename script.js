let currentPlayer = 'X';
let gameActive = true;
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];
let overallBoard = Array(9).fill(null).map(() => Array(9).fill(''));
let overallWin = Array(9).fill('');
let highlightedBoard = null;

function createBoard() {
    const overallBoardElement = document.getElementById('overall-board');
    overallBoardElement.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const boardElement = document.createElement('div');
        boardElement.classList.add('board');
        boardElement.dataset.index = i;

        for (let j = 0; j < 9; j++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.boardIndex = i;
            cellElement.dataset.cellIndex = j;
            cellElement.onclick = () => placeMark(i, j);
            boardElement.appendChild(cellElement);
        }

        overallBoardElement.appendChild(boardElement);
    }
}

function placeMark(boardIndex, cellIndex) {
    if (!gameActive || overallBoard[boardIndex][cellIndex] !== '' || (highlightedBoard !== null && highlightedBoard !== boardIndex)) return;

    overallBoard[boardIndex][cellIndex] = currentPlayer;
    const cellElement = document.querySelector(`.cell[data-board-index='${boardIndex}'][data-cell-index='${cellIndex}']`);
    cellElement.innerText = currentPlayer;
    cellElement.classList.add('player-' + currentPlayer.toLowerCase());

    if (checkWin(overallBoard[boardIndex])) {
        overallWin[boardIndex] = currentPlayer;
        document.querySelector(`.board[data-index='${boardIndex}']`).classList.add('winner', `player-${currentPlayer.toLowerCase()}`);
        endGame(currentPlayer);
        return;
    }

    if (checkDraw(overallBoard[boardIndex])) {
        overallWin[boardIndex] = 'draw';
        document.querySelector(`.board[data-index='${boardIndex}']`).classList.add('draw');
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('status').innerText = `${currentPlayer}'s turn`;

    document.querySelectorAll('.board').forEach(board => board.classList.remove('highlight', 'disabled'));
    if (overallWin[cellIndex] === '') {
        document.querySelector(`.board[data-index='${cellIndex}']`).classList.add('highlight');
        highlightedBoard = cellIndex;
    } else {
        highlightedBoard = null;
    }

    document.querySelectorAll('.board').forEach((board, index) => {
        if (highlightedBoard !== null && index !== highlightedBoard) {
            board.classList.add('disabled');
        }
    });
}

function checkWin(board) {
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function endGame(winner) {
    document.getElementById('status').innerText = `${winner} wins the game!`;
    gameActive = false;
    document.querySelectorAll('.cell').forEach(cell => {
        if (cell.innerText === 'X') {
            cell.classList.add(winner === 'X' ? 'win' : '');
        } else if (cell.innerText === 'O') {
            cell.classList.add(winner === 'O' ? 'win' : '');
        }
    });
}

function checkDraw(board) {
    return board.every(cell => cell !== '');
}

function resetGame() {
    overallBoard = Array(9).fill(null).map(() => Array(9).fill(''));
    overallWin = Array(9).fill('');
    gameActive = true;
    currentPlayer = 'X';
    highlightedBoard = null;
    document.getElementById('status').innerText = "X's turn";
    createBoard();
}

createBoard();
