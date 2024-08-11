function startGame(player) {
    localStorage.setItem('currentPlayer', player);
    window.location.href = 'game.html';
}

window.onload = function() {
    const currentPlayer = localStorage.getItem('currentPlayer');
    if (currentPlayer) {
        document.getElementById('print').innerText = `Player ${currentPlayer}'s Turn`;
    }
}

function makeMove(cell) {
    const currentPlayer = localStorage.getItem('currentPlayer');
    const cellElement = document.getElementById('b' + cell);

    if (cellElement.value === '') {
        cellElement.value = currentPlayer;
        cellElement.style.color = (currentPlayer === 'X') ? 'red' : 'blue';
        if (!checkWinner()) {
            switchPlayer();
        }
    }
}

function switchPlayer() {
    const currentPlayer = localStorage.getItem('currentPlayer');
    const newPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    localStorage.setItem('currentPlayer', newPlayer);
    document.getElementById('print').innerText = `Player ${newPlayer}'s Turn`;
}

function checkWinner() {
    const winConditions = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [3, 5, 7]
    ];

    const cells = Array.from({ length: 9 }, (_, i) => document.getElementById('b' + (i + 1)).value);

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (cells[a - 1] && cells[a - 1] === cells[b - 1] && cells[a - 1] === cells[c - 1]) {
            document.getElementById('print').innerText = `Player ${cells[a - 1]} wins!`;
            disableAllCells();
            drawWinningLine(condition);
            return true;
        }
    }

    if (cells.every(cell => cell)) {
        document.getElementById('print').innerText = "It's a Tie!";
        return true;
    }

    return false;
}

function disableAllCells() {
    for (let i = 1; i <= 9; i++) {
        document.getElementById('b' + i).disabled = true;
    }
}

function drawWinningLine(condition) {
    const line = document.createElement('div');
    line.classList.add('winning-line');
    document.getElementById('main').appendChild(line);

    const [a, b, c] = condition;
    const cell1 = document.getElementById('b' + a).getBoundingClientRect();
    const cell3 = document.getElementById('b' + c).getBoundingClientRect();
    const cell2 = document.getElementById('b' + b).getBoundingClientRect();
    const mainRect = document.getElementById('main').getBoundingClientRect();

    const x1 = cell1.left + cell1.width / 2 - mainRect.left;
    const y1 = cell1.top + cell1.height / 2 - mainRect.top;
    const x2 = cell3.left + cell3.width / 2 - mainRect.left;
    const y2 = cell3.top + cell3.height / 2 - mainRect.top;

    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 0';
    line.style.top = `${Math.min(y1, y2)}px`;
    line.style.left = `${Math.min(x1, x2)}px`;
}

function resetGame() {
    for (let i = 1; i <= 9; i++) {
        document.getElementById('b' + i).value = '';
        document.getElementById('b' + i).disabled = false;
    }
    document.getElementById('print').innerText = '';
    document.querySelectorAll('.winning-line').forEach(line => line.remove());
    window.location.href = 'index.html';
}
