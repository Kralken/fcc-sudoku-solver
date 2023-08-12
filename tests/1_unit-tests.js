const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();
const validStrings =
  require("../controllers/puzzle-strings.js").puzzlesAndSolutions;

suite("Unit Tests", () => {
  // Logic handles a valid puzzle string of 81 characters
  test("Valid string is handled correctly", () => {
    validStrings.forEach((elem) => {
      assert.isTrue(solver.validate(elem[0], "Validate handles valid strings"));
    });
  });
  // Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test("Invalid strings are rejected by validate", () => {
    assert.isFalse(
      solver.validate("invalid"),
      "handles incorrect length and invalid characters"
    );
    assert.isFalse(
      solver.validate(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16..d.926914c37."
      ),
      "handles incorrect char but correct length"
    );
  });
  // Logic handles a puzzle string that is not 81 characters in length
  test("Validate rejects wrong length string", () => {
    assert.isFalse(
      solver.validate(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16926914.37."
      ),
      "handles correct chars but incorrect length"
    );
  });
  // Logic handles a valid row placement
  test("check row placement handles a valid input correctly", () => [
    assert.isTrue(
      solver.checkRowPlacement(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        "a",
        2,
        3
      )
    ),
  ]);
  // Logic handles an invalid row placement
  test("check row placement handles an invalid input correctly", () => [
    assert.isFalse(
      solver.checkRowPlacement(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        "A",
        2,
        1
      )
    ),
  ]);
  // Logic handles a valid column placement
  test("check column placement handles a valid column placement correctly", () => {
    assert.isTrue(
      solver.checkColPlacement(
        "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
        "d",
        6,
        9
      )
    );
  });
  // Logic handles an invalid column placement
  test("check column placement handles an invalid column placement correctly", () => {
    assert.isFalse(
      solver.checkColPlacement(
        "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
        "d",
        6,
        3
      )
    );
  });
  // Logic handles a valid region (3x3 grid) placement
  test("check region placement correctly handles a valid input", () => {
    assert.isTrue(
      solver.checkRegionPlacement(
        "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
        "f",
        7,
        1
      )
    );
  });
  // Logic handles an invalid region (3x3 grid) placement
  test("check region placement correctly handles an invalid input", () => {
    assert.isFalse(
      solver.checkRegionPlacement(
        "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
        "f",
        7,
        7
      )
    );
  });
  // Valid puzzle strings pass the solver
  test("valid strings pass the solver", () => [
    validStrings.forEach((elem) => {
      assert.isNotFalse(solver.solve(elem[0]));
    }),
  ]);
  // Invalid puzzle strings fail the solver
  test("invalid strings fail the solver", () => {
    assert.isFalse(
      solver.solve(
        ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387r6"
      )
    );
    assert.isFalse(
      solver.solve(
        ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.938.6"
      )
    );
    assert.isFalse(
      solver.solve(
        ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1...9r387.6"
      )
    );
  });
  // Solver returns the expected solution for an incomplete puzzle
  test("Solver returns the expected solution for an incomplete puzzle", () => {
    validStrings.forEach((elem) => {
      assert.equal(
        solver.solve(elem[0]),
        elem[1],
        "solver returns the correct solved string"
      );
    });
  });
});
