FROM python:3.11-slim

WORKDIR /app

COPY sudoku_solver.py .

CMD ["python", "sudoku_solver.py"]
