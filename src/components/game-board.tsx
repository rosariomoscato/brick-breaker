"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BALL_RADIUS, BRICK_HEIGHT, BRICK_WIDTH, HEIGHT,
  PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_Y, WIDTH,
  newGame, pauseGame, setPaddle, startGame, stepGame,
  type Game, type Phase,
} from "@/lib/game";
import { translations, type Locale } from "@/lib/i18n";

type Display = { phase: Phase; score: number; lives: number };

function draw(ctx: CanvasRenderingContext2D, game: Game, colors: Record<string, string>) {
  ctx.fillStyle = colors.playfield;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.strokeStyle = colors.border;
  ctx.globalAlpha = 0.12;
  for (let x = 24; x < WIDTH; x += 24) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HEIGHT); ctx.stroke();
  }
  for (let y = 24; y < HEIGHT; y += 24) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const rows = [colors.red, colors.orange, colors.yellow, colors.mint, colors.blue];
  for (const brick of game.bricks) {
    if (!brick.active) continue;
    ctx.fillStyle = rows[brick.row];
    ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
    ctx.fillStyle = colors.foreground;
    ctx.globalAlpha = 0.16;
    ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, 3);
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = colors.primary;
  ctx.globalAlpha = 0.16;
  ctx.fillRect(game.paddleX - 7, PADDLE_Y - 4, PADDLE_WIDTH + 14, PADDLE_HEIGHT + 10);
  ctx.globalAlpha = 1;
  ctx.fillStyle = colors.foreground;
  ctx.fillRect(game.paddleX, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillStyle = colors.primary;
  ctx.fillRect(game.paddleX + 5, PADDLE_Y, PADDLE_WIDTH - 10, 3);

  if (game.phase !== "lost") {
    ctx.beginPath();
    ctx.arc(game.ballX, game.ballY, BALL_RADIUS + 5, 0, Math.PI * 2);
    ctx.fillStyle = colors.primary;
    ctx.globalAlpha = 0.17;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(game.ballX, game.ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = colors.foreground;
    ctx.fill();
  }
}

export function GameBoard({ locale }: { locale: Locale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>(newGame());
  const keysRef = useRef({ left: false, right: false });
  const [display, setDisplay] = useState<Display>({ phase: "ready", score: 0, lives: 3 });
  const t = translations[locale];

  const sync = useCallback(() => {
    const { phase, score, lives } = gameRef.current;
    setDisplay((previous) => previous.phase === phase && previous.score === score && previous.lives === lives
      ? previous : { phase, score, lives });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = WIDTH * pixelRatio;
    canvas.height = HEIGHT * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const css = getComputedStyle(document.documentElement);
    const color = (name: string) => css.getPropertyValue(name).trim();
    const colors = {
      playfield: color("--playfield"), border: color("--border"),
      foreground: color("--foreground"), primary: color("--primary"),
      red: color("--brick-red"), orange: color("--brick-orange"),
      yellow: color("--brick-yellow"), mint: color("--brick-mint"), blue: color("--brick-blue"),
    };
    let frame = 0;
    let lastTime = 0;
    const tick = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      const game = gameRef.current;
      if (game.phase === "playing") {
        if (keysRef.current.left) setPaddle(game, game.paddleX + PADDLE_WIDTH / 2 - 480 * dt);
        if (keysRef.current.right) setPaddle(game, game.paddleX + PADDLE_WIDTH / 2 + 480 * dt);
        stepGame(game, dt);
        sync();
      }
      draw(ctx, game, colors);
      frame = requestAnimationFrame(tick);
    };
    draw(ctx, gameRef.current, colors);
    frame = requestAnimationFrame(tick);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest("button, a, input, select")) return;
      if (["ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
      if (event.code === "ArrowLeft") keysRef.current.left = true;
      if (event.code === "ArrowRight") keysRef.current.right = true;
      if (event.code === "Space" && !event.repeat) {
        if (gameRef.current.phase === "playing") pauseGame(gameRef.current);
        else startGame(gameRef.current);
        sync();
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft") keysRef.current.left = false;
      if (event.code === "ArrowRight") keysRef.current.right = false;
    };
    const onBlur = () => {
      keysRef.current.left = false;
      keysRef.current.right = false;
      pauseGame(gameRef.current);
      sync();
    };
    const onVisibility = () => { if (document.hidden) onBlur(); };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [sync]);

  function pointPaddle(event: React.PointerEvent<HTMLCanvasElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPaddle(gameRef.current, (event.clientX - bounds.left) * WIDTH / bounds.width);
  }

  function primaryAction() {
    if (display.phase === "won" || display.phase === "lost") gameRef.current = newGame();
    startGame(gameRef.current);
    sync();
  }

  function restart() {
    gameRef.current = newGame();
    sync();
  }

  const overlay = display.phase !== "playing";
  const title = display.phase === "playing" ? "" : display.phase === "ready" && display.lives < 3 ? t.lifeReady
    : display.phase === "ready" ? t.ready : display.phase === "paused" ? t.paused
      : display.phase === "won" ? t.won : t.lost;
  const detail = display.phase === "playing" ? "" : display.phase === "ready" && display.lives < 3 ? t.lifeReadyDetail
    : display.phase === "ready" ? t.readyDetail : display.phase === "paused" ? t.pausedDetail
      : display.phase === "won" ? t.wonDetail : t.lostDetail;

  return (
    <section aria-label={t.canvasLabel} className="w-full">
      <div className="rounded-lg border border-border bg-card p-2 sm:p-4">
        <div className="flex items-center justify-between border-b border-border px-2 pb-3 text-[length:var(--text-arcade-label)] tracking-[0.2em] text-muted-foreground sm:px-3">
          <span>{t.level}</span><span aria-hidden="true" className="flex gap-1.5"><i className="size-2 bg-brick-red" /><i className="size-2 bg-brick-yellow" /><i className="size-2 bg-brick-blue" /></span>
        </div>
        <div className="relative mt-3 overflow-hidden border border-border bg-playfield">
          <canvas
            ref={canvasRef}
            className="block aspect-[3/2] w-full touch-none"
            onPointerMove={pointPaddle}
            onPointerDown={(event) => { pointPaddle(event); event.currentTarget.setPointerCapture(event.pointerId); }}
            aria-label={t.canvasLabel}
            role="img"
          />
          {overlay && (
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-background/60 px-3 pb-5 text-center sm:items-center sm:px-5 sm:pb-0">
              <div className="flex max-w-sm flex-col items-center gap-2 sm:gap-4">
                <span aria-hidden="true" className="hidden text-2xl text-primary sm:block">✦</span>
                <h2 className="font-heading text-[length:var(--text-arcade-label)] leading-relaxed text-foreground sm:text-xl">{title}</h2>
                <p className="text-[length:var(--text-arcade-label)] leading-relaxed text-muted-foreground sm:text-sm">{detail}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 px-1 pt-4 sm:px-3">
          <div className="flex gap-5 sm:gap-9" aria-live="polite" aria-atomic="true">
            <div className="flex flex-col gap-1"><span className="text-[length:var(--text-arcade-label)] tracking-widest text-muted-foreground">{t.score}</span><strong className="font-heading text-sm text-primary sm:text-base">{String(display.score).padStart(4, "0")}</strong></div>
            <div className="flex flex-col gap-1"><span className="text-[length:var(--text-arcade-label)] tracking-widest text-muted-foreground">{t.lives}</span><strong className="font-heading text-sm sm:text-base">{String(display.lives).padStart(2, "0")}</strong></div>
          </div>
          <div className="flex items-center gap-2">
            {display.phase === "playing" ? (
              <Button variant="outline" size="lg" onClick={(event) => { pauseGame(gameRef.current); sync(); event.currentTarget.blur(); }}><Pause data-icon="inline-start" />{t.pause}</Button>
            ) : (
              <Button size="lg" onClick={(event) => { primaryAction(); event.currentTarget.blur(); }}><Play data-icon="inline-start" />{display.phase === "paused" ? t.resume : display.phase === "won" || display.phase === "lost" ? t.replay : t.play}</Button>
            )}
            <Button variant="ghost" size="icon-lg" onClick={(event) => { restart(); event.currentTarget.blur(); }} aria-label={t.restart} title={t.restart}><RotateCcw /></Button>
          </div>
        </div>
      </div>
      <p className="sr-only" role="status">{title && `${title}. ${detail} `}{t.score}: {display.score}. {t.lives}: {display.lives}.</p>
    </section>
  );
}
