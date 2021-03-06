function equalBoards(b1, b2) {
  // i don't wanna compare arrays >:)
  if (b1.top.toString() !== b2.top.toString()) return false;
  if (b1.bot.toString() !== b2.bot.toString()) return false;

  if (b1.currentTurn !== b2.currentTurn) return false;
  if (b1.scores.top !== b2.scores.top) return false;
  if (b1.scores.bot !== b2.scores.bot) return false;

  return true;
}

function getOtherSide(currentSide) {
  return currentSide === "top" ? "bot" : "top";
}

function makeMove(board, side, holeIdx) {
  const newBoard = { ...board };
  const otherSide = getOtherSide(side);
  let stones = newBoard[side][holeIdx];
  if (!stones || holeIdx < 0 || holeIdx > 6 || side !== newBoard.currentTurn)
    return newBoard;

  newBoard[side][holeIdx] = 0;
  let startingIdx = holeIdx + 1;
  let currentSide = side;
  let extraMove = false;
  while (stones > 0) {
    for (let i = startingIdx; stones && i < 7; ++i) {
      // last stone mechanics
      const lastStone = stones === 1;
      const nextPitEmpty = !newBoard[currentSide][i];
      const otherPitEmpty = !newBoard[otherSide][6 - i];
      const canCapture = nextPitEmpty && !otherPitEmpty && currentSide === side;

      if (lastStone && !nextPitEmpty) {
        stones = ++newBoard[currentSide][i];
        newBoard[currentSide][i] = 0;
      } else if (lastStone && canCapture) {
        newBoard.scores[side] += ++newBoard[otherSide][6 - i];
        newBoard[otherSide][6 - i] = 0;
        stones--;
      } else {
        stones--;
        newBoard[currentSide][i]++;
      }
    }

    if (stones && currentSide === side) {
      newBoard.scores[side]++;
      stones--;
      if (stones === 0) {
        extraMove = true;
      }
    }
    currentSide = getOtherSide(currentSide);
    startingIdx = 0;
  }
  newBoard.currentTurn = extraMove ? side : otherSide;
  return newBoard;
}

// exports for testing
module.exports = { makeMove, equalBoards };
