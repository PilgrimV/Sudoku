import pygame
import sudoku_solver

# Функция для отображения игрового поля
def draw_board(board):
    # реализация функции
    pass

# Функция для ввода значений в клетки судоку
def input_values(board):
    # реализация функции
    pass

# Функция для проверки правильности заполнения клеток
def check_solution(board):
    # реализация функции
    pass

# Основной цикл игры
def main():
    pygame.init()
    board = [[0 for _ in range(9)] for _ in range(9)]
    draw_board(board)
    input_values(board)
    sudoku_solver.solve_sudoku(board)
    check_solution(board)

if __name__ == "__main__":
    main()