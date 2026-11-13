import MongoStore from "connect-mongo";
import session from "express-session";

import { type Env } from "#/configurations/env";
const sessionConfig = (env: Env) => {
  const sessionStore = MongoStore.create({
    mongoUrl: env.DB_URI,
    collectionName: "sessions", // Sessions will be stored here
    ttl: 60 * 60 * 24 * 30, // 30 days
    autoRemove: "native",
  });
  return session({
    secret: env.JWT_KEY, // Use a secure key, e.g., your existing JWT_KEY
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
    },
  });
};
export default sessionConfig;
