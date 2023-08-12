const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const validStrings =
  require("../controllers/puzzle-strings.js").puzzlesAndSolutions;

suite("Functional Tests", () => {
  // Solve a puzzle with valid puzzle string: POST request to /api/solve
  test("POST request to /api/solve with valid puzzle string", (done) => {
    validStrings.forEach((elem, index, array) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .type("form")
        .send({
          puzzle: elem[0],
        })
        .end((err, res) => {
          assert.equal(res.status, 200, "correct status number");
          assert.equal(res.body.solution, elem[1]);
          if (index + 1 == array.length) done();
        });
    });
  });
  // Solve a puzzle with missing puzzle string: POST request to /api/solve
  test("POST request with missing puzzle", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .type("form")
      .send()
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status number");
        assert.equal(
          res.body.error,
          "Required field missing",
          "correct error reply when puzzle string is missing"
        );
        done();
      });
  });
  // Solve a puzzle with invalid characters: POST request to /api/solve
  test("handle POST request with invalid characters puzzle", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .type("form")
      .send({
        puzzle:
          ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387a6",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.equal(
          res.body.error,
          "Invalid characters in puzzle",
          "correct error text"
        );
        done();
      });
  });
  // Solve a puzzle with incorrect length: POST request to /api/solve
  test("handle POST request with invalid length puzzle", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .type("form")
      .send({
        puzzle:
          "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.5191",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status number");
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long",
          "correct error text"
        );
      });
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .type("form")
      .send({
        puzzle:
          "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3.28.51",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status number");
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long",
          "correct error text"
        );
        done();
      });
  });
  // Solve a puzzle that cannot be solved: POST request to /api/solve
  test("handle a POST request with a valid string but unsolvable puzzle", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .type("form")
      .send({
        puzzle:
          ".9.3....1....8..46......8..4.5.6..3...32756...6..1.9.4..1......58..2....2....7.6.",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.equal(
          res.body.error,
          "Puzzle cannot be solved",
          "correct error text"
        );
        done();
      });
  });
  // Check a puzzle placement with all fields: POST request to /api/check
  test("handle POST request in /api/check with valid input", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .type("form")
      .send({
        puzzle:
          "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
        coordinate: "e4",
        value: "8",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.true(res.body.valid, "correct response from server");
        assert.notProperty(
          res.body,
          "conflict",
          "no conflict property on correct input"
        );
        done();
      });
  });
  // Check a puzzle placement with single placement conflict: POST request to /api/check
  test("handle POST request to check with single placement conflict", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .type("form")
      .send({
        puzzle:
          "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
        coordinate: "e4",
        value: "7",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.isFalse(res.body.valid, "correct valid value");
        assert.lengthOf(
          res.body.conflict,
          1,
          "conflict array has correct length"
        );
        assert.include(
          res.body.conflict,
          "row",
          "conflict array includes correct rule with conflict"
        );
        done();
      });
  });
  // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
  test("handle POST request to check with multiple placement conflict", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .type("form")
      .send({
        puzzle:
          "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
        coordinate: "e8",
        value: "8",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.isFalse(res.body.valid, "correct valid field value");
        assert.lengthOf(
          res.body.conflict,
          2,
          "conflict array has correct length"
        );
        assert.include(
          res.body.conflict,
          "column",
          "column is included in conflict list"
        );
        assert.include(
          res.body.conflict,
          "region",
          "region is included in conflict list"
        );
        done();
      });
  });
  // Check a puzzle placement with all placement conflicts: POST request to /api/check
  test("handle POST request to check with all placemetn conflicts", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .type("form")
      .send({
        puzzle:
          "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
        coorinate: "e4",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.isFalse(res.body.valid, "correct valid field value");
        assert.lengthOf(
          res.body.conflict,
          3,
          "conflict array has the correct length"
        );
        assert.include(
          res.body.conflict,
          "column",
          "column is included in conflict list"
        );
        assert.include(
          res.body.conflict,
          "region",
          "region is included in conflict list"
        );
        assert.include(
          res.body.conflict,
          "row",
          "row is included in conflict list"
        );
        done();
      });
  });
  // Check a puzzle placement with missing required fields: POST request to /api/check
  test("POST request to check with missing required fields", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .type("form")
      .send({
        puzzle:
          "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
        coordinate: "e4",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.equal(
          res.body.error,
          "Required field(s) missing",
          "correct error text"
        );
        done();
      });
  });
  test("POST request to check with missing required fields", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .type("form")
      .send({
        puzzle:
          "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
        value: "3",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.equal(
          res.body.error,
          "Required field(s) missing",
          "correct error text"
        );
        done();
      });
  });
  test("POST request to check with missing required fields", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .type("form")
      .send({
        coordinate: "e4",
        value: "3",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.equal(
          res.body.error,
          "Required field(s) missing",
          "correct error text"
        );
        done();
      });
  });
  // Check a puzzle placement with invalid characters: POST request to /api/check
  test("POST request to /api/check with invalid puzzle characters", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .type("form")
      .send({
        puzzle:
          ".7.89.....5....3.4.2..4..1.5689..472...6...c.1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
        coordinate: "e7",
        value: "5",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.equal(
          res.body.error,
          "Invalid characters in puzzle",
          "correct error text"
        );
        done();
      });
  });
  // Check a puzzle placement with incorrect length: POST request to /api/check
  test("POST request to /api/check with invalid puzzle characters", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .type("form")
      .send({
        puzzle:
          ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
        coordinate: "e7",
        value: "5",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long",
          "correct error text"
        );
        done();
      });
  });
  // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
  test("POST request to /api/check with invalid coordinate", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .type("form")
      .send({
        puzzle:
          ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
        coordinate: "55",
        value: 1,
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.equal(
          res.status.error,
          "Invalid coordinate",
          "correct error text"
        );
        done();
      });
  });
  // Check a puzzle placement with invalid placement value: POST request to /api/check
  test("POST request to /api/check with invalid value", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .type("form")
      .send({
        puzzle:
          ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
        coordinate: "e5",
        value: "test",
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "correct status code");
        assert.equal(res.status.error, "Invalid value", "correct error text");
        done();
      });
  });
});
