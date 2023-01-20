import express from "express";
import userService from "../db/UserService";
import authJwt from "./middleware/auth.jwt";

export default function userController(app: express.Express) {
  app.use(async (req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("/user", [authJwt.verifyToken], async (req, res) => {
    const user = await userService.findUserByAddress(req.userId);
    res.status(200).send(user);
  });
}
