const crypto = require("crypto");
const Table = require("cli-table3");

// Helper function to generate a secure random key
function generateKey() {
  return crypto.randomBytes(32).toString("hex");
}

// Function to calculate the HMAC
function generateHMAC(key, message) {
  return crypto.createHmac("sha256", key).update(message).digest("hex");
}

// Class to handle game rules and determine the winner
class GameRules {
  constructor(moves) {
    this.moves = moves;
  }

  getComputerMove() {
    return this.moves[crypto.randomInt(0, this.moves.length)];
  }

  determineWinner(userMove, computerMove) {
    const userIndex = this.moves.indexOf(userMove),
      computerIndex = this.moves.indexOf(computerMove),
      movesLength = this.moves.length,
      half = Math.floor(movesLength / 2),
      sign = Math.sign(
        ((computerIndex - userIndex + half + movesLength) % movesLength) - half
      );

    if (sign === 0) {
      return "Draw";
    } else if (sign < 0) {
      return "You win!";
    } else {
      return "You lose!";
    }
  }

  printHelpTable() {
    const movesLength = this.moves.length;
    const table = new Table({
      head: ["v PC/User >", ...this.moves],
      colWidths: new Array(movesLength + 1),
      chars: {
        top: "-",
        "top-mid": "+",
        "top-left": "+",
        "top-right": "+",
        bottom: "-",
        "bottom-mid": "+",
        "bottom-left": "+",
        "bottom-right": "+",
        left: "|",
        "left-mid": "+",
        mid: "-",
        "mid-mid": "+",
        right: "|",
        "right-mid": "+",
        middle: "|",
      },
    });

    this.moves.forEach((move, i) => {
      const row = [move];
      for (let j = 0; j < movesLength; j++) {
        if (i === j) {
          row.push("Draw");
        } else if (
          (i < j && j - i <= Math.floor(movesLength / 2)) ||
          (i > j && i - j > Math.floor(movesLength / 2))
        ) {
          row.push("Win");
        } else {
          row.push("Lose");
        }
      }
      table.push(row);
    });

    console.log(table.toString());
  }
}

// Class to manage the game flow
class Game {
  constructor(moves) {
    this.moves = moves;
    this.rules = new GameRules(moves);
    this.key = generateKey();
    this.computerMove = this.rules.getComputerMove();
    this.hmac = generateHMAC(this.key, this.computerMove);
  }

  start() {
    console.log(`HMAC: ${this.hmac}`);
    this.showMenu();

    const stdin = process.openStdin();
    stdin.addListener("data", (input) => {
      const choice = input.toString().trim();
      if (choice === "?") {
        this.rules.printHelpTable();
      } else if (choice === "0") {
        console.log("Exiting the game...");
        process.exit();
      } else if (Number(choice) > 0 && Number(choice) <= this.moves.length) {
        const userMove = this.moves[Number(choice) - 1];
        this.showResults(userMove);
      } else {
        console.log("Invalid input, please try again.");
        this.showMenu();
      }
    });
  }

  showMenu() {
    console.log("Available moves:");
    this.moves.forEach((move, index) => {
      console.log(`${index + 1} - ${move}`);
    });
    console.log("0 - exit");
    console.log("? - help");
    console.log("Enter your move:");
  }

  showResults(userMove) {
    console.log(`Your move: ${userMove}`);
    console.log(`Computer move: ${this.computerMove}`);
    console.log(this.rules.determineWinner(userMove, this.computerMove));
    console.log(`HMAC key: ${this.key}`);
    console.log("Finish");
    process.exit();
  }
}

// Validate the command line arguments
function validateArgs(args) {
  if (args.length < 3) {
    console.error("Error: You must provide at least 3 moves.");
    process.exit(1);
  }
  if (args.length % 2 === 0) {
    console.error("Error: The number of moves must be odd.");
    process.exit(1);
  }
  if (new Set(args).size !== args.length) {
    console.error("Error: Moves must be unique.");
    process.exit(1);
  }
}

// Main entry point
const args = process.argv.slice(2);
validateArgs(args);

const game = new Game(args);
game.start();
