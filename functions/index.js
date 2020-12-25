const functions = require('firebase-functions');
const express = require("express");
const app = express();
const routers = require("./routers/route");

app.use("/", routers)


exports.api = functions.region("asia-northeast2").https.onRequest(app);
