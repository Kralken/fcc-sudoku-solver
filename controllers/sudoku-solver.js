class SudokuSolver {
  validate(puzzleString) {
    const tester = /^[1-9.]{81}$/;
    return tester.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowToNum = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8 };
    const rowNum = rowToNum[row.toLowerCase()];
    const startPosition = rowNum * 9;

    return !puzzleString
      .substring(startPosition, startPosition + 9)
      .includes(`${value}`);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colIndex = column - 1;
    for (let i = colIndex; i < 81; i += 9) {
      if (value == puzzleString[i]) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowToNum = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8 };
    const rowNum = rowToNum[row.toLowerCase()];
    const rowRange = Math.floor(rowNum / 3);
    const colRange = Math.floor(column / 3);

    for (let i = colRange * 3; i < colRange * 3 + 3; i++) {
      for (let j = rowRange * 3; j < rowRange * 3 + 3; j++) {
        if (puzzleString[i * 9 + j] == value) return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (!puzzleString.includes(".")) return puzzleString;

    for (let i = 0; i < 81; i++) {
      //
    }
  }
}

module.exports = SudokuSolver;

let solver = new SudokuSolver();
console.log(
  solver.checkRegionPlacement(
    "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
    "a",
    2,
    1
  )
);
