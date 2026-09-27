import assert from "node:assert/strict";
import test from "node:test";
import { BALL_RADIUS, BRICK_HEIGHT, BRICK_WIDTH, HEIGHT, PADDLE_WIDTH, PADDLE_Y, WIDTH, newGame, setPaddle, startGame, stepGame } from "../src/lib/game.ts";

test("paddle remains inside the board and carries a waiting ball", () => {
  const game = newGame();
  setPaddle(game, -500);
  assert.equal(game.paddleX, 0);
  assert.equal(game.ballX, PADDLE_WIDTH / 2);
  setPaddle(game, WIDTH + 500);
  assert.equal(game.paddleX, WIDTH - PADDLE_WIDTH);
});

test("a missed ball costs one life, then ends the game after three misses", () => {
  const game = newGame();
  for (let life = 2; life >= 0; life--) {
    startGame(game);
    game.ballX = 0;
    game.ballY = HEIGHT + BALL_RADIUS;
    game.ballVY = 320;
    stepGame(game, 0.016);
    assert.equal(game.lives, life);
    assert.equal(game.phase, life ? "ready" : "lost");
  }
});

test("clearing the final brick adds its points and wins", () => {
  const game = newGame();
  game.bricks.forEach((brick) => { brick.active = false; });
  const last = game.bricks[0];
  last.active = true;
  startGame(game);
  game.ballX = last.x + BRICK_WIDTH / 2;
  game.ballY = last.y + BRICK_HEIGHT + BALL_RADIUS + 1;
  game.ballVX = 0;
  game.ballVY = -320;
  stepGame(game, 0.016);
  assert.equal(game.phase, "won");
  assert.equal(game.score, 50);
});

test("the paddle sends a descending ball back up", () => {
  const game = newGame();
  startGame(game);
  game.ballX = game.paddleX + PADDLE_WIDTH / 2;
  game.ballY = PADDLE_Y - BALL_RADIUS - 2;
  game.ballVY = 320;
  stepGame(game, 0.016);
  assert.ok(game.ballVY < 0);
  assert.equal(game.lives, 3);
});
