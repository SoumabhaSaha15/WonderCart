import express from "express";
import pino_http from "pino-http";

import userRouter from "@/router/user/index";

const router = express.Router();

router
  .use(
    pino_http({
      level: "info",
      serializers: {
        req: () => undefined,
        res: () => undefined,
      },

      customReceivedMessage: (req, res) =>
        `Incoming request: ${req.method} ${req.url} ${res.statusCode}`,
      // customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
      // customErrorMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
    }),
  )
  .use(userRouter);

export default router;
