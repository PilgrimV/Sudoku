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
    solveSudoku(board);
});

async function solveSudoku(board) {
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

// Подсветка одинаковых значений
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", () => {
        const value = input.value;
        clearHighlights();
        if (value) {
            document.querySelectorAll("input").forEach(cell => {
                if (cell.value === value) {
                    cell.classList.add("highlight-same");
                }
            });
        }
    });

    input.addEventListener("input", () => {
        input.dispatchEvent(new Event("focus"));
    });

    input.addEventListener("blur", () => {
        setTimeout(clearHighlights, 100);
    });
});

function clearHighlights() {
    document.querySelectorAll(".highlight-same").forEach(cell => {
        cell.classList.remove("highlight-same");
    });
}
