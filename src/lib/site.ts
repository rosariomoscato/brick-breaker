export const siteUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const site = {
  name: "Brick Breaker",
  description: "Gioca a Brick Breaker online: un classico arcade gratuito con racchetta, mattoni e tre vite. Disponibile in italiano e inglese.",
};

export const publicPages = [
  { path: "/", title: "Brick Breaker", summary: "Gioca online a Brick Breaker, in italiano o in inglese." },
  { path: "/status", title: "Stato del gioco", summary: "Informazioni sul funzionamento del gioco nel browser." },
];
