from flask import Flask, render_template, request
from sudoku_solver import solve, print_board

app = Flask(__name__)

def parse_form(form):
    board = []
    for i in range(9):
        row = []
        for j in range(9):
            val = form.get(f"cell_{i}_{j}")
            row.append(int(val) if val and val.isdigit() else 0)
        board.append(row)
    return board

@app.route("/", methods=["GET", "POST"])
def index():
    board = [[0 for _ in range(9)] for _ in range(9)]

    if request.method == "POST":
        board = parse_form(request.form)
        if solve(board):
            return render_template("index.html", board=board)
        else:
            return render_template("index.html", board=board, error="Нет решения")

    return render_template("index.html", board=board)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
