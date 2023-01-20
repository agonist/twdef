import { recoverPersonalSignature } from "@metamask/eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import express from "express";
import moment from "moment";
import prisma from "../db/DbService";
import jwt from "jsonwebtoken";

// TODO PUT IN ENV
export const JWT_SECRET = "xxxx";

const getRandomNonceMessage = (nonce: string) => {
  return (
    "Please prove you control this wallet by signing this random text: " + nonce
  );
};

export default function authController(app: express.Express) {
  app.use(async (req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/auth/authChallenge", async (req, res) => {
    const address = req.body.address.toLowerCase();
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const unix = moment().unix();

    try {
      const user = await prisma.user.upsert({
        where: { address: address },
        create: {
          address: address,
          balance: 0,
          auth: {
            create: {
              nonce: nonce,
              timestamp: unix,
            },
          },
        },
        update: {
          auth: {
            upsert: {
              create: {
                nonce: nonce,
                timestamp: unix,
              },
              update: {
                nonce: nonce,
                timestamp: unix,
              },
            },
          },
        },
      });

      res.status(200).send({ message: getRandomNonceMessage(nonce) });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  });

  app.post("/auth/auth_verify", async (req, res) => {
    const address = req.body.address.toLowerCase();
    const signature = req.body.signature;
    try {
      //load user by public address
      const user = await prisma.user.findUnique({
        where: { address: address },
        include: { auth: true },
      });

      if (!user) return res.status(401).send({ message: "User Not found." });

      //get authdetails for user
      const nonce = user.auth.nonce;
      const timestamp_challenge = user.auth.timestamp;

      //check time difference
      var diff_sec = moment().diff(moment.unix(timestamp_challenge), "seconds");
      if (diff_sec > 300)
        return res.status(401).send({
          message:
            "The challenge must have been generated within the last 5 minutes",
        });

      const signerAddress = recoverPersonalSignature({
        data: bufferToHex(Buffer.from(getRandomNonceMessage(nonce), "utf8")),
        signature: signature,
      });

      if (address !== signerAddress.toLowerCase())
        return res.status(401).send({ message: "Invalid Signature" });

      var token = jwt.sign({ id: user.address }, JWT_SECRET, {
        expiresIn: 86400 * 30, // 30 days 
      });

      res.status(200).send({
        address: user.address,
        accessToken: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  });
}
