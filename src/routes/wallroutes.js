const express = require("express");
const { getWall, createWall, getCat } = require("../controllers/wallControllers");
const wallRouter = express();

wallRouter.get("/", getWall);

wallRouter.post("/", createWall);

wallRouter.get("/cat", getCat);

module.exports = wallRouter;