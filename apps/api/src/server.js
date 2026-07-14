import cors from "cors";
import express from "express";
import { z } from "zod";
import { migrate, pool } from "./db.js";
import { buildDnsRecords } from "./dns.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const defaultHostname = process.env.E_MAILER_HOSTNAME || "mail.example.com";

app.use(cors());
app.use(express.json());

const domainSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3)
    .max(253)
    .regex(/^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/),
  hostname: z.string().trim().min(3).max(253).optional(),
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "e-mailer-api" });
});

app.get("/api/domains", async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, name, hostname, dkim_selector, created_at FROM domains ORDER BY created_at DESC"
    );

    res.json({
      domains: result.rows.map((domain) => ({
        ...domain,
        dnsRecords: buildDnsRecords(domain.name, domain.hostname, domain.dkim_selector),
      })),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/domains", async (req, res, next) => {
  try {
    const input = domainSchema.parse(req.body);
    const hostname = input.hostname || defaultHostname;

    const result = await pool.query(
      `INSERT INTO domains (name, hostname)
       VALUES ($1, $2)
       ON CONFLICT (name)
       DO UPDATE SET hostname = EXCLUDED.hostname
       RETURNING id, name, hostname, dkim_selector, created_at`,
      [input.name.toLowerCase(), hostname.toLowerCase()]
    );

    const domain = result.rows[0];

    res.status(201).json({
      domain: {
        ...domain,
        dnsRecords: buildDnsRecords(domain.name, domain.hostname, domain.dkim_selector),
      },
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/domains/:id/dns", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, name, hostname, dkim_selector FROM domains WHERE id = $1",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Domain not found" });
      return;
    }

    const domain = result.rows[0];
    res.json({
      records: buildDnsRecords(domain.name, domain.hostname, domain.dkim_selector),
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: "Invalid request", details: error.errors });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

await migrate();

app.listen(port, () => {
  console.log(`E-Mailer API listening on port ${port}`);
});
