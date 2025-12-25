const express = require("express");
const path = require("path");
const app = express();

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Route all other requests to index.html (for SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 9242;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});