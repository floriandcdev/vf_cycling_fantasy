require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const cyclistsList = require("./cyclistsList");
const cyclistsListUser = require("./cyclistsListUser");
const racesList = require("./racesList");
const racesListUser = require("./racesListUser");
const savePlayerTeam = require("./savePlayerTeam");
const userTeam = require("./userTeam");
const getScale = require("./getScale");
const ranking = require("./ranking");
const joinLeague = require("./joinLeague");
const createLeague = require("./createLeague");
const leagueListUser = require("./leagueListUser");
const getRaceDetail = require("./getRaceDetail");
const raceRanking = require("./raceRanking");
const signUp = require("./signUp");
const logIn = require("./logIn");
const logOut = require("./logOut");
const verifySession = require("./verifySession");

const app = express();

app.use(cors({
  origin: true,
  optionsSuccessStatus: 200,
  credentials: true
}));

/*app.use(cors({
  origin: 'https://test.dreameragency.fr',
  optionsSuccessStatus: 200,
  credentials: true
}));*/

app.use(express.json());
app.use(cookieParser());

const authenticateJWT = require("./authentificateJWT");

const protectedRoutes = express.Router();
protectedRoutes.use(authenticateJWT);

protectedRoutes.get("/api/cyclists-list-user/:leagueId", cyclistsListUser);
protectedRoutes.get("/api/races-list-user/:leagueId", racesListUser);
protectedRoutes.post("/api/savePlayerTeam", savePlayerTeam);
protectedRoutes.get("/api/userTeam/:leagueId", userTeam);
protectedRoutes.get("/api/ranking/:leagueId", ranking);
protectedRoutes.post("/api/joinLeague/:leagueId", joinLeague);
protectedRoutes.post("/api/createLeague", createLeague);
protectedRoutes.get("/api/leagueListUser", leagueListUser);


app.get("/api/cyclists-list/:leagueId", cyclistsList);
app.get("/api/races-list", racesList);
app.get("/api/scale", getScale);
app.get("/api/get-race-detail/:idRace", getRaceDetail);
app.get("/api/race-ranking/:idRace", raceRanking);
app.post("/api/sign-up", signUp);
app.post("/api/log-in", logIn);
app.post("/api/log-out", logOut);
app.get("/api/verify-session", verifySession);

app.get("/api/online", (req, res) => {
  res.send("API VF Cylcing Fantasy en ligne");
});

app.use("/", protectedRoutes);

app.listen(6268, () => {
  console.log("Serveur démarré sur http://localhost:6268");
});

