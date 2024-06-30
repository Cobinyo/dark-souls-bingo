const activities = [
    "Defeat the Last Giant",
    "Light all bonfires",
    "Find all Estus Shards",
    "Join the Blue Sentinels",
    "Invade another player",
    "Defeat a boss with a friend",
    "Upgrade a weapon to +10",
    "Collect all sorceries",
    "Complete a side quest",
    // Add more activities as needed
];

let gridSize = 3; // Default grid size
let userColor = '#ff0000';
let socket;
const boardState = {};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateBingoBoard() {
    const shuffledActivities = shuffle([...activities]);
    const bingoBoard = document.getElementById('bingo-board');
    bingoBoard.innerHTML = '';
    bingoBoard.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    bingoBoard.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;
    
    const numCells = gridSize * gridSize;
    for (let i = 0; i < numCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';
        cell.innerText = shuffledActivities[i % shuffledActivities.length];
        cell.addEventListener('click', () => toggleCell(cell, i));
        bingoBoard.appendChild(cell);
    }
}

function setGridSize(size) {
    gridSize = size;
    generateBingoBoard();
}

function toggleCell(cell, index) {
    if (boardState[index]) {
        delete boardState[index];
        cell.innerHTML = cell.innerText; // Remove overlay
    } else {
        boardState[index] = userColor;
        const colorOverlay = document.createElement('div');
        colorOverlay.className = 'cell-overlay';
        colorOverlay.style.backgroundColor = userColor;
        colorOverlay.style.opacity = '0.5';
        cell.appendChild(colorOverlay);
    }

    socket.emit('markCell', { boardId: 'default', index: index, color: userColor });
}

function updateCell(index, colors) {
    const cell = document.querySelectorAll('.bingo-cell')[index];
    if (!cell) return;

    cell.innerHTML = cell.innerText; // Reset cell content

    const overlayContainer = document.createElement('div');
    overlayContainer.style.display = 'flex';
    overlayContainer.style.width = '100%';
    overlayContainer.style.height = '100%';

    colors.forEach(color => {
        const colorOverlay = document.createElement('div');
        colorOverlay.className = 'cell-overlay';
        colorOverlay.style.backgroundColor = color;
        colorOverlay.style.flex = '1';
        overlayContainer.appendChild(colorOverlay);
    });

    cell.appendChild(overlayContainer);
}

document.getElementById('color').addEventListener('change', (event) => {
    userColor = event.target.value;
});

document.addEventListener('DOMContentLoaded', () => {
    socket = io.connect('http://localhost:4000');
    socket.on('updateCell', (data) => {
        updateCell(data.index, data.colors);
    });

    generateBingoBoard();
});
