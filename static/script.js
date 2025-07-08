const fileInput = document.getElementById('sudoku-image');
const canvas = document.getElementById('sudoku-canvas');
const ctx = canvas.getContext('2d');

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 450, 450);
        canvas.style.display = 'block';
    };
    img.src = URL.createObjectURL(file);
});

document.getElementById('recognize-btn').addEventListener('click', async () => {
    if (canvas.style.display !== 'block') {
        alert('Сначала загрузите изображение судоку!');
        return;
    }

    const size = 50;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cellData = ctx.getImageData(col * size, row * size, size, size);

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = tempCanvas.height = size;
            tempCanvas.getContext('2d').putImageData(cellData, 0, 0);

            const { data: { text } } = await Tesseract.recognize(
                tempCanvas,
                'eng',
                { tessedit_char_whitelist: '123456789' }
            );

            const digit = text.trim().replace(/\D/g, '');
            document.getElementById(`cell-${row}-${col}`).value = digit.length === 1 ? digit : '';
        }
    }

    alert('Распознавание завершено!');
});

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
    solveSudoku(board, true);
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
    solveSudoku(board, false);
});

document.getElementById("clear-btn").addEventListener("click", () => {
    document.querySelectorAll("input").forEach(cell => {
        cell.value = "";
        cell.style.backgroundColor = "";
    });
});

document.getElementById("theme-toggle-btn").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.querySelectorAll("input").forEach(input => {
        input.classList.toggle("dark-mode");
    });
    document.querySelectorAll("button").forEach(button => {
        button.classList.toggle("dark-mode");
    });
});

async function solveSudoku(board, quickSolve = false) {
    const delay = quickSolve ? 0 : 30;

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
