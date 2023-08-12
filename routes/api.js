"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

class InputError extends Error {
  constructor(message) {
    super(message);
    this.name = "InputError";
  }
}

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    try {
      const puzzleString = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;

      if (!puzzleString || !coordinate || !value)
        throw new InputError("Required field(s) missing");
      if (!/^[1-9.]+$/.test(puzzleString))
        throw new InputError("Invalid characters in puzzle");
      if (!/^.{81}$/.test(puzzleString))
        throw new InputError("Expected puzzle to be 81 characters long");
      if (!/^[a-iA-I]{1}[1-9]{1}$/.test(coordinate))
        throw new InputError("Invalid coordinate");
      if (!/^[1-9]{1}$/.test(value)) throw new InputError("Invalid value");

      let [row, col] = coordinate.split("");
      let errors = [];
      if (!solver.checkRowPlacement(puzzleString, row, col, value))
        errors.push("row");
      if (!solver.checkColPlacement(puzzleString, row, col, value))
        errors.push("column");
      if (!solver.checkRegionPlacement(puzzleString, row, col, value))
        errors.push("region");

      if (errors.length == 0) {
        res.status(200).json({ valid: true });
      } else {
        res.status(200).json({
          valid: false,
          conflict: errors,
        });
      }
    } catch (e) {
      if (e instanceof InputError) {
        res.status(200).json({ error: e.message });
      } else {
        res.status(500).send("something went wrong");
      }
    }
  });

  app.route("/api/solve").post((req, res) => {
    try {
      const puzzleString = req.body.puzzle;

      if (!puzzleString) throw new InputError("Required field missing");
      if (!/^.{81}$/.test(puzzleString))
        throw new InputError("Expected puzzle to be 81 characters long");
      if (!/^[1-9.]+$/.test(puzzleString))
        throw new InputError("Invalid characters in puzzle");

      let solvedPuzzle = solver.solve(puzzleString);
      if (!solvedPuzzle) throw new InputError("Puzzle cannot be solved");
      res.status(200).json({ solution: solvedPuzzle });
    } catch (e) {
      if (e instanceof InputError) {
        res.status(200).json({ error: e.message });
      } else {
        res.status(500).send("something went wrong");
      }
    }
  });
};
