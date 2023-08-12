class SudokuSolver {
  validate(puzzleString) {
    const tester = /^[1-9.]{81}$/;
    return tester.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowToNum = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8 };
    let rowNum;
    if (/^[a-iA-I]$/.test(row)) {
      rowNum = rowToNum[row.toLowerCase()];
    } else {
      rowNum = row;
    }
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
    let rowNum;
    if (/^[a-iA-I]$/.test(row)) {
      rowNum = rowToNum[row.toLowerCase()];
    } else {
      rowNum = row;
    }
    const rowRange = Math.floor(rowNum / 3);
    const colRange = Math.floor((column - 1) / 3);

    for (let i = colRange * 3; i < colRange * 3 + 3; i++) {
      for (let j = rowRange * 3; j < rowRange * 3 + 3; j++) {
        if (puzzleString[j * 9 + i] == value) return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (!puzzleString.includes(".")) return puzzleString;
    if (!this.validate(puzzleString)) return false;
    let dotIndex = puzzleString.indexOf(".");
    for (let i = 1; i <= 9; i++) {
      let row = Math.floor(dotIndex / 9);
      let col = (dotIndex % 9) + 1;

      if (
        this.checkColPlacement(puzzleString, row, col, i) &&
        this.checkRowPlacement(puzzleString, row, col, i) &&
        this.checkRegionPlacement(puzzleString, row, col, i)
      ) {
        let newPuzzleString =
          puzzleString.substring(0, dotIndex) +
          i +
          puzzleString.substring(dotIndex + 1);
        let result = this.solve(newPuzzleString);
        if (result) return result;
      }
    }
    return false;
  }
}

module.exports = SudokuSolver;
