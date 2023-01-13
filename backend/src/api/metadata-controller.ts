import express from "express";
import landService from "../db/LandService";
import towerService from "../db/TowerService";

export default function metadataController(app: express.Express) {
  app.get("/metadata/land/:landId", async (req, res) => {
    const id = parseInt(req.params.landId);

    const l = await landService.findLandById(id);
    if (l === null) {
      res.status(404).send("not found");
    }
    const attr: any[] = [
      {
        trait_type: "Type",
        value: l.type,
      },
    ];
    if (l.minted) {
      attr.push({
        display_type: "number",
        trait_type: "Damage Boost",
        value: l.damageBonus,
      });
    }
    res.json({
      name: "Land#" + id,
      description: "",
      image: l.imgUrl,
      attributes: attr,
    });
  });

  app.get("/metadata/tower/:towerId", async (req, res) => {
    const id = parseInt(req.params.towerId);

    const t = await towerService.findTowerById(id);
    if (t === null) {
      res.status(404).send("not found");
      return;
    }

    const attr: any[] = [
      {
        trait_type: "Type",
        value: t.type,
      },
      {
        trait_type: "Damage",
        value: t.damage,
      },
      {
        trait_type: "Speed",
        value: t.speed,
      },
      {
        trait_type: "Level",
        value: t.level,
      },
    ];
    res.json({
      name: "Tower#" + id,
      description: "",
      image: t.imgUrl,
      attributes: attr,
    });
  });
}
