const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const userList = require("./secret/users.json");

const moment = require("moment");
const cors = require("cors");
const FAKE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDgzMTk3OTMsImVtYWlsIjoiYWRtaW4iLCJ1c2VyX3R5cGUiOjF9.4BbV7QUGhNWQH8o4M1MqzdPByp-QtP2m6-AbjmImcuk";

const app = express();
const jsonParser = bodyParser.json();

var http = require("http");

app.use(cors());
// app.use(bodyParser);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
// app.use(app.router);
app.use(express.static("public"));
//....................................................................................
async function startServer() {
  const httpServer = http.createServer(app);
  httpServer.listen(8000, () =>
    console.log("express listening on port 8000...")
  );
}
startServer();
//....................................................................................
function verifyToken(req, res) {
  const newToken = req.headers.token.replace("Bearer ", "");
  if (newToken === FAKE_TOKEN) return newToken;

  res.json({
    status: "fail",
    description: "invalid token",
  });
}
//....................................................................................
async function onLogin(req, res) {
  const body = req.body;

  try {
    const { email: u, password: p } = body;

    let found = false;
    if (u && p) {
      userList.forEach((usr) => {
        if (usr.email == u && usr.password == p) {
          res.json({
            Token: FAKE_TOKEN,
          });
          found = true;
        }
      });
    }

    if (!found) {
      res.json({
        status: "fail",
        description: "User/Password not matched",
      });
    }
  } catch (error) {
    res.json({
      status: "fail",
      description: error.message,
    });
  }
}
app.post("/users/login", jsonParser, onLogin);
//....................................................................................
async function onHello(req, res) {
  const utc = req.query.utc;
  if (!verifyToken(req, res)) {
    return;
  }

  res.json({
    status: "ok",
    data: "Hello",
  });
}
app.get("/hello/", onHello);
//....................................................................................
async function onDefault(req, res) {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
}
app.get("*", onDefault);
app.get("/", onDefault);
