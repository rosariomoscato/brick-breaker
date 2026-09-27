export const WIDTH = 720;
export const HEIGHT = 480;
export const BALL_RADIUS = 7;
export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 12;
export const PADDLE_Y = 440;
export const BRICK_ROWS = 5;
export const BRICK_COLUMNS = 10;
export const BRICK_HEIGHT = 19;
export const BRICK_GAP = 7;
export const BRICK_LEFT = 43;
export const BRICK_TOP = 74;
export const BRICK_WIDTH = (WIDTH - 2 * BRICK_LEFT - (BRICK_COLUMNS - 1) * BRICK_GAP) / BRICK_COLUMNS;

export type Phase = "ready" | "playing" | "paused" | "won" | "lost";
export type Brick = { x: number; y: number; row: number; active: boolean };

export type Game = {
  phase: Phase;
  score: number;
  lives: number;
  paddleX: number;
  ballX: number;
  ballY: number;
  ballVX: number;
  ballVY: number;
  bricks: Brick[];
};

export function newGame(): Game {
  const paddleX = (WIDTH - PADDLE_WIDTH) / 2;
  return {
    phase: "ready",
    score: 0,
    lives: 3,
    paddleX,
    ballX: WIDTH / 2,
    ballY: PADDLE_Y - BALL_RADIUS - 4,
    ballVX: 180,
    ballVY: -320,
    bricks: Array.from({ length: BRICK_ROWS * BRICK_COLUMNS }, (_, index) => {
      const row = Math.floor(index / BRICK_COLUMNS);
      const column = index % BRICK_COLUMNS;
      return {
        x: BRICK_LEFT + column * (BRICK_WIDTH + BRICK_GAP),
        y: BRICK_TOP + row * (BRICK_HEIGHT + BRICK_GAP),
        row,
        active: true,
      };
    }),
  };
}

export function setPaddle(game: Game, centerX: number) {
  game.paddleX = Math.max(0, Math.min(WIDTH - PADDLE_WIDTH, centerX - PADDLE_WIDTH / 2));
  if (game.phase === "ready") game.ballX = game.paddleX + PADDLE_WIDTH / 2;
}

export function startGame(game: Game) {
  if (game.phase === "ready" || game.phase === "paused") game.phase = "playing";
}

export function pauseGame(game: Game) {
  if (game.phase === "playing") game.phase = "paused";
}

// Simulation uses fixed board coordinates; display size and pixel density never affect collisions.
export function stepGame(game: Game, seconds: number) {
  if (game.phase !== "playing") return;

  // Small steps prevent a fast ball from tunnelling through the thin bricks.
  const steps = Math.ceil(Math.min(seconds, 0.05) / 0.008);
  if (steps === 0) return;
  const dt = Math.min(seconds, 0.05) / steps;

  for (let i = 0; i < steps && game.phase === "playing"; i++) {
    const previousX = game.ballX;
    const previousY = game.ballY;
    game.ballX += game.ballVX * dt;
    game.ballY += game.ballVY * dt;

    if (game.ballX < BALL_RADIUS) {
      game.ballX = BALL_RADIUS;
      game.ballVX = Math.abs(game.ballVX);
    } else if (game.ballX > WIDTH - BALL_RADIUS) {
      game.ballX = WIDTH - BALL_RADIUS;
      game.ballVX = -Math.abs(game.ballVX);
    }
    if (game.ballY < BALL_RADIUS) {
      game.ballY = BALL_RADIUS;
      game.ballVY = Math.abs(game.ballVY);
    }

    if (
      game.ballVY > 0 &&
      previousY + BALL_RADIUS <= PADDLE_Y &&
      game.ballY + BALL_RADIUS >= PADDLE_Y &&
      game.ballX + BALL_RADIUS >= game.paddleX &&
      game.ballX - BALL_RADIUS <= game.paddleX + PADDLE_WIDTH
    ) {
      const offset = Math.max(-1, Math.min(1, (game.ballX - (game.paddleX + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2)));
      const speed = Math.min(520, Math.hypot(game.ballVX, game.ballVY) + 4);
      game.ballVX = speed * offset * 0.85;
      game.ballVY = -Math.sqrt(speed * speed - game.ballVX * game.ballVX);
      game.ballY = PADDLE_Y - BALL_RADIUS;
    }

    for (const brick of game.bricks) {
      if (!brick.active) continue;
      const closestX = Math.max(brick.x, Math.min(game.ballX, brick.x + BRICK_WIDTH));
      const closestY = Math.max(brick.y, Math.min(game.ballY, brick.y + BRICK_HEIGHT));
      const dx = game.ballX - closestX;
      const dy = game.ballY - closestY;
      if (dx * dx + dy * dy > BALL_RADIUS * BALL_RADIUS) continue;

      brick.active = false;
      game.score += (BRICK_ROWS - brick.row) * 10;
      if (previousY + BALL_RADIUS <= brick.y || previousY - BALL_RADIUS >= brick.y + BRICK_HEIGHT) {
        game.ballVY *= -1;
        game.ballY = previousY;
      } else {
        game.ballVX *= -1;
        game.ballX = previousX;
      }
      if (game.bricks.every((item) => !item.active)) game.phase = "won";
      break;
    }

    if (game.ballY - BALL_RADIUS > HEIGHT) {
      game.lives--;
      if (game.lives === 0) {
        game.phase = "lost";
      } else {
        game.phase = "ready";
        game.ballX = game.paddleX + PADDLE_WIDTH / 2;
        game.ballY = PADDLE_Y - BALL_RADIUS - 4;
        game.ballVX = game.lives % 2 === 0 ? -180 : 180;
        game.ballVY = -320;
      }
    }
  }
}
