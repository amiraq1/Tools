import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer, type IncomingMessage } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody?: Buffer;
  }
}

declare module "express-serve-static-core" {
  interface Request extends IncomingMessage {}
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

function sanitizeResponseBody(body: unknown): unknown {
  if (body && typeof body === "object") {
    const cloned: any = { ...(body as Record<string, unknown>) };

    const sensitiveKeys = [
      "password",
      "token",
      "accessToken",
      "refreshToken",
      "secret",
    ];
    for (const key of sensitiveKeys) {
      if (key in cloned) {
        cloned[key] = "[REDACTED]";
      }
    }

    return cloned;
  }

  return body;
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: unknown;

  const originalResJson = res.json.bind(res);
  res.json = ((body?: any) => {
    capturedJsonResponse = body;
    return originalResJson(body);
  }) as typeof res.json;

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

      if (capturedJsonResponse !== undefined) {
        if (process.env.NODE_ENV !== "production") {
          const safeBody = sanitizeResponseBody(capturedJsonResponse);
          const serialized = JSON.stringify(safeBody);
          const maxLength = 2000;

          logLine += ` :: ${
            serialized.length > maxLength
              ? serialized.slice(0, maxLength) + "...[truncated]"
              : serialized
          }`;
        }
      }

      log(logLine);
    }
  });

  next();
});

function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";

  log(`${status} error: ${message}`, "error");

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ message });
}

(async () => {
  try {
    await registerRoutes(httpServer, app);

    app.use(errorHandler);

    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    const port = Number.parseInt(process.env.PORT ?? "5000", 10);

    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        log(`serving on port ${port}`);
      },
    );
  } catch (err) {
    console.error("Fatal error during server startup:", err);
    process.exit(1);
  }
})();
