import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer, type IncomingMessage } from "http";
import { runMigrations } from 'stripe-replit-sync';
import { getStripeSync } from "./stripeClient";
import { WebhookHandlers } from "./webhookHandlers";

const app = express();
const httpServer = createServer(app);

// نضيف rawBody على IncomingMessage مع نوع واضح
declare module "http" {
  interface IncomingMessage {
    rawBody?: Buffer;
  }
}

// نضمن أن Request فعلاً يورّث من IncomingMessage بعد التوسيع
declare module "express-serve-static-core" {
  interface Request extends IncomingMessage {}
}

// Initialize Stripe on startup
async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.warn('DATABASE_URL not found - Stripe integration skipped');
    return;
  }

  try {
    console.log('Initializing Stripe schema...');
    await runMigrations({ 
      databaseUrl,
      schema: 'stripe'
    });
    console.log('Stripe schema ready');

    const stripeSync = await getStripeSync();

    console.log('Setting up managed webhook...');
    const webhookBaseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
    const { webhook, uuid } = await stripeSync.findOrCreateManagedWebhook(
      `${webhookBaseUrl}/api/stripe/webhook`,
      {
        enabled_events: ['*'],
        description: 'Managed webhook for Stripe sync',
      }
    );
    console.log(`Webhook configured: ${webhook.url} (UUID: ${uuid})`);

    console.log('Syncing Stripe data...');
    stripeSync.syncBackfill()
      .then(() => {
        console.log('Stripe data synced');
      })
      .catch((err) => {
        console.error('Error syncing Stripe data:', err);
      });
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
  }
}

// Webhook route BEFORE express.json()
app.post(
  '/api/stripe/webhook/:uuid',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature' });
    }

    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;

      if (!Buffer.isBuffer(req.body)) {
        console.error('STRIPE WEBHOOK ERROR: req.body is not a Buffer');
        return res.status(500).json({ error: 'Webhook processing error' });
      }

      const { uuid } = req.params;
      await WebhookHandlers.processWebhook(req.body as Buffer, sig, uuid);

      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error.message);
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      // نحتفظ بالـ raw body (مفيد للـ webhooks مثلاً)
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

// اختيارية: دالة بسيطة لتنظيف الرد قبل اللوق
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

// ميدلوير اللوق للـ /api
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: unknown;

  const originalResJson = res.json.bind(res);
  // نلف res.json ونحتفظ بالـ body اللي طالع
  res.json = ((body?: any) => {
    capturedJsonResponse = body;
    return originalResJson(body);
  }) as typeof res.json;

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

      if (capturedJsonResponse !== undefined) {
        // نتجنب لوق ضخم أو تسريب بيانات؛ نطبع فقط في non-production وبحد طول معيّن
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

// Error handler مركزي
function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  // لو الرد بدأ يتبعت، نخلي Express يتصرف
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";

  log(`${status} error: ${message}`, "error");

  // في أخطاء السيرفر نطبع الستاك للكونسول
  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ message });
}

(async () => {
  try {
    // Initialize Stripe
    await initStripe();

    // نسجل الراوتس أول
    await registerRoutes(httpServer, app);

    // بعد الراوتس نفعّل الـ error handler
    app.use(errorHandler);

    // في الإنتاج نخدم ملفات ثابتة؛ في التطوير نستخدم Vite
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
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
    // لو في خطأ أثناء الإقلاع، نخرج بكود فشل واضح
    process.exit(1);
  }
})();
