import express from "express";
import towerService from "../db/TowerService";

export default function towerController(app: express.Express) {
  app.get("/tower/upgrade/:towerId", async (req, res) => {
    const id = parseInt(req.params.towerId);

    // user need to be auth
    // check if user is owner of the tower to upgrade.
    // and if all that is true, proceed to upgrade.

    const towerId = 0;
    await towerService.upgradeTower(towerId);
  });
}
