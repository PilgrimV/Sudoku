document.getElementById("solve-btn").addEventListener("click", () => {
    const board = [];
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            const val = document.getElementById(`cell-${i}-${j}`).value;
            row.push(val ? parseInt(val) : 0);
        }
        board.push(row);
    }
    solveSudoku(board, true);  // true для быстрого решения
});

document.getElementById("solve-animated-btn").addEventListener("click", () => {
    const board = [];
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            const val = document.getElementById(`cell-${i}-${j}`).value;
            row.push(val ? parseInt(val) : 0);
        }
        board.push(row);
    }
    solveSudoku(board, false);  // false для решения с анимацией
});

document.getElementById("clear-btn").addEventListener("click", () => {
    document.querySelectorAll("input").forEach(cell => {
        cell.value = "";
        cell.style.backgroundColor = "";  // Очищаем фон
    });
});

async function solveSudoku(board, quickSolve = false) {
    const delay = quickSolve ? 0 : 30;  // Быстрое решение без задержек

    async function isValid(num, row, col) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) return false;
        }

        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num) return false;
            }
        }

        return true;
    }

    async function backtrack() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (await isValid(num, row, col)) {
                            board[row][col] = num;
                            updateCell(row, col, num);
                            if (await backtrack()) return true;
                            board[row][col] = 0;
                            updateCell(row, col, '');
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    await backtrack();
}

function updateCell(row, col, val) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    cell.value = val;
    cell.style.backgroundColor = val ? "#d4ffd4" : "#ffd4d4";
}
