import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import { landService } from "./db/LandService";
import { towerService } from "./db/TowerService";

/**
 * Import your Room files
 */
import { Map1 } from "./rooms/maps/Map_1";
import { Map2 } from "./rooms/maps/Map_2";
import { Map3 } from "./rooms/maps/Map_3";
import { contractUpdates } from "./web3/DefaultSocketProvider";

export default Arena({
  getId: () => "Your Colyseus App",

  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define("map_1", Map1);
    gameServer.define("map_2", Map2);
    gameServer.define("map_3", Map3);
  },

  initializeExpress: (app) => {
    /**
     * Bind your custom express routes here:
     */

    app.get("/", (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    app.get("/metadata/land/:landId", async (req, res) => {
      const id = parseInt(req.params.landId);

      const l = await landService.findLandById(id);

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
    /**
     * Bind @colyseus/monitor
     * It is recommended to protect this route with a password.
     * Read more: https://docs.colyseus.io/tools/monitor/
     */
    app.use("/colyseus", monitor());

    contractUpdates.listenAll();
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
