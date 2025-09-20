 const express = require("express");// importing exress
const { nanoid } = require("nanoid"); // generating nanoid sessions for authentication
const logger = require("./middleware/logger");// importing middleware

const app = express();
app.use(express.json()); 
app.use(logger);         // calling the middle ware  which i kept in separate foldder

const PORT = process.env.PORT || 3000;
const urlDB = new Map(); //  not connecting to mongo thats why


// THE REQUIRED POST ROUTE AS PER THE QUESTION 

app.post("/shorten", (req, res) => {
  const { url, validity, customCode } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
// WITH NANOID
  const shortCode = customCode || nanoid(6);
  if (urlDB.has(shortCode)) {
    return res.status(400).json({ error: "Shortcode already in use" });
  }

  const expiryMinutes = Number.isInteger(validity) ? validity : 30;
  /// defining the expiry 
  const expiresAt = new Date(Date.now() + expiryMinutes * 60000);

  urlDB.set(shortCode, { url, expiresAt });

  return res.status(201).json({
    shortUrl: `http://localhost:${PORT}/${shortCode}`,
    shortCode,
    expiresAt: expiresAt.toISOString(),
  });
});

// ---- GET /:shortcode ----
app.get("/:code", (req, res) => {
  const record = urlDB.get(req.params.code);
  if (!record) return res.status(404).json({ error: "Shortcode not found" });

  if (new Date() > record.expiresAt) {
    return res.status(410).json({ error: "Shortcode expired" });
  }

  return res.redirect(record.url);
});

app.listen(PORT, () => {
  console.log(`Congo ! Server running at http://localhost:${PORT}`);
});
