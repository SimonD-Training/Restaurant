const express = require('express');
const dotenv = require('dotenv');
const api = require('./routes/hub');
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port: ${port}..`));

app.get("*.*", express.static("../dist/restaurant", { maxAge: "1y" })); //sets up the URIs for collecting the resources angular needs from the root of dist/projectmanager
app.get("/api/*", api);
app.post("*", api);
app.put("*", api);
app.delete("*", api);
app.get("/*", (req, res) => {
  res.status(200).sendFile(`/`, { root: "../dist/restaurant" });
});